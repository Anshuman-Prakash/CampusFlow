import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('\n🔍 Testing Gemini API Key...\n');
console.log(`API Key Format: ${API_KEY?.substring(0, 10)}...`);
console.log(`API Key Length: ${API_KEY?.length}\n`);

const MODEL_VARIANTS = [
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-flash-latest',
  'gemini-pro-latest',
  'gemini-pro',
  'gemini-1.5-pro',
];

async function testModels() {
  const genAI = new GoogleGenerativeAI(API_KEY);
  
  for (const modelName of MODEL_VARIANTS) {
    try {
      console.log(`Testing: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say hello in 3 words');
      const response = await result.response;
      const text = response.text();
      
      console.log(`✅ SUCCESS: ${modelName}`);
      console.log(`   Response: "${text}"\n`);
      
      // Found a working model, stop testing
      process.exit(0);
    } catch (error) {
      console.log(`❌ FAILED: ${modelName}`);
      console.log(`   Error: ${error.message}\n`);
    }
  }
  
  console.log('❌ No working model found. Please check your API key.\n');
  process.exit(1);
}

testModels();
