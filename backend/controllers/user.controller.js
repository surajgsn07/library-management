import { User } from "../models/user.models.js"; // Adjust path as necessary
import jwt from "jsonwebtoken";
// User Registration
export const registerUser = async (req, res) => {
  try {
    const { name, className, rollNo, email, phoneNo, password,course } = req.body; // Renamed "class" to "className"

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
      course
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




export const searchUser = async (req, res) => {
  try {
    // Extract query parameters
    const { rollNo, name, class: userClass } = req.query;

    // Build the query object dynamically
    const query = {};
    if (rollNo) query.rollNo = { $regex: rollNo, $options: "i" }; // Case-insensitive search for roll number
    if (name) query.name = { $regex: name, $options: "i" }; // Case-insensitive search for name
    if (userClass) query.class = { $regex: userClass, $options: "i" }; // Case-insensitive search for class

    // Query the database with the dynamically built query object
    const users = await User.find(query);

    // Send the response with the matching users
    res.status(200).json({ users });
  } catch (error) {
    console.error("Error searching users:", error.message);
    res.status(500).json({ message: "Server error while searching for users." });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.studentid);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};


export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.studentid, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
}