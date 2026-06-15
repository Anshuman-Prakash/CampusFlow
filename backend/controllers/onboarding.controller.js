import StudentProfile from '../models/StudentProfile.model.js';
import Timetable from '../models/Timetable.model.js';
import Attendance from '../models/Attendance.model.js';
import Goal from '../models/Goal.model.js';
import Task from '../models/Task.model.js';

// Get onboarding status
export const getOnboardingStatus = async (req, res) => {
  try {
    console.log('Checking onboarding status for user:', req.user.id);
    
    const profile = await StudentProfile.findOne({ user: req.user.id });
    
    if (!profile) {
      console.log('No profile found - onboarding not started');
      return res.json({
        success: true,
        data: {
          completed: false,
          currentStep: 0,
        },
      });
    }

    console.log('Profile found:', {
      onboardingCompleted: profile.onboardingCompleted,
      onboardingStep: profile.onboardingStep,
      userId: profile.user
    });

    res.json({
      success: true,
      data: {
        completed: profile.onboardingCompleted,
        currentStep: profile.onboardingStep,
        profile: profile,
      },
    });
  } catch (error) {
    console.error('Get onboarding status error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Step 1: Basic Profile
export const saveBasicProfile = async (req, res) => {
  try {
    const {
      fullName,
      rollNumber,
      email,
      phone,
      gender,
      profilePicture,
      collegeName,
      degree,
      branch,
      semester,
      year,
      section,
      currentCGPA,
    } = req.body;

    console.log('Step 1 received data:', req.body);

    // Validate required fields
    if (!fullName || !rollNumber || !collegeName || !degree || !branch) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: fullName, rollNumber, collegeName, degree, branch',
      });
    }

    let profile = await StudentProfile.findOne({ user: req.user.id });

    const profileData = {
      fullName,
      rollNumber,
      email,
      phone,
      collegeName,
      degree,
      branch,
      semester,
      year,
      section,
      currentCGPA,
      onboardingStep: 1,
    };

    // Only add optional fields if provided and not empty
    if (gender && gender.trim() !== '') profileData.gender = gender;
    if (profilePicture) profileData.profilePicture = profilePicture;

    if (profile) {
      // Update existing
      Object.assign(profile, profileData);
      console.log('Updating existing profile');
    } else {
      // Create new
      profile = new StudentProfile({
        user: req.user.id,
        ...profileData,
      });
      console.log('Creating new profile');
    }

    await profile.save();
    console.log('Profile saved successfully');

    res.json({
      success: true,
      message: 'Basic profile saved successfully',
      data: profile,
    });
  } catch (error) {
    console.error('Save basic profile error:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};

// Step 2: Timetable Setup (handled in timetable controller)

// Step 3: Attendance Setup
export const saveAttendanceSetup = async (req, res) => {
  try {
    const { subjects } = req.body; // Array of { subject, conducted, attended }

    // Delete existing attendance for this user
    await Attendance.deleteMany({ user: req.user.id });

    // Create new attendance records
    const attendanceRecords = subjects.map((sub) => ({
      user: req.user.id,
      subject: sub.subject,
      present: sub.attended,
      absent: sub.conducted - sub.attended,
      total: sub.conducted,
      percentage: (sub.attended / sub.conducted) * 100,
    }));

    await Attendance.insertMany(attendanceRecords);

    // Update onboarding step
    await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      { onboardingStep: 3 }
    );

    res.json({
      success: true,
      message: 'Attendance setup saved successfully',
      data: attendanceRecords,
    });
  } catch (error) {
    console.error('Save attendance setup error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Step 4: Academic Goals
export const saveGoals = async (req, res) => {
  try {
    const { goals } = req.body; // Array of goal strings

    await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      { goals, onboardingStep: 4 }
    );

    res.json({
      success: true,
      message: 'Goals saved successfully',
    });
  } catch (error) {
    console.error('Save goals error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Step 5: Weekly/Monthly Tasks
export const saveTasks = async (req, res) => {
  try {
    const { tasks } = req.body; // Array of task objects

    console.log('Step 5 received tasks:', tasks);

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one task',
      });
    }

    const taskDocuments = tasks.map((task) => ({
      user: req.user.id,
      title: task.title,
      category: task.category,
      priority: task.priority,
      recurrence: task.recurrence,
      deadline: task.deadline,
      status: 'Pending',
    }));

    console.log('Creating tasks:', taskDocuments);

    await Task.insertMany(taskDocuments);

    // Update onboarding step
    await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      { onboardingStep: 5 }
    );

    console.log('Tasks saved successfully');

    res.json({
      success: true,
      message: 'Tasks saved successfully',
      data: taskDocuments,
    });
  } catch (error) {
    console.error('Save tasks error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};

// Step 6: Daily Routine & Complete Onboarding
export const completeOnboarding = async (req, res) => {
  try {
    const { routine } = req.body;

    console.log('=== COMPLETING ONBOARDING ===');
    console.log('User ID:', req.user.id);
    console.log('Routine data:', routine);

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user.id },
      {
        routine,
        onboardingStep: 6,
        onboardingCompleted: true,
      },
      { new: true } // Return the updated document
    );

    if (!profile) {
      console.error('❌ Profile not found for user:', req.user.id);
      return res.status(404).json({ 
        success: false, 
        message: 'Profile not found. Please complete Step 1 first.' 
      });
    }

    console.log('✅ Onboarding completed successfully!');
    console.log('Profile status:', {
      onboardingCompleted: profile.onboardingCompleted,
      onboardingStep: profile.onboardingStep,
    });
    console.log('=== END ONBOARDING ===');

    res.json({
      success: true,
      message: 'Onboarding completed successfully!',
      data: {
        completed: profile.onboardingCompleted,
        currentStep: profile.onboardingStep,
        profile: profile,
      },
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ 
      success: false, 
      message: 'Server error: ' + error.message 
    });
  }
};
