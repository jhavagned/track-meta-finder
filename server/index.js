// Import required packages
const express = require('express'); // Web framework for Node.js
const bodyParser = require('body-parser'); // Middleware to parse request bodies
const cors = require('cors'); // Middleware to enable Cross-Origin Resource Sharing
const bcrypt = require('bcryptjs'); // Library for hashing passwords
const mongoose = require('mongoose'); // Library to interact with MongoDB
const jwt = require('jsonwebtoken'); // Library to create and verify JWT tokens
const cookieParser = require('cookie-parser'); // Middleware for cookie handling
require('dotenv').config(); // Load environment variables from .env file

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
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

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
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Validate password strength
  if (!validatePassword(password)) {
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
      return res.status(400).json({ message: process.env.DUPE_USER || 'Username is already taken' });
    }

    // Check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
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

    // Respond with success
    return res.status(201).json({ message: 'User created successfully!', user: { username: normalizedUsername, email } });
  } catch (error) {
    console.error('Error in signup:', error);

    // Handle duplicate key error for email or username
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email or username is already registered' });
    }

    // Handle server error
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
    const expiresIn = 10800; // 3 hour
  
    // If valid, create a new access token
    const newToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      process.env.JWT_SECRET,
      { expiresIn }  // Token expires in 3 hours
    );

    return { newToken, expiresIn };  // Return the new access token and expiration time
  } catch (error) {
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
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Normalize the username to lowercase
    const normalizedUsername = username.toLowerCase();
    
    // Find the user by username
    const user = await User.findOne({ username: normalizedUsername });
    if (!user) {
      return res.status(404).json({ message: 'Invalid username or password' });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
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

    // Respond with token
    return res.status(200).json({ message: 'Login successful', token, expiresIn });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @route POST /refresh-token
 * @desc Refresh access token using refresh token
 * @access Public
 */
app.post('/refresh-token', async (req, res) => {
  const refreshToken = req.body.token;  // Get the refresh token from the request body

  // Check if the refresh token is present
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    // Call the refresh function to generate a new access token
    //const newToken = refresh(refreshToken);
    const { newToken, expiresIn } = refresh(refreshToken);
    
    // Calculate the new expiry date for the cookie
    const newExpiry = new Date(Date.now() + expiresIn * 1000);  // Convert seconds to milliseconds

    // Return the new token and expiry
    return res.status(200).json({ newToken, newExpiry: newExpiry.toUTCString()}); 
  } catch (error) {
    return res.status(403).json({ message: 'Invalid refresh token' });
  }
});

// Start the server
const PORT = process.env.EXPRESSPORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
