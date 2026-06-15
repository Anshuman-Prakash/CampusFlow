import express from 'express';
import fileUpload from 'express-fileupload';
import { uploadNotice, getNotices } from '../controllers/notice.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(fileUpload());

router.post('/upload', protect, uploadNotice);
router.get('/', protect, getNotices);

export default router;
