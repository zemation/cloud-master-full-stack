// models/UserModel.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define the schema for the Admin User
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true, // Ensures no two admins use the same email
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    // We can add a role later if needed, but for now, all users are assumed Admin
    role: {
        type: String,
        default: 'admin',
    }
  },
  {
    timestamps: true, // For tracking creation and update times
  }
);

// --- Mongoose Middleware: Hash Password Before Saving ---
// This pre-save hook runs before the user document is actually saved to the database.
userSchema.pre('save', async function (next) {
  // Only run this function if the password field was actually modified (e.g., during registration or password change)
  if (!this.isModified('password')) {
    next();
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Instance Method: Compare Password ---
// This method will be available on every User document to check if the provided 
// password matches the stored hashed password.
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model('User', userSchema);