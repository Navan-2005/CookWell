require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-latest",
  apiVersion: "v1",
  systemInstruction: `You are a helpful and expert cooking assistant. When the user gives the name of a dish or a list of ingredients, respond with a clear, step-by-step recipe. Include the estimated preparation time, cooking time, list of ingredients (with quantities), and detailed instructions. Use a friendly and concise tone. Format the response clearly using sections: Title, Ingredients, Instructions, and Time. If the user provides dietary preferences (e.g., vegan, gluten-free), adjust the recipe accordingly. If the dish is unknown, suggest a related dish based on the input.`
});

let chatSession = null;

async function getRecipe(prompt, roleHistory = []) {
  try {
    if (!chatSession) {
      chatSession = model.startChat({
        history: roleHistory.map(msg => ({
          role: msg.role, // 'user' or 'model'
          parts: [{ text: msg.content }]
        }))
      });
    }

    const result = await chatSession.sendMessage(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw error;
  }
}

module.exports = getRecipe;
