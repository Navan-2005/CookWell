require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getdiet(bmi,type) {
  // Use the latest model name (important!)
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",  // Updated model name
    apiVersion: "v1"                 // Force v1 API
  });

  const prompt = `My BMI is ${bmi}. Based on this value, suggest a detailed and healthy recipe that supports an appropriate dietary ${type}. Please include the following:
- Dish name
- Ingredients (with exact quantities)
- Step-by-step cooking instructions
- Total preparation and cooking time
- Nutritional tips or optional variations

Ensure the recipe aligns with health goals related to the given BMI.`;


  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
}

module.exports = getdiet;