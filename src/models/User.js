import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Define the User schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
  },
  // password field for input and validation not stored in DB
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long'],
    //  Make it easier for testing

    //  validate: {
    //   validator: function(v) {
    //     // Password must contain at least one uppercase letter, one lowercase letter and one number
    //     return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
    //   },
    //   message: 'Password must contain at least one uppercase letter, one lowercase letter and a number'
    // }
  },
  // passwordHash for storing the hashed password to db for security
  passwordHash: {
    type: String,
    select: false,
  },
}, {
  timestamps: true,
});

// Pre save hook to hash the password before saving or updating
userSchema.pre('save', async function () {
  // Only hash the password if the password field was provided
  if (this.isModified('password')) {
    // Hash the password with a salt of 10
    this.passwordHash = await bcrypt.hash(this.password, 10);
    // Clear the plain text password to prevent it from saving to the database
    this.password = undefined;
  }
});

// Compare provided password with the stored hash password
userSchema.methods.comparePassword = async function (providedPassword) {
  return bcrypt.compare(providedPassword, this.passwordHash);
};

export default mongoose.model('User', userSchema);
