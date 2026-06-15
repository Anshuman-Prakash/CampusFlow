import express from 'express';
import fileUpload from 'express-fileupload';
import { uploadAvatar, uploadImage } from '../services/upload.service.js';
import { protect } from '../middleware/auth.middleware.js';
import User from '../models/User.model.js';

const router = express.Router();
router.use(fileUpload());

// @desc    Upload user avatar
// @route   POST /api/upload/avatar
// @access  Private
router.post('/avatar', protect, async (req, res) => {
  try {
    if (!req.files || !req.files.avatar) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    const file = req.files.avatar;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Only image files (JPEG, PNG, WebP) are allowed',
      });
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: 'Image size should be less than 5MB',
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadAvatar(file.data, req.user.id);

    // Update user avatar
    await User.findByIdAndUpdate(req.user.id, {
      avatar: uploadResult.url,
    });

    res.status(200).json({
      success: true,
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      },
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload avatar',
    });
  }
});

// @desc    Upload event image
// @route   POST /api/upload/event-image
// @access  Private (Admin only in production)
router.post('/event-image', protect, async (req, res) => {
  try {
    if (!req.files || !req.files.image) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image',
      });
    }

    const file = req.files.image;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Only image files are allowed',
      });
    }

    // Upload to Cloudinary
    const uploadResult = await uploadImage(file.data, file.name, {
      width: 1200,
      height: 630,
      crop: 'fill',
    });

    res.status(200).json({
      success: true,
      data: {
        url: uploadResult.url,
        publicId: uploadResult.publicId,
      },
    });
  } catch (error) {
    console.error('Image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload image',
    });
  }
});

export default router;
