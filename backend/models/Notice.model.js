import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    cloudinaryId: {
      type: String,
      default: null,
    },
    summary: {
      type: String,
    },
    deadlines: [{
      type: String,
    }],
    venue: {
      type: String,
    },
    actionItems: [{
      type: String,
    }],
    category: {
      type: String,
      enum: ['academic', 'event', 'placement', 'general'],
      default: 'general',
    },
  },
  {
    timestamps: true,
  }
);

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;
