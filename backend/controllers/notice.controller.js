import Notice from '../models/Notice.model.js';
import { summarizeNotice } from '../services/gemini.service.js';
import { uploadPDF, deleteFromCloudinary } from '../services/upload.service.js';

// @desc    Upload and process notice
// @route   POST /api/notices/upload
// @access  Private
export const uploadNotice = async (req, res) => {
  try {
    if (!req.files || !req.files.notice) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file',
      });
    }

    const file = req.files.notice;
    
    // Validate file type
    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed',
      });
    }

    // Parse PDF to extract text
    let text = '';
    
    try {
      // Dynamic import to avoid initialization issues
      const pdfParse = (await import('pdf-parse')).default;
      const dataBuffer = file.data;
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } catch (pdfError) {
      console.error('PDF parsing error:', pdfError);
      // Fallback: use filename as text if parsing fails
      text = `Notice: ${file.name}. Please view the PDF for full details.`;
    }

    // Upload to Cloudinary (if configured)
    let fileUrl = `uploads/${file.name}`; // Fallback
    let cloudinaryPublicId = null;

    if (process.env.CLOUDINARY_CLOUD_NAME) {
      try {
        const uploadResult = await uploadPDF(file.data, file.name);
        fileUrl = uploadResult.url;
        cloudinaryPublicId = uploadResult.publicId;
      } catch (uploadError) {
        console.error('Cloudinary upload failed, using local storage:', uploadError);
        // Continue with local storage fallback
      }
    }

    // Generate AI summary
    const analysis = await summarizeNotice(text);

    // Save notice
    const notice = await Notice.create({
      user: req.user.id,
      title: req.body.title || file.name.replace('.pdf', ''),
      fileUrl,
      cloudinaryId: cloudinaryPublicId,
      summary: analysis.summary,
      deadlines: analysis.deadlines,
      venue: analysis.venue,
      actionItems: analysis.actionItems,
      category: req.body.category || 'general',
    });

    res.status(201).json({
      success: true,
      data: notice,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload notice',
    });
  }
};

// @desc    Get all notices
// @route   GET /api/notices
// @access  Private
export const getNotices = async (req, res) => {
  try {
    const notices = await Notice.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notices',
    });
  }
};
