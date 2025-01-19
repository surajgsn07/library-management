import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  class: { type: String, required: true },
  rollNo: { type: Number, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  phoneNo: { type: String, required: true },
  fine: { type: Number, default: 0 },
  password: { type: String, required: true }, 
  createdAt: { type: Date, default: Date.now },
  profilePic: { type: String , default:"https://imgs.search.brave.com/sE8MdXvDoqofUi5xFiPekWzRwNvt10-6tUkLkDA7KWA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzA5LzE3LzEyLzIz/LzM2MF9GXzkxNzEy/MjM2N19rU3BkcFJK/NUhjbW4wczRXTWRK/YlNacGw3TlJ6d3Vw/VS5qcGc"},
});


UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if the password is not modified
  this.password = await bcrypt.hash(this.password, 10); // Hash the password
  next();
});

// Method to validate the password
UserSchema.methods.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password); // Compare hashed password
};

// Method to generate JWT token
UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ id: this._id, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return token;
};

export const User = mongoose.model('User', UserSchema);
