import { GoogleGenerativeAI } from '@google/generative-ai';
import Attendance from '../models/Attendance.model.js';
import Assignment from '../models/Assignment.model.js';

// Initialize Gemini with better error handling
let genAI;
let availableModel = null;

// Try different model names in order of preference
const MODEL_VARIANTS = [
  // 'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
];

async function initializeGemini() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error('❌ GEMINI_API_KEY not found in environment variables');
      return;
    }

    console.log('🔄 Initializing Gemini AI...');
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try to find a working model
    for (const modelName of MODEL_VARIANTS) {
      try {
        console.log(`   Testing model: ${modelName}...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        // Test the model with a simple query
        const result = await model.generateContent('test');
        await result.response.text(); // Make sure we can get the response
        availableModel = modelName;
        console.log(`✅ Gemini AI Ready: ${modelName}`);
        return;
      } catch (err) {
        console.log(`   ❌ ${modelName} not available: ${err.message}`);
        // Model not available, try next
        continue;
      }
    }
    
    console.warn('⚠️  No working Gemini model found. AI features will be limited.');
    console.warn('   This is OK - the app will still work without AI features.');
  } catch (error) {
    console.error('❌ Failed to initialize Gemini:', error.message);
    console.warn('   AI features will be disabled, but the app will continue to work.');
  }
}

// Initialize on module load
initializeGemini();

export const generateAIResponse = async (message, user) => {
  try {
    if (!genAI || !availableModel) {
      return "AI service is not configured. Please check GEMINI_API_KEY in environment variables.";
    }

    // Use the working model that was found during initialization
    const model = genAI.getGenerativeModel({ model: availableModel });

    // Fetch user context
    const attendance = await Attendance.find({ user: user.id });
    const assignments = await Assignment.find({ user: user.id, status: 'pending' });

    // Build context for AI with better formatting
    const attendanceInfo = attendance.length > 0 
      ? attendance.map(a => `${a.subject}: ${a.percentage.toFixed(1)}%`).join(', ')
      : 'No attendance data yet';
    
    const assignmentInfo = assignments.length > 0
      ? assignments.map(a => a.title).join(', ')
      : 'No pending assignments';

    const context = `You are CampusFlow AI Assistant helping ${user.name || 'student'}, a ${user.branch || 'Computer Science'} student.

Current Context:
- Attendance: ${attendanceInfo}
- Pending Assignments: ${assignments.length} (${assignmentInfo})

Provide helpful, concise, and friendly responses about campus life, classes, assignments, and academic queries.

User Question: ${message}`;

    const result = await model.generateContent(context);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Return user-friendly error messages
    if (error.message?.includes('API key')) {
      return "API key error. Please contact administrator.";
    }
    if (error.message?.includes('quota')) {
      return "API quota exceeded. Please try again later.";
    }
    if (error.message?.includes('not found')) {
      return "AI model configuration error. Please contact administrator.";
    }
    return "I'm having trouble processing your request right now. Please try again in a moment.";
  }
};

export const summarizeNotice = async (text) => {
  try {
    if (!genAI || !availableModel) {
      return {
        summary: 'AI service not configured',
        deadlines: [],
        venue: 'Not specified',
        actionItems: [],
      };
    }

    const model = genAI.getGenerativeModel({ model: availableModel });

    const prompt = `
Analyze this notice and provide:
1. A concise summary (2-3 sentences)
2. Extract important deadlines
3. Extract venue/location
4. List action items for students

Notice Text:
${text}

Respond in JSON format:
{
  "summary": "...",
  "deadlines": ["...", "..."],
  "venue": "...",
  "actionItems": ["...", "..."]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json\n?|\n?```/g, '');
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Notice Summarization Error:', error);
    return {
      summary: 'Unable to generate summary',
      deadlines: [],
      venue: 'Not specified',
      actionItems: [],
    };
  }
};

export const analyzeResume = async (resumeText) => {
  try {
    if (!genAI || !availableModel) {
      return null;
    }

    const model = genAI.getGenerativeModel({ model: availableModel });

    const prompt = `
Analyze this resume and provide:
1. Overall score (0-100)
2. ATS compatibility score (0-100)
3. Key strengths (3-5 points)
4. Areas for improvement (3-5 points)
5. Skill suggestions

Resume:
${resumeText}

Respond in JSON format:
{
  "score": 85,
  "atsScore": 90,
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "skillSuggestions": ["...", "..."]
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const jsonText = response.text().replace(/```json\n?|\n?```/g, '');
    return JSON.parse(jsonText);
  } catch (error) {
    console.error('Resume Analysis Error:', error);
    return null;
  }
};

// Export function to get available models for debugging
export const listAvailableModels = async () => {
  try {
    if (!genAI) {
      return { error: 'Gemini AI not initialized' };
    }

    const models = [];
    for (const modelName of MODEL_VARIANTS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        await model.generateContent('test');
        models.push({ name: modelName, status: 'available' });
      } catch (err) {
        models.push({ name: modelName, status: 'unavailable', error: err.message });
      }
    }
    
    return {
      currentModel: availableModel,
      apiKeyConfigured: !!process.env.GEMINI_API_KEY,
      testedModels: models
    };
  } catch (error) {
    return { error: error.message };
  }
};
