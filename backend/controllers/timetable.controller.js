import Timetable from '../models/Timetable.model.js';
import StudentProfile from '../models/StudentProfile.model.js';
import { extractTimetableFromDocument } from '../services/timetableAI.service.js';

// Upload and extract timetable from PDF/Image
export const uploadTimetable = async (req, res) => {
  try {
    if (!req.files || !req.files.timetable) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a timetable file',
      });
    }

    const file = req.files.timetable;
    const fileType = file.mimetype.includes('pdf') ? 'pdf' : 'image';

    // Extract timetable data using AI
    const extractedClasses = await extractTimetableFromDocument(file, fileType);

    // Save to database
    let timetable = await Timetable.findOne({ user: req.user.id });

    if (timetable) {
      timetable.classes = extractedClasses;
      timetable.extractionMethod = fileType;
      timetable.uploadedFile = file.tempFilePath || '';
    } else {
      timetable = new Timetable({
        user: req.user.id,
        classes: extractedClasses,
        extractionMethod: fileType,
        uploadedFile: file.tempFilePath || '',
      });
    }

    await timetable.save();

    // Update onboarding step
    await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      { onboardingStep: 2 }
    );

    res.json({
      success: true,
      message: 'Timetable extracted successfully',
      data: timetable,
    });
  } catch (error) {
    console.error('Upload timetable error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to extract timetable',
    });
  }
};

// Save manual timetable
export const saveManualTimetable = async (req, res) => {
  try {
    const { classes } = req.body;

    let timetable = await Timetable.findOne({ user: req.user.id });

    if (timetable) {
      timetable.classes = classes;
      timetable.extractionMethod = 'manual';
    } else {
      timetable = new Timetable({
        user: req.user.id,
        classes,
        extractionMethod: 'manual',
      });
    }

    await timetable.save();

    // Update onboarding step
    await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      { onboardingStep: 2 }
    );

    res.json({
      success: true,
      message: 'Timetable saved successfully',
      data: timetable,
    });
  } catch (error) {
    console.error('Save manual timetable error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get timetable
export const getTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findOne({ user: req.user.id });

    if (!timetable) {
      return res.json({
        success: true,
        data: { classes: [] },
      });
    }

    res.json({
      success: true,
      data: timetable,
    });
  } catch (error) {
    console.error('Get timetable error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get today's classes
export const getTodayClasses = async (req, res) => {
  try {
    const timetable = await Timetable.findOne({ user: req.user.id });

    if (!timetable) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayClasses = timetable.classes
      .filter((cls) => cls.day === today)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    res.json({
      success: true,
      data: todayClasses,
    });
  } catch (error) {
    console.error('Get today classes error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update timetable entry
export const updateTimetableEntry = async (req, res) => {
  try {
    const { classId } = req.params;
    const updateData = req.body;

    const timetable = await Timetable.findOne({ user: req.user.id });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found',
      });
    }

    const classIndex = timetable.classes.findIndex(
      (cls) => cls._id.toString() === classId
    );

    if (classIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Class not found',
      });
    }

    Object.assign(timetable.classes[classIndex], updateData);
    await timetable.save();

    res.json({
      success: true,
      message: 'Timetable updated successfully',
      data: timetable,
    });
  } catch (error) {
    console.error('Update timetable error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete timetable entry
export const deleteTimetableEntry = async (req, res) => {
  try {
    const { classId } = req.params;

    const timetable = await Timetable.findOne({ user: req.user.id });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: 'Timetable not found',
      });
    }

    timetable.classes = timetable.classes.filter(
      (cls) => cls._id.toString() !== classId
    );

    await timetable.save();

    res.json({
      success: true,
      message: 'Class deleted successfully',
      data: timetable,
    });
  } catch (error) {
    console.error('Delete timetable error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
