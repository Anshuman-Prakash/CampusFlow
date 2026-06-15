import Attendance from '../models/Attendance.model.js';
import { getAttendanceIntelligence, getAttendanceAlerts } from '../services/attendanceIntelligence.service.js';

// Mark today's attendance
export const markAttendance = async (req, res) => {
  try {
    const { subject, status } = req.body; // status: Present, Absent, Holiday, Cancelled

    const attendance = await Attendance.findOne({
      user: req.user.id,
      subject,
    });

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found for this subject',
      });
    }

    // Add to records
    attendance.records.push({
      date: new Date(),
      status,
    });

    // Update counts based on status
    if (status === 'Present') {
      attendance.present += 1;
      attendance.total += 1;
    } else if (status === 'Absent') {
      attendance.absent += 1;
      attendance.total += 1;
    } else if (status === 'Cancelled' || status === 'Holiday') {
      // Don't count these in total
    }

    await attendance.save();

    res.json({
      success: true,
      message: 'Attendance marked successfully',
      data: attendance,
    });
  } catch (error) {
    console.error('Mark attendance error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get attendance intelligence (AI insights)
export const getIntelligence = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({ user: req.user.id });

    const intelligence = await getAttendanceIntelligence(attendanceRecords);

    res.json({
      success: true,
      data: intelligence,
    });
  } catch (error) {
    console.error('Get intelligence error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get attendance alerts
export const getAlerts = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({ user: req.user.id });

    const alerts = getAttendanceAlerts(attendanceRecords);

    res.json({
      success: true,
      data: alerts,
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Bulk setup attendance (for onboarding)
export const bulkSetupAttendance = async (req, res) => {
  try {
    const { subjects } = req.body;

    const attendanceRecords = subjects.map((sub) => ({
      user: req.user.id,
      subject: sub.subject,
      present: sub.attended || 0,
      absent: (sub.conducted || 0) - (sub.attended || 0),
      total: sub.conducted || 0,
      records: [],
    }));

    // Delete existing and insert new
    await Attendance.deleteMany({ user: req.user.id });
    await Attendance.insertMany(attendanceRecords);

    res.json({
      success: true,
      message: 'Attendance setup completed',
      data: attendanceRecords,
    });
  } catch (error) {
    console.error('Bulk setup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
