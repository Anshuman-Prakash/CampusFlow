import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    // Basic Info
    fullName: {
      type: String,
      required: true,
    },
    rollNumber: String,
    email: String,
    phone: String,
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    },
    profilePicture: String,

    // Academic Info
    collegeName: String,
    degree: String,
    branch: String,
    semester: Number,
    year: Number,
    section: String,
    currentCGPA: Number,

    // Goals
    // Goals - Allow any custom goals
    goals: [String],

    // Daily Routine
    routine: {
      wakeUpTime: String,
      sleepTime: String,
      studyHours: Number,
      gym: Boolean,
      codingPractice: Boolean,
    },

    // Onboarding Status
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    onboardingStep: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('StudentProfile', studentProfileSchema);
