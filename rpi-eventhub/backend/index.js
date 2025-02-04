const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer');
const User = require('./models/User');
const Event = require('./models/Event'); 
const { sendEmail } = require('./services/emailService');
const axios = require('axios');
const FormData = require('form-data');
const path = require('path');
const cors = require('cors');
const sharp = require('sharp');
const fs = require('fs');
const { PDFImage } = require("pdf-image");
require('dotenv').config({ path: '.env' });
const { getEvents, extractEvents } = require('./services/getRPIEventsService');
const { logger, uploadLogFileToAzure, readLogFile} = require('./services/eventsLogService');

const jwtSecret = process.env.JWT_SECRET;

const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'https://rpieventhub.com', 'http://localhost:3000'],
  optionsSuccessStatus: 200,
};

// Apply Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
      return cb(new Error('Please upload an image file.'));
    }
    cb(null, true);
  },
}).single('file');

const compressImage = async (fileBuffer) => {
  try {
    let compressedBuffer = fileBuffer;
    let quality = 95;
    let compressedSize = fileBuffer.length;

    while (compressedSize > 100 * 1024 && quality > 20) {
      compressedBuffer = await sharp(fileBuffer)
        .resize({ width: 1000 })
        .jpeg({ quality })
        .toBuffer();
      compressedSize = compressedBuffer.length;
      quality -= 5;
    }

    return compressedBuffer;
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

const convertPdfToImage = async (pdfBuffer) => {
  try {
    const tempFilePath = './temp.pdf';
    fs.writeFileSync(tempFilePath, pdfBuffer);

    const pdfImage = new PDFImage(tempFilePath, {
      combinedImage: true,
      convertOptions: {
        "-resize": "1000x",
        "-quality": "95"
      }
    });

    const imagePath = await pdfImage.convertPage(0);
    const imageBuffer = fs.readFileSync(imagePath);

    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(imagePath);

    return imageBuffer;
  } catch (error) {
    console.error('Error converting PDF to image:', error);
    throw error;
  }
};

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Please authenticate.' });
  }
};

const authenticateAndVerify = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, jwtSecret);
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error('User not found');
    }

    if (!user.emailVerified) {
      return res.status(403).json({ message: 'Please verify your email to perform this action.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ message: 'Please authenticate.' });
  }
};

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const user = new User({
      username,
      email,
      password,
      emailVerified: false,
      verificationCode,
    });
    await user.save();

    sendEmail({
      to: email,
      subject: 'RPI EventHub Email Verification Code',
      text: `Dear User,\n\nThank you for registering with RPI EventHub. To complete your email verification, please use the following code:\n\nVerification Code: ${verificationCode}\n\nPlease enter this code in the app to verify your email address.\n\nBest regards,\nRPI EventHub Team`,
    });

    const token = jwt.sign({ 
      userId: user._id, 
      email: user.email, 
      emailVerified: user.emailVerified, 
      username: user.username 
    }, process.env.JWT_SECRET, { expiresIn: '24h' });
    logger.info(`User ${user.username} signed up---${new Date()}`);

    res.status(201).json({
      message: "User created successfully. Please check your email to verify your account.",
      token: token,
      email: user.email, 
      emailVerified: user.emailVerified
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user. It's possible that username or email address already exist.", error: error.message });
  }
});

app.post('/verify-email', async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    const user = await User.findOne({ email, verificationCode });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or verification code." });
    }

    if (user.verificationCode === verificationCode) {
      user.emailVerified = true;
      user.verificationCode = '';
      await user.save();

      const token = jwt.sign({ 
        userId: user._id, 
        email: user.email, 
        emailVerified: user.emailVerified, 
        username: user.username 
      }, process.env.JWT_SECRET, { expiresIn: '24h' });
      logger.info(`User ${user.username} email verified---${new Date()}`);

      res.status(200).json({ message: "Email verified successfully.", token });
    } else {
      res.status(400).json({ message: "Invalid verification code." });
    }
  } catch (error) {
    console.error("Error during email verification:", error.message);
    res.status(500).json({ message: "An error occurred during email verification." });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email does not exist" });
    }
    const isMatch = await bcrypt.compare(password.trim(), user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Password is incorrect" });
    }
    // Generate a token
    const token = jwt.sign({ 
      userId: user._id, 
      email: user.email, 
      emailVerified: user.emailVerified, 
      username: user.username  
    }, jwtSecret, { expiresIn: '24h' });

    logger.info(`User ${user.username} logged in---${new Date()}`);

    res.status(200).json({ 
      token, 
      userId: user._id, 
      emailVerified: user.emailVerified, 
      message: "Logged in successfully" 
    });
    
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
});

app.get('/rpi-events', async (req, res) => {
  //hardcoded values for now
    const count = "NaN";
    const days = 7;
    let events = null;
    let eventsList = [];
    try {
       events = await getEvents(count, days);
       eventsList = extractEvents(events);
       console.log('Successfully fetched RPI events');
       res.status(200).json(eventsList);
    } catch (error) {
        console.error('Error fetching RPI events:', error);
        res.status(500).json({ message: 'Error fetching RPI events', error: error.message });
    }
});


