require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateRecipe(ingredients) {
  // Use the latest model name (important!)
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",  // Updated model name
    apiVersion: "v1"                 // Force v1 API
  });

  const prompt = `I have these ingredients: ${ingredients.join(", ")}.
  Suggest a detailed recipe using them. Include:
  - Dish name
  - Ingredients (with quantities)
  - Step-by-step instructions
  - Cooking time
  - Optional tips`;

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

module.exports = generateRecipe;