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


require('dotenv').config({ path: '.env' });
const jwtSecret = process.env.JWT_SECRET;


const upload = multer(); 


const app = express();

app.use(cors());


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




async function testBcrypt() {
  const password = '123'; // Example password
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log('Password:', password);
  console.log('Hashed Password:', hashedPassword);

  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log('Do they match?', isMatch);
}

// testBcrypt().catch(console.error);

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
      subject: 'Verify Your Email',
      text: `Your email verification code is: ${verificationCode}. Please enter this code in the app to verify your email.`,
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
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

app.post('/verify-email', async (req, res) => {
  const { email, verificationCode } = req.body;

  console.log(email, verificationCode);
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
    // console.log(password);
    // console.log(user.password);
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
  const { title, description, poster, date, location, tags } = req.body;
  const file = req.file;

  try {
    let imageUrl = '';

    if (file) {
      const formData = new FormData();
      formData.append('image', file.buffer.toString('base64'));

      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.ImgBB_API_KEY}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      imageUrl = response.data.data.url;
    }

    const event = new Event({
      title,
      description,
      poster: poster || 'admin', // Use 'admin' as the default value
      date,
      location,
      image: imageUrl,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: "Error creating event", error: error.message });
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
  console.log("Hits the get call\n"); 
  const { id } = req.params;

  try {
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ likes: event.likes });
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed   to get like count', error: error.message });
  }
});


app.put('/events/:id/like', authenticateAndVerify, async (req, res) => {
  const { id } = req.params;
  const user = req.user;

  try {
    console.log('Received like request for event ID:', id);
    console.log('Authenticated user:', user.username);

    const event = await Event.findById(id);

    if (!event) {
      console.log('Event not found');
      return res.status(404).json({ message: 'Event not found' });
    }

    if (user.likedEvents.includes(id)) {
      // User has already liked the event, so unlike it
      event.likes -= 1;
      user.likedEvents = user.likedEvents.filter(eventId => eventId.toString() !== id);

      await event.save();
      await user.save();

      console.log('Event unliked successfully', event.likes);
      return res.json({ message: 'Event unliked successfully', likes: event.likes });
    } else {
      // User has not liked the event yet, so like it
      event.likes += 1;
      user.likedEvents.push(id);

      await event.save();
      await user.save();

      console.log('Event liked successfully', event.likes);
      return res.json({ message: 'Event liked successfully', likes: event.likes });
    }
  } catch (error) {
    console.error('Failed to like event:', error);
    res.status(500).json({ message: 'Failed to like event', error: error.message });
  }
});



app.post('/events/:id/like', authenticateAndVerify, async (req, res) => {
  console.log("Hits the post call\n"); 
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
  console.log("Trying to delete event:", id);

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


