import jwt from "jsonwebtoken";
import {User} from "../models/user.models.js"; // Adjust the path to your User model
import {Admin} from "../models/admin.model.js"; // Adjust the path to your Admin model

// Authentication Middleware for Both Users and Admins
const authenticate = (requiredRole) => async (req, res, next) => {
  try {
    // Get token from headers
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;

    // Role-based user verification
    if (requiredRole === "user") {
      user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "User not found or unauthorized" });
      }
    } else if (requiredRole === "admin") {
      user = await Admin.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ message: "Admin not found or unauthorized" });
      }
    }

    
    req.user = user;

    
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token", error: error.message });
  }
};

// Export role-specific authentication
const authenticateAdmin = authenticate("admin");
const authenticateUser = authenticate("user");

export {
  authenticateAdmin,
  authenticateUser,
};
