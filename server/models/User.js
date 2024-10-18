const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Unique username
  email: { type: String, required: true, unique: true },    // Unique email
  password: { type: String, required: true },                // Password is required
  role: { 
    type: String, 
    enum: ['user', 'admin'], // Define acceptable roles
    default: 'user'          // Default role is 'user'
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
