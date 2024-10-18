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
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');
const fs = require('fs');
const { PDFImage } = require("pdf-image");
require('dotenv').config({ path: '.env' });
const jwtSecret = process.env.JWT_SECRET;
const { startSync } = require('./sqldb');
const { getNextSequence } = require('./counter');


async function deleteEventsByUser(email) {
  try {
    const result = await Event.deleteMany({ poster: email });

    if (result.deletedCount > 0) {
      console.log(`Deleted ${result.deletedCount} events posted by ${email}`);
    } else {
      console.log(`No events found posted by ${email}`);
    }
  } catch (error) {
    console.error('Error deleting events:', error);
  } finally {
    mongoose.connection.close();
  }
}

const addEventsToDatabase = async () => {
  try {
    const eventsPath = path.join(__dirname, 'cleaned_events.json');
    const eventsData = fs.readFileSync(eventsPath, 'utf-8');

    const events = JSON.parse(eventsData);

    for (const event of events) {
      if (!event.endDateTime) {
        event.endDateTime = new Date(new Date(event.startDateTime).getTime() + 3 * 60 * 60 * 1000); // 3 hours later
      }

      const newEvent = new Event(event);
      await newEvent.save();
      console.log(`Event ${newEvent.title} added successfully.`);
    }

    console.log('All events added successfully.');
  } catch (error) {
    console.error('Error adding events to the database:', error.message);
  }
};

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


const app = express();

const corsOptions = {
  origin: ['http://localhost:5173', 'https://rpieventhub.com', 'http://localhost:3000'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));


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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
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




app.use(express.json());

mongoose
.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('MongoDB Connected');
  startSync();
})
.catch((err) => console.log(err));

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use." });
    }

    // Generate a 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    const user = new User({
      username,
      email,
      password, // Assuming password hashing is handled in User model
      emailVerified: false,
      verificationCode,
    });
    await user.save();

    // Send verification email with the code
    sendEmail({
      to: email,
      subject: 'RPI EventHub Email Verification Code',
      text: `Dear User,\n\nThank you for registering with RPI EventHub. To complete your email verification, please use the following code:\n\nVerification Code: ${verificationCode}\n\nPlease enter this code in the app to verify your email address.\n\nBest regards,\nRPI EventHub Team`,
    });

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id, email: user.email, emailVerified: user.emailVerified, username: user.username}, process.env.JWT_SECRET, { expiresIn: '24h' });

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
    
    const token = jwt.sign({ userId: user._id, email: user.email, emailVerified: user.emailVerified, username: user.username  }, jwtSecret, { expiresIn: '24h' });
    res.status(200).json({ token, userId: user._id, emailVerified: user.emailVerified, message: "Logged in successfully" });
    
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
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
    // Generate a unique eventId automatically
    const eventId = await getNextSequence('eventId');

    const event = new Event({
      eventId, // Auto-generated eventId
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
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(400).json({ message: 'Error creating event', error: error.message });
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
    // const likedEvent = user.likedEvents.filter(e => e.toString() == id.toString())[0];
    // res.status(200).json({ liked: likedEvent }); 
    res.status(200).json(user.likedEvents.map(e => e.toString()))
  } catch (error) {
    res.status(500).json({ message: 'Server error', error }); 
  }
});

app.post('/events/:id/like', authenticateAndVerify, async (req, res) => {

  const { id } = req.params; // Use 'id' to match the route parameter
  const { liked } = req.body;
  const userId = req.user._id; // Get user ID from the user object

  try {
    const event = await Event.findById(id);
    const user = await User.findById(userId); // Fetch the user based on the ID

    if (!event || !user) {
      return res.status(404).json({ message: 'Event or User not found' });
    }

    // Check if the user has already liked the event
    const hasLiked = user.likedEvents.includes(id);

    if (liked && !hasLiked) {
      // User is liking the event, increment likes and add to likedEvents
      event.likes += 1;
      user.likedEvents.push(id); 
    } else if (!liked && hasLiked) {
      // User is unliking the event, decrement likes and remove from likedEvents
      event.likes -= 1;
      user.likedEvents = user.likedEvents.filter(
        (eventId) => eventId.toString() !== id
      );
    }

    await event.save(); 
    await user.save();

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

    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
});


app.get('/verify-token', authenticate, (req, res) => {
  res.sendStatus(200);
});


app.use(express.static(path.join(__dirname, '../frontend/dist')));


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


