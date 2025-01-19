import mongoose from 'mongoose';

import bcrypt from "bcrypt";

import jwt from "jsonwebtoken";

const AdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phoneNo: { type: String, required: true },
    password: { type: String, required: true }, // Hashed password
    createdAt: { type: Date, default: Date.now },
  });
  
  // Pre-save middleware to hash the password before saving
  AdminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next(); // Skip if the password is not modified
    this.password = await bcrypt.hash(this.password, 10); // Hash the password
    next();
  });
  
  // Method to validate the password
  AdminSchema.methods.validatePassword = async function (password) {
    return bcrypt.compare(password, this.password); // Compare hashed password
  };
  
  // Method to generate JWT token
  AdminSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    return token;
  };
  
  export const Admin = mongoose.model('Admin', AdminSchema);
  