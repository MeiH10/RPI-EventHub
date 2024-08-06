const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const multer = require('multer'); // Add this line to require multer
const User = require('./models/User'); // Adjust the path as necessary based on your project structure
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


const upload = multer(); 


const app = express();

const corsOptions = {
  origin: ['http://localhost:3000', 'https://rpi-eventhub-production.up.railway.app/'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const compressImage = async (fileBuffer) => {
  try {
    const compressedBuffer = await sharp(fileBuffer)
      .resize({ width: 1000 }) 
      .jpeg({ quality: 95 })
      .toBuffer();
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




// Middleware
app.use(express.json()); // for parsing application/json

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI ).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

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
      text: 'Dear User,\n\nThank you for registering with RPI EventHub. To complete your email verification, please use the following code:\n\nVerification Code: ${verificationCode}\n\nPlease enter this code in the app to verify your email address.\n\nBest regards,\nRPI EventHub Team',
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

  const user = await User.findOne({ email, verificationCode });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or verification code." });
  }



  if (user.verificationCode === verificationCode) {
    user.emailVerified = true;
    user.verificationCode = '';
    await user.save();
    const token = jwt.sign({ userId: user._id, email: user.email, emailVerified: user.emailVerified}, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ message: "Email verified successfully.", token});
  } else {
    res.status(400).json({ message: "Invalid verification code." });
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


app.post('/events', upload.single('file'), async (req, res) => {
  const { title, description, poster, date, location, tags, time, club, rsvp } = req.body;
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
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data && response.data.data && response.data.data.url) {
        imageUrl = response.data.data.url;
      } else {
        throw new Error('Image upload failed or no URL returned');
      }
    }

    const event = new Event({
      title,
      description,
      poster: poster || 'admin', // Use 'admin' as the default value
      date,
      location,
      image: imageUrl,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      time,
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



app.post('/events/:id/like', authenticateAndVerify, async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Increment the likes count for the event
    event.likes += 1;
    await event.save();

    // Add the event ID to the user's likedEvents array if not already liked
    if (!user.likedEvents.includes(id)) {
      user.likedEvents.push(id);
      await user.save();
    }

    res.json({ message: 'Event liked successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to like event', error: error.message });
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


app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


