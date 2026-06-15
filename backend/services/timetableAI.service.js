import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const extractTimetableFromDocument = async (file, fileType) => {
  try {
    if (!genAI) {
      throw new Error('Gemini AI not configured');
    }

    let extractedText = '';

    if (fileType === 'pdf') {
      // For PDF, we'll use pdf-parse to extract text first
      const pdfParse = (await import('pdf-parse')).default;
      const dataBuffer = fs.readFileSync(file.tempFilePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    } else {
      // For images, use Gemini Vision
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      
      const imageData = fs.readFileSync(file.tempFilePath);
      const base64Image = imageData.toString('base64');

      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Image,
            mimeType: file.mimetype,
          },
        },
        'Extract the timetable information from this image. Identify all classes with their subject names, days, start times, and end times.',
      ]);

      extractedText = result.response.text();
    }

    // Now use Gemini to parse the extracted text into structured data
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
Parse this timetable text and extract class information in JSON format.

Timetable Text:
${extractedText}

Return a JSON array of classes with this exact structure:
[
  {
    "subject": "Subject Name",
    "day": "Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday",
    "startTime": "HH:MM AM/PM",
    "endTime": "HH:MM AM/PM",
    "roomNumber": "Room number if available or empty string",
    "facultyName": "Faculty name if available or empty string"
  }
]

Rules:
1. Extract all classes from the timetable
2. Use proper day names (Monday, Tuesday, etc.)
3. Use 12-hour time format (e.g., "09:00 AM", "02:30 PM")
4. If room number or faculty name is not available, use empty string
5. Return ONLY the JSON array, no explanation

JSON Array:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    // Extract JSON from response
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Failed to parse timetable data');
    }

    const classes = JSON.parse(jsonMatch[0]);

    return classes;
  } catch (error) {
    console.error('Timetable extraction error:', error);
    throw new Error('Failed to extract timetable: ' + error.message);
  }
};
