import { GoogleGenerativeAI } from '@google/generative-ai';
import Timetable from '../models/Timetable.model.js';
import Task from '../models/Task.model.js';
import Assignment from '../models/Assignment.model.js';
import StudentProfile from '../models/StudentProfile.model.js';
import Attendance from '../models/Attendance.model.js';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate morning briefing
export const generateMorningBriefing = async (userId) => {
  try {
    if (!genAI) {
      return 'AI service not configured';
    }

    // Fetch user data
    const profile = await StudentProfile.findOne({ user: userId });
    const timetable = await Timetable.findOne({ user: userId });
    const attendance = await Attendance.find({ user: userId });
    const tasks = await Task.find({
      user: userId,
      status: { $ne: 'Completed' },
      deadline: { $gte: new Date() },
    }).limit(5);

    const assignments = await Assignment.find({
      user: userId,
      status: 'pending',
    }).limit(3);

    // Get today's classes
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayClasses = timetable?.classes.filter((cls) => cls.day === today) || [];

    // Check attendance status
    const lowAttendance = attendance.filter((att) => att.percentage < 75);

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
You are CampusFlow AI Assistant. Generate a personalized morning briefing for a student.

Student: ${profile?.fullName || 'Student'}
Date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Today's Classes (${todayClasses.length}):
${todayClasses.map((c) => `- ${c.subject} at ${c.startTime}`).join('\n') || 'No classes today'}

Pending Tasks (${tasks.length}):
${tasks.map((t) => `- ${t.title} (Due: ${t.deadline ? new Date(t.deadline).toLocaleDateString() : 'No deadline'})`).join('\n') || 'No pending tasks'}

Assignments Due:
${assignments.map((a) => `- ${a.title} (Due: ${a.dueDate ? new Date(a.dueDate).toLocaleDateString() : 'Soon'})`).join('\n') || 'No assignments due'}

Attendance Status:
${lowAttendance.length > 0 
  ? `⚠️ Low attendance in: ${lowAttendance.map((a) => `${a.subject} (${a.percentage.toFixed(1)}%)`).join(', ')}`
  : '✅ All subjects above 75%'
}

Generate a friendly, motivating morning briefing in 3-4 short paragraphs:
1. Warm greeting with today's overview
2. Highlight urgent tasks/classes
3. Provide 2-3 actionable recommendations
4. End with an encouraging message

Keep it concise, personal, and actionable. Use emojis sparingly.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error('Generate morning briefing error:', error);
    return 'Good morning! Have a productive day ahead! 🌅';
  }
};

// Generate daily schedule
export const generateDailySchedule = async (userId) => {
  try {
    if (!genAI) {
      return [];
    }

    const profile = await StudentProfile.findOne({ user: userId });
    const timetable = await Timetable.findOne({ user: userId });
    const tasks = await Task.find({
      user: userId,
      status: { $ne: 'Completed' },
    });

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const todayClasses = timetable?.classes.filter((cls) => cls.day === today) || [];

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
Generate an optimized daily schedule for a student.

Student Routine:
- Wake up: ${profile?.routine?.wakeUpTime || '7:00 AM'}
- Sleep: ${profile?.routine?.sleepTime || '11:00 PM'}
- Study hours: ${profile?.routine?.studyHours || 4} hours
- Gym: ${profile?.routine?.gym ? 'Yes' : 'No'}
- Coding practice: ${profile?.routine?.codingPractice ? 'Yes' : 'No'}

Today's Fixed Schedule:
${todayClasses.map((c) => `${c.startTime}-${c.endTime}: ${c.subject}`).join('\n')}

Pending Tasks:
${tasks.slice(0, 5).map((t) => `- ${t.title} (Priority: ${t.priority}, Est: ${t.estimatedDuration || 60} min)`).join('\n')}

Generate a JSON array of scheduled activities with this structure:
[
  {
    "time": "HH:MM AM/PM",
    "duration": "X hours/mins",
    "activity": "Activity name",
    "type": "class|study|break|task|exercise|personal",
    "priority": "high|medium|low"
  }
]

Rules:
1. Include all today's classes
2. Schedule breaks between classes
3. Add study sessions based on studyHours
4. Include gym time if routine.gym is true
5. Add coding practice if routine.codingPractice is true
6. Schedule high-priority tasks
7. Include meal times (breakfast, lunch, dinner)
8. Ensure reasonable breaks
9. Don't schedule anything after sleep time

Return ONLY the JSON array, no explanation.`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Extract JSON
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return [];
  } catch (error) {
    console.error('Generate daily schedule error:', error);
    return [];
  }
};
