import mongoose from 'mongoose';

const timetableSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    classes: [
      {
        subject: {
          type: String,
          required: true,
        },
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        roomNumber: String,
        facultyName: String,
      },
    ],
    uploadedFile: String, // Cloudinary URL if uploaded
    extractionMethod: {
      type: String,
      enum: ['manual', 'pdf', 'image'],
      default: 'manual',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Timetable', timetableSchema);
