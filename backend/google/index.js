const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API);

const gemini = genAI.getGenerativeModel({
  model: "gemini-3.5-flash",
  systemInstruction:
    "You are an assistant at MediCare Medical services Website.",
  generationConfig: {
    temperature: 0.3,
  },
});

module.exports = { gemini };
