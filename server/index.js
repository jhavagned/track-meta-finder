// Import required packages
const express = require('express'); // Web framework for Node.js
const bodyParser = require('body-parser'); // Middleware to parse request bodies
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing
const bcrypt = require('bcryptjs'); // Library for hashing passwords
const mongoose = require('mongoose'); // Library to interact with MongoDB
const jwt = require('jsonwebtoken'); // Library to create and verify JWT tokens
const cookieParser = require('cookie-parser'); // Middleware for cookie handling
require('dotenv').config(); // Load environment variables from .env file
const logger = require('./utils/logger'); // Logger utility

// Import User model
const User = require('./models/User');

// Initialize the Express application
const app = express();

// MongoDB connection URI using environment variables
const connectionUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@trackmetacluster.hgvsm.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// Middleware setup
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cookieParser()); // Use cookie-parser middleware

// Connect to MongoDB
mongoose.connect(connectionUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
    logger.info('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
    logger.error('Error connecting to MongoDB:', 'Connection failed');
  });

// Password validation function
const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return passwordRegex.test(password);
};

// Define routes

/**
 * @route POST /signup
 * @desc Register a new user account
 * @access Public
 */
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input
  if (!username || !email || !password) {
    logger.warn('Signup attempt with missing fields');
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate password strength
  if (!validatePassword(password)) {
    logger.warn('Weak password attempt');
    return res.status(400).json({
      message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
    });
  }

  // Normalize the username to lowercase
  const normalizedUsername = username.toLowerCase();

  try {
    // Check if the normalized username already exists
    const existingUsername = await User.findOne({ username: normalizedUsername });
    if (existingUsername) {
      logger.warn('Signup attempt with duplicate username');
      return res.status(400).json({ message: process.env.DUPE_USER || 'Username is already taken' });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      logger.warn('Signup attempt with duplicate email');
      return res.status(400).json({ message: process.env.DUPE_EMAIL || 'Email is already registered' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the normalized username
    const newUser = new User({
      username: normalizedUsername,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();
    logger.info('User created successfully');

    // Respond with success
    return res.status(201).json({ message: 'User created successfully!', user: { username: normalizedUsername, email } });
  } catch (error) {
    logger.error('Error in signup:', 'Error occurred during signup process');

    // Handle duplicate key error for email or username
    if (error.code === 11000) {
      logger.warn('Duplicate key error during signup');
      return res.status(400).json({ message: 'Email or username is already registered' });
    }

    // Handle server error
    logger.error('Server error during signup: An unexpected error occurred during the signup process');

    return res.status(500).json({ message: 'Server error: ' + error.message });
  }
});

/**
 * Function to refresh the access token using the provided refresh token.
 * @param {string} refreshToken - The refresh token sent by the client.
 * @returns {string} - A new access token.
 */
function refresh(refreshToken) {
  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Token expiration duration (in seconds)
    const expiresIn = 10800; // 3 hours
  
    // If valid, create a new access token
    const newToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      process.env.JWT_SECRET,
      { expiresIn }  // Token expires in 3 hours
    );

    return { newToken, expiresIn };  // Return the new access token and expiration time
  } catch (error) {
    logger.error('Refresh token error:', 'Invalid refresh token');
    throw new Error('Invalid refresh token');  // Throw an error if verification fails
  }
}

/**
 * @route POST /login
 * @desc Log in an existing user and return a JWT
 * @access Public
 */
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    logger.warn('Login attempt with missing fields');
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Normalize the username to lowercase
    const normalizedUsername = username.toLowerCase();
    
    // Find the user by username
    const user = await User.findOne({ username: normalizedUsername });
    if (!user) {
      logger.warn('Login failed: User not found');
      return res.status(404).json({ message: 'Invalid username or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn('Login failed - Invalid password');
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Token expiration duration (in seconds)
    const expiresIn = 3600; // 1 hour

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn }, // Token expires in 1 hour
    );

    logger.info('User authentication generated successfully');
    // Respond with token
    return res.status(200).json({ message: 'Login successful', token, expiresIn });
  } catch (error) {
    logger.error('Error during login:', 'Error occurred during login process');
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @route POST /refresh-token
 * @desc Refresh access token using refresh token
 * @access Public
 */
app.post('/refresh-token', async (req, res) => {
  // Retrieve sessionId from AsyncLocalStorage to use in the log
  const storedSessionId = asyncLocalStorage.getStore()?.get('sessionId');
  
  const refreshToken = req.body.token;  // Get the refresh token from the request body

  // Check if the refresh token is present
  if (!refreshToken) {
    logger.warn('Refresh token required but missing');
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    // Call the refresh function to generate a new access token
    const { newToken, expiresIn } = refresh(refreshToken);
    
    // Calculate the new expiry date for the cookie
    const newExpiry = new Date(Date.now() + expiresIn * 1000);  // Convert seconds to milliseconds

    logger.info('New token generated successfully');
    // Return the new token and expiry
    return res.status(200).json({ newToken, newExpiry: newExpiry.toUTCString() }); 
  } catch (error) {
    logger.error('Error refreshing token:', 'Invalid refresh token');
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
});

// Log endpoint
app.post('/log', async (req, res) => {
  try {
    const { level, message, sessionId, timestamp } = req.body;

    // Validate log level
    if (!level || !logger.levels[level]) {
      return res.status(400).json({ error: "Invalid log level provided." });
    }

    // Validate required fields
    if (!sessionId || !timestamp || !message) {
      return res.status(400).json({ error: "Missing required log data: sessionId, timestamp, or message." });
    }

    // Include sessionId in the message
    const formattedMessage = `[${sessionId}] ${message}`;

    // Log the message with the specified level
    logger.log(level, formattedMessage);

    return res.status(200).json({ message: "Log recorded successfully." });
  } catch (error) {
    logger.error('Failed to record log');
    return res.status(500).json({ error: "Failed to record log." });
  }
});

// Start the server
const PORT = process.env.EXPRESSPORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
