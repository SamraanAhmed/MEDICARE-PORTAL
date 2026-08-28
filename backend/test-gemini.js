const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);

const modelsToTest = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-001",
  "gemini-1.5-pro",
  "gemini-pro"
];

async function testModels() {
  console.log("Testing Gemini API Key...");
  if (!process.env.GOOGLE_API) {
    console.error("No GOOGLE_API environment variable found!");
    process.exit(1);
  }

  for (const modelName of modelsToTest) {
    console.log(`\nTesting model: ${modelName}...`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Say 'hello' in one word.");
      const response = await result.response;
      const text = response.text();
      console.log(`SUCCESS [${modelName}]: ${text}`);
    } catch (error) {
      console.error(`FAILED [${modelName}]: ${error.message}`);
    }
  }
}

testModels();
