import multer from "multer";
import fs from "fs";
import path from "path";

// Create the upload folder dynamically if it doesn't exist
const uploadDir = path.resolve('./public/temp');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define a file filter function to check if the file is an image
const imageFileFilter = (req, file, cb) => {
  // Check if the file is an image based on MIME type
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Accept the file
  } else {
    // Reject the file with a custom error
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "Only image files are allowed"), false);
  }
};

// Define the storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Save files to the created directory
  },
  filename: function (req, file, cb) {
    // Use the current timestamp to avoid filename conflicts
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExtension}`);
  },
});

// Initialize the multer upload instance
export const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter, // Apply the image file filter
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  },
}).single("picture"); // Specify the field name for the file upload
