import multer from "multer";


// Define a file filter function to check if the file is an image
const imageFileFilter = (req, file, cb) => {
  // Check if the file is an image based on MIME type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new Error (400 , "Only image file is allowed"),
      false
    ); // Reject the file
  }
};



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
export const upload = multer({
  storage: storage,
  fileFilter: imageFileFilter // Apply the image file filter
});