// Event Creation Route with Auto-Generated eventId
app.post('/events', upload, async (req, res) => {
  const { title, description, poster, startDateTime, endDateTime, location, tags, club, rsvp } = req.body;
  const file = req.file;
  try {
    let imageUrl = '';
    if (file) {
      let imageBuffer;
      if (file.mimetype === 'application/pdf') {
        imageBuffer = await convertPdfToImage(file.buffer);
      } else {
        imageBuffer = await compressImage(file.buffer);
      }
      const formData = new FormData();
      formData.append('image', imageBuffer.toString('base64'));
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.ImgBB_API_KEY}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data && response.data.data && response.data.data.url) {
        imageUrl = response.data.data.url;
      } else {
        throw new Error('Image upload failed or no URL returned');
      }
    }

    // check for duplicates
    const existingEvent = await Event.findOne({ title, startDateTime });
    if (existingEvent) {
      return res.status(409).json({ message: 'Event with the same title and date already exists.' });
    }

    const event = new Event({
      title,
      description,
      poster: poster || 'admin',
      startDateTime,
      endDateTime,
      location,
      image: imageUrl,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      club,
      rsvp
    });

    await event.save();
    // Log the event creation
    logger.info(`Event CREATED: ${title} start at ${startDateTime}---${new Date()}`);
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    if (error.code === 11000) {
      res.status(409).json({ message: 'Event with the same title and date already exists.' });
    } else {
      res.status(400).json({ message: 'Error creating event', error: error.message });
    }
  }
});

// Route for fetching all events
app.get('/events', async (req, res) => {
  try {
      const events = await Event.find();
      res.status(200).json(events);
  } catch (error) {
      res.status(500).json({ message: "Error fetching events", error: error.message });
  }
});

app.get('/events/:id/like', async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ likes: event.likes });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to get like count', error: error.message });
  }
});

app.get('/events/like/status', authenticate, async (req, res) => {
  const user = req.user;
  
  try {
    res.status(200).json(user.likedEvents.map(e => e.toString()))
  } catch (error) {
    res.status(500).json({ message: 'Server error', error }); 
  }
});

app.post('/events/:id/like', authenticate, async (req, res) => {

  const { id } = req.params;
  const { liked } = req.body;
  const userId = req.user._id;

  try {
    const event = await Event.findById(id);
    const user = await User.findById(userId);

    if (!event || !user) {
      return res.status(404).json({ message: 'Event or User not found' });
    }

    const hasLiked = user.likedEvents.includes(id);

    if (liked && !hasLiked) {
      event.likes += 1;
      user.likedEvents.push(id); 
    } else if (!liked && hasLiked) {
      event.likes -= 1;
      user.likedEvents = user.likedEvents.filter(
        (eventId) => eventId.toString() !== id
      );
    }

    await event.save(); 
    await user.save();
    // Log the event like/unlike
    logger.info(`Event ${event.title} ${liked ? 'LIKED' : 'UNLIKED'} by ${user.username}. count: ${event.likes}---${new Date()}`);
    res.json({ likes: event.likes });

  } catch (error) {
    console.error('Error during like/unlike:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

app.delete('/events/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    // Log the event deletion
    logger.info(`Event DELETED: ${event.title} start at ${event.startDateTime}---${new Date()}`);
    res.status(200).json({ message: 'Event deleted successfully' });

  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
});

// update event route
// Route to update an event
app.post('/events-update/:id', upload, async (req, res) => {
  const { id } = req.params;
  const updatedEvent = req.body;
  const file = req.file;

  try {
    let imageUrl = '';
    if (file) {
      let imageBuffer;
      if (file.mimetype === 'application/pdf') {
        imageBuffer = await convertPdfToImage(file.buffer);
      } else {
        imageBuffer = await compressImage(file.buffer);
      }
      const formData = new FormData();
      formData.append('image', imageBuffer.toString('base64'));
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.ImgBB_API_KEY}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data && response.data.data && response.data.data.url) {
        imageUrl = response.data.data.url;
      } else {
        return res.status(500).json({ message: 'Image URL not created' });
      }
    }

    if (imageUrl !== '') {
        updatedEvent.image = imageUrl
        delete updatedEvent.file;
    } else {
        delete updatedEvent.file;
    }

    const event = await Event.findByIdAndUpdate(id, updatedEvent, { new: true });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.status(200).json("Event updated successfully");
  } catch (error) {
    res.status(400).json({ message: 'Failed to update event', error: error.message });
  }
});

app.get('/verify-token', authenticate, (req, res) => {
  res.sendStatus(200);
});

app.get('/proxy/image/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findById(eventId);
    if (!event || !event.image) {
      return res.status(404).json({ message: 'Event or image not found' });
    }
    const response = await axios.get(event.image, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'];
    res.set('Content-Type', contentType);
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching image:', error.message);
    res.status(500).json({ message: 'Error fetching image' });
  }
});


// Get the Content of specific log file
app.get('/logs/:date', async (req, res) => {
  const date = req.params.date;
  try {
    const logContent = await readLogFile('rpieventhub-logs', 'events_change', date);
    res.status(200).send(logContent);
  } catch (error) {
    console.error('Error reading log file:', error.message);
    res.status(500).json({ message: 'Error reading log file', error: error.message });
  }
});

app.use(express.static(path.join(__dirname, '../frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});


//Fetching usernames from users
app.get('/usernames', async (req, res)=> {
  try{
    const users = await User.find({}, 'username');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
