import express from 'express';
import fileUpload from 'express-fileupload';
import { protect } from '../middleware/auth.middleware.js';
import { analyzeResume } from '../services/gemini.service.js';

const router = express.Router();
router.use(fileUpload());

// Analyze resume (matches frontend API call)
router.post('/resume-analysis', protect, async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ success: false, message: 'Please upload a resume' });
    }

    const file = req.files.resume;
    let text = '';

    try {
      // Dynamic import to avoid initialization issues
      const pdfParse = (await import('pdf-parse')).default;
      const dataBuffer = file.data;
      const pdfData = await pdfParse(dataBuffer);
      text = pdfData.text;
    } catch (pdfError) {
      console.error('PDF parsing error:', pdfError);
      return res.status(400).json({ 
        success: false, 
        message: 'Failed to parse resume. Please ensure it is a valid PDF.' 
      });
    }

    const analysis = await analyzeResume(text);

    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    console.error('Resume analysis error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to analyze resume',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Check eligibility (matches frontend API call)
router.post('/eligibility', protect, async (req, res) => {
  try {
    const { cgpa, backlogs, attendance } = req.body;

    const eligible = cgpa >= 7.0 && backlogs === 0 && attendance >= 75;

    res.status(200).json({
      success: true,
      eligible,
      message: eligible ? 'You are eligible for placements!' : 'Please improve your eligibility criteria',
      criteria: {
        cgpa: { required: 7.0, current: cgpa, met: cgpa >= 7.0 },
        backlogs: { required: 0, current: backlogs, met: backlogs === 0 },
        attendance: { required: 75, current: attendance, met: attendance >= 75 },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to check eligibility' });
  }
});

// Get interview prep resources
router.get('/interview-prep', protect, async (req, res) => {
  try {
    const resources = {
      dsa: ['LeetCode', 'HackerRank', 'CodeChef'],
      behavioral: ['STAR Method', 'Common Questions', 'Mock Interviews'],
      technical: ['System Design', 'OOP Concepts', 'Database Design'],
    };
    res.status(200).json({ success: true, data: resources });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch resources' });
  }
});

export default router;
