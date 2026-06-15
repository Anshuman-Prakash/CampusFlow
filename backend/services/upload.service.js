import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';

/**
 * Upload file to Cloudinary
 * @param {Buffer} fileBuffer - File buffer from upload
 * @param {Object} options - Upload options
 * @returns {Promise<Object>} Upload result with URL
 */
export const uploadToCloudinary = async (fileBuffer, options = {}) => {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: options.folder || 'campusflow',
          resource_type: options.resourceType || 'auto',
          public_id: options.publicId,
          transformation: options.transformation,
          format: options.format,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
              width: result.width,
              height: result.height,
              size: result.bytes,
            });
          }
        }
      );

      // Convert buffer to stream and pipe to Cloudinary
      const bufferStream = new Readable();
      bufferStream.push(fileBuffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
  }
};

/**
 * Upload PDF to Cloudinary
 * @param {Buffer} fileBuffer - PDF file buffer
 * @param {String} fileName - Original filename
 * @returns {Promise<Object>} Upload result
 */
export const uploadPDF = async (fileBuffer, fileName) => {
  return await uploadToCloudinary(fileBuffer, {
    folder: 'campusflow/notices',
    resourceType: 'raw',
    publicId: `pdf_${Date.now()}_${fileName.replace(/\s+/g, '_')}`,
  });
};

/**
 * Upload image to Cloudinary
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {String} fileName - Original filename
 * @param {Object} transformOptions - Image transformation options
 * @returns {Promise<Object>} Upload result
 */
export const uploadImage = async (fileBuffer, fileName, transformOptions = {}) => {
  return await uploadToCloudinary(fileBuffer, {
    folder: 'campusflow/images',
    resourceType: 'image',
    publicId: `img_${Date.now()}_${fileName.replace(/\s+/g, '_')}`,
    transformation: {
      width: transformOptions.width || 1200,
      height: transformOptions.height || 1200,
      crop: transformOptions.crop || 'limit',
      quality: transformOptions.quality || 'auto',
      fetch_format: 'auto',
    },
  });
};

/**
 * Upload user avatar
 * @param {Buffer} fileBuffer - Image file buffer
 * @param {String} userId - User ID for naming
 * @returns {Promise<Object>} Upload result
 */
export const uploadAvatar = async (fileBuffer, userId) => {
  return await uploadToCloudinary(fileBuffer, {
    folder: 'campusflow/avatars',
    resourceType: 'image',
    publicId: `avatar_${userId}_${Date.now()}`,
    transformation: {
      width: 400,
      height: 400,
      crop: 'fill',
      gravity: 'face',
      quality: 'auto',
      fetch_format: 'auto',
    },
  });
};

/**
 * Upload resume to Cloudinary
 * @param {Buffer} fileBuffer - Resume file buffer
 * @param {String} fileName - Original filename
 * @returns {Promise<Object>} Upload result
 */
export const uploadResume = async (fileBuffer, fileName) => {
  return await uploadToCloudinary(fileBuffer, {
    folder: 'campusflow/resumes',
    resourceType: 'raw',
    publicId: `resume_${Date.now()}_${fileName.replace(/\s+/g, '_')}`,
  });
};

/**
 * Delete file from Cloudinary
 * @param {String} publicId - Public ID of the file
 * @param {String} resourceType - Type of resource (image, raw, video)
 * @returns {Promise<Object>} Delete result
 */
export const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
    return result;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete file from Cloudinary');
  }
};

/**
 * Get optimized image URL
 * @param {String} publicId - Public ID of the image
 * @param {Object} options - Transformation options
 * @returns {String} Optimized image URL
 */
export const getOptimizedImageUrl = (publicId, options = {}) => {
  return cloudinary.url(publicId, {
    width: options.width || 800,
    height: options.height,
    crop: options.crop || 'limit',
    quality: options.quality || 'auto',
    fetch_format: 'auto',
  });
};
