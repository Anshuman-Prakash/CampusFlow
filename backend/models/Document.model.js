import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
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
    fileType: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['handbook', 'hostel', 'placement', 'academic', 'other'],
      required: true,
    },
    content: {
      type: String,
    },
    embeddings: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model('Document', documentSchema);

export default Document;
