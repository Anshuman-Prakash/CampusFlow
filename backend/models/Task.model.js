import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
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
    description: String,
    category: {
      type: String,
      enum: [
        'Academic', 
        'Competitive Programming', 
        'Placement', 
        'Research', 
        'Skill Development', 
        'Personal', 
        'Project', 
        'Other'
      ],
      default: 'Other',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Urgent'],
      default: 'Medium',
    },
    deadline: Date,
    estimatedDuration: Number, // in minutes
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
      default: 'Pending',
    },
    recurrence: {
      type: String,
      enum: ['None', 'Daily', 'Weekly', 'Monthly'],
      default: 'None',
    },
    completedAt: Date,
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
taskSchema.index({ user: 1, status: 1, deadline: 1 });

export default mongoose.model('Task', taskSchema);
