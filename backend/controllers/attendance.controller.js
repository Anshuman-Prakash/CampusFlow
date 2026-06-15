import Attendance from '../models/Attendance.model.js';

// @desc    Get all attendance records
// @route   GET /api/attendance
// @access  Private
export const getAttendance = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch attendance',
    });
  }
};

// @desc    Update attendance
// @route   POST /api/attendance/update
// @access  Private
export const updateAttendance = async (req, res) => {
  try {
    const { subject, present, absent } = req.body;

    let attendance = await Attendance.findOne({
      user: req.user.id,
      subject,
    });

    if (attendance) {
      attendance.present = present;
      attendance.absent = absent;
      attendance.total = present + absent;
      await attendance.save();
    } else {
      attendance = await Attendance.create({
        user: req.user.id,
        subject,
        present,
        absent,
        total: present + absent,
      });
    }

    res.status(200).json({
      success: true,
      data: attendance,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to update attendance',
    });
  }
};

// @desc    Get attendance stats
// @route   GET /api/attendance/stats
// @access  Private
export const getAttendanceStats = async (req, res) => {
  try {
    const attendance = await Attendance.find({ user: req.user.id });

    const totalPresent = attendance.reduce((sum, a) => sum + a.present, 0);
    const totalAbsent = attendance.reduce((sum, a) => sum + a.absent, 0);
    const totalClasses = totalPresent + totalAbsent;
    const overallPercentage = totalClasses > 0 ? (totalPresent / totalClasses) * 100 : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalPresent,
        totalAbsent,
        totalClasses,
        overallPercentage: overallPercentage.toFixed(2),
        subjects: attendance.length,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
    });
  }
};
