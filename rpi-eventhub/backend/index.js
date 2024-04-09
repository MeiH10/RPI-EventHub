const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path as necessary based on your project structure
const Event = require('./models/Event'); 
const { sendEmail } = require('./services/emailService');

require('dotenv').config({ path: '../.env' });
const jwtSecret = process.env.JWT_SECRET;
const crypto = require('crypto'); // Add this at the top of your index.js


const app = express();



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
    
    res.status(201).json({ message: "User created successfully. Please check your email to verify your account." });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});


app.post('/verify-email', async (req, res) => {
  const { email, verificationCode } = req.body;
  const user = await User.findOne({ email, verificationCode });

  if (!user) {
    return res.status(400).json({ message: "Invalid email or verification code." });
  }

  // Check if the code is correct and not expired
  if (user.verificationCode === verificationCode) {
    user.emailVerified = true;
    user.verificationCode = ''; // Clear the verification code
    await user.save();
    res.status(200).json({ message: "Email verified successfully." });
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
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '24h' });
    res.status(200).json({ token, userId: user._id, message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
});



app.post('/events', async (req, res) => {
  const { title, description, poster, date, location, image, tags } = req.body;

  try {
      const event = new Event({
          title,
          description,
          poster,
          date,
          location,
          image,
          tags
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



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


