// ---------------------------- ENV ----------------------------
require('dotenv').config({ path: '.env' });
const jwtSecret = process.env.JWT_SECRET;

// ---------------------------- IMPORTS ----------------------------
//#region IMPORTS
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const { verifyToken } = require('./controller/userAuthController');
const { upload } = require('./useful_script/uploadUtils');
const { authenticate, authenticateAndVerify, authorizeAdmin } = require('./useful_script/userAuthentication');
//#endregion


// ---------------------------- CONTROllER IMPORTS ----------------------------
//#region CONTROLLER IMPORTS
const {
  fetchAllUsernames,
  verifyUserEmail,
  login,
  signUp,
  resetUserPassword,
  userExists,
  sendCodeEmail,
  updateUsers
} = require('./controller/userController');
const {
  removeEvent,
  getProxyImage,
  getRPIEvents,
  createNewEvent,
  fetchEventLikes,
  handleEventLike,
  fetchUserLikedEvents,
  getAllEvents,
  updateEvents,
} = require('./controller/eventController');
const { getLogContent } = require('./controller/logController');
//#endregion


// ---------------------------- EXPRESS SETTINGS ----------------------------
//#region EXPRESS
const express = require('express');
const { sendEmail } = require("./services/emailService");
const { sendCode } = require("./services/userService");
const app = express();
const corsOptions = {
  origin: ['http://localhost:5173', 'https://rpieventhub.com', 'http://localhost:3000'],
  optionsSuccessStatus: 200,
};
//#endregion

//#region MIDDLEWARE
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//#endregion


// ---------------------------- ROUTES ----------------------------
//#region EVENT ROUTES
app.get('/rpi-events', getRPIEvents);
app.post('/events', upload, authenticateAndVerify, createNewEvent);
app.get('/events', getAllEvents);
app.delete('/events/:id', removeEvent);
app.get('/proxy/image/:eventId', getProxyImage);
app.get('/events/:id/like', fetchEventLikes);
app.get('/events/like/status', authenticate, fetchUserLikedEvents);
app.post('/events/:id/like', authenticateAndVerify, handleEventLike);
app.post('/events-update/:id', upload, updateEvents);
//#endregion

//#region LOG ROUTES
app.get('/logs/:date', getLogContent);
//#endregion

//#region USER ROUTES
app.post('/signup', signUp);
app.post('/verify-email', verifyUserEmail);
app.post('/login', login);
app.get('/usernames', authenticate, authorizeAdmin, fetchAllUsernames);
app.post('/reset-password', resetUserPassword);
app.post('/check-user-exists', userExists);
app.post('/update-users', authenticate, authorizeAdmin, updateUsers);
//#endregion

//#region OTHER ROUTES
app.get('/verify-token', authenticate, verifyToken);
// This route is for resend verification email, need format: {email, typeofCode}
// The typeofCode is either "signup","reset"
app.post('/send-code', sendCodeEmail)
app.use('/assets', express.static(path.join(__dirname, './assets')));
//#endregion

require('./archiveOldEventsCron');

// ---------------------------- FRONTEND ----------------------------
app.use(express.static(path.join(__dirname, '../frontend/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

const PORT = process.env.PORT || 5000;


// ----------------DATABASE CONNECTION ----------------------------
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
