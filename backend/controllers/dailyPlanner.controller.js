import { generateMorningBriefing, generateDailySchedule } from '../services/plannerAI.service.js';

// Get morning briefing
export const getMorningBriefing = async (req, res) => {
  try {
    const briefing = await generateMorningBriefing(req.user.id);

    res.json({
      success: true,
      data: {
        briefing,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Get morning briefing error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get today's AI-generated schedule
export const getTodaySchedule = async (req, res) => {
  try {
    const schedule = await generateDailySchedule(req.user.id);

    res.json({
      success: true,
      data: schedule,
    });
  } catch (error) {
    console.error('Get today schedule error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Regenerate schedule
export const regenerateSchedule = async (req, res) => {
  try {
    const schedule = await generateDailySchedule(req.user.id);

    res.json({
      success: true,
      message: 'Schedule regenerated successfully',
      data: schedule,
    });
  } catch (error) {
    console.error('Regenerate schedule error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
