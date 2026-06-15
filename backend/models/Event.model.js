import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['workshop', 'seminar', 'hackathon', 'club', 'competition', 'other'],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    venue: {
      type: String,
      required: true,
    },
    organizer: {
      type: String,
      required: true,
    },
    registrationDeadline: {
      type: Date,
    },
    maxParticipants: {
      type: Number,
    },
    registeredUsers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    bookmarkedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    imageUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

export default Event;
