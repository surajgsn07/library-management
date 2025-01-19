import { Admin } from "../models/admin.model.js"; 


// Admin Registration
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, phoneNo, password } = req.body;

    // Check if the admin already exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({ message: "Admin already exists with this email" });
    }

    // Create new admin
    const newAdmin = new Admin({
      name,
      email,
      phoneNo,
      password, // Plain password, will be hashed in the model's pre-save hook
    });

    // Save the admin to the database
    await newAdmin.save();

    const token = newAdmin.generateAuthToken();


    res.status(201).json({ message: "Admin registered successfully" , user : newAdmin , token });
  } catch (error) {
    res.status(500).json({ message: "Error registering admin", error: error.message });
  }
};

// Admin Login
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    // Validate password
    const isPasswordValid = await admin.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate JWT token
    const token = admin.generateAuthToken();

    res.status(200).json({
      message: "Login successful",
      token: token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};
