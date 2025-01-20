import { User } from "../models/user.models.js"; // Adjust path as necessary
import jwt from "jsonwebtoken";
// User Registration
export const registerUser = async (req, res) => {
  try {
    const { name, className, rollNo, email, phoneNo, password } = req.body; // Renamed "class" to "className"

    // Check if the user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Create new user
    const newUser = new User({
      name,
      class : className, 
      rollNo,
      email,
      phoneNo,
      password,
    });

    // Save the user
    await newUser.save();

    
    // Generate JWT token
    const token = newUser.generateAuthToken();

    res.status(201).json({user: newUser, message: "User registered successfully" , token });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error: error.message });
  }
};


// User Login
export const loginUser = async (req, res) => {
  try {
    const { rollNo, password } = req.body;

    // Find user by email
    const user = await User.findOne({ rollNo });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Validate password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(200).json({
      message: "Login successful",
      token: token,
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};


export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
};