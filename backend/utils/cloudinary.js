import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a file to Cloudinary.
 * @param {string} localFilepath - The path of the local file to upload.
 * @returns {object|null} - The Cloudinary response object or null on failure.
 */
const uploadToCloudinary = async (localFilepath) => {
  try {
    if (!localFilepath) return null;

    const response = await cloudinary.uploader.upload(localFilepath, {
      resource_type: 'image',
    });

    // Remove the local file after uploading
    fs.unlinkSync(localFilepath);

    return response;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    // Remove the local file in case of an error
    fs.unlinkSync(localFilepath);
    return null;
  }
};

/**
 * Delete a file from Cloudinary.
 * @param {string} publicId - The public ID of the file to delete.
 * @returns {object} - The Cloudinary response object.
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const res = await cloudinary.uploader.destroy(String(publicId));
    return res;
  } catch (error) {
    console.error('Error deleting file from Cloudinary:', error);
    throw new Error('Something went wrong while deleting the file from Cloudinary.');
  }
};

/**
 * Extract the public ID from a Cloudinary URL.
 * @param {string} url - The Cloudinary URL of the file.
 * @returns {string} - The public ID of the file.
 */
const publicId = async (url) => {
  try {
    const arr = url.split('/');
    const item = arr[arr.length - 1];
    const arr2 = item.split('.');
    const res = arr2[0];
    return res;
  } catch (error) {
    console.error('Error extracting public ID:', error);
    throw new Error('Something went wrong while extracting the public ID.');
  }
};

export { uploadToCloudinary, deleteFromCloudinary, publicId };
