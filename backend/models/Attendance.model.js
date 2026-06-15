import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    present: {
      type: Number,
      default: 0,
    },
    absent: {
      type: Number,
      default: 0,
    },
    total: {
      type: Number,
      default: 0,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    records: [
      {
        date: {
          type: Date,
          required: true,
        },
        status: {
          type: String,
          enum: ['Present', 'Absent', 'Holiday', 'Cancelled'],
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Calculate percentage before saving
attendanceSchema.pre('save', function (next) {
  if (this.total > 0) {
    this.percentage = (this.present / this.total) * 100;
  }
  next();
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
