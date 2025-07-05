// require("dotenv").config();
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// // Initialize with API key
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function getdiet(user) {
//   // Use the latest model name (important!)
//   const model = genAI.getGenerativeModel({ 
//     model: "gemini-2.5-flash",  // Updated model name
//     apiVersion: "v1"                 // Force v1 API
//   });

//   const prompt = `Am of age ${user.age} with heigth ${user.height} cm and weight ${user.weight} kg I want to get ${user.goal} .My exercise level is ${user.activityLevel} and my diet is ${user.diet}. Give me a personlised diet with these information . Please include the following:
// - Dish name
// - Ingredients (with exact quantities)
// - Step-by-step cooking instructions
// - Total preparation and cooking time
// - Nutritional tips or optional variations

// Ensure the recipe aligns with health goals related to the given BMI.`;


//   try {
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     const text = response.text();
//     return text;
//   } catch (error) {
//     console.error("Error generating recipe:", error);
//     throw error;
//   }
// }

// module.exports = getdiet;

require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function getDiet(user) {
  // Use the latest model name
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    apiVersion: "v1"
  });

  const systemInstruction = `You are a professional nutritionist AI assistant specializing in creating personalized diet plans. Your role is to analyze user inputs and generate comprehensive, science-based meal plans tailored to individual needs.

## Your Response Structure:

### 1. NUTRITIONAL ANALYSIS
- Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor equation
- Determine TDEE (Total Daily Energy Expenditure) based on activity level
- Adjust calories based on goal:
  - Weight loss: TDEE - 500 calories (for 1 lb/week loss)
  - Maintenance: TDEE
  - Muscle gain: TDEE + 300-500 calories
- Calculate macronutrient breakdown:
  - Protein: 1.6-2.2g per kg body weight (higher for muscle gain)
  - Fats: 20-35% of total calories
  - Carbohydrates: Remaining calories

### 2. PERSONALIZED MEAL PLAN
Create a detailed 7-day meal plan including:

**Daily Structure:**
- Breakfast (with calories and macros)
- Mid-morning snack
- Lunch (with calories and macros)
- Afternoon snack
- Dinner (with calories and macros)
- Evening snack (if needed)

**For Each Meal Include:**
- Dish name
- Ingredients with exact quantities
- Step-by-step cooking instructions
- Total preparation and cooking time
- Nutritional information (calories, protein, carbs, fats)
- Optional variations or substitutions

### 3. SUPPLEMENTATION RECOMMENDATIONS
- Based on diet type and goals
- Consider potential nutrient gaps
- Include timing and dosage suggestions

### 4. LIFESTYLE TIPS
- Meal prep suggestions
- Timing recommendations around workouts
- Healthy snack options
- Hydration recommendations

### 5. PROGRESS TRACKING
- How to monitor progress
- When to adjust the plan
- Warning signs to watch for

## Important Guidelines:
- Always include medical disclaimer
- Respect dietary restrictions and preferences
- Keep meals practical and accessible
- Use evidence-based recommendations
- Emphasize sustainable, long-term habits
- Include portion sizes and preparation methods`;

  const userPrompt = `Please create a comprehensive personalized diet plan for me based on the following information:

**USER PROFILE:**
- Age: ${user.age} years
- Gender: ${user.gender}
- Height: ${user.height} cm
- Weight: ${user.weight} kg
- Activity Level: ${user.activityLevel}
- Primary Goal: ${user.goal}
- Diet Preference: ${user.diet}

**SPECIFIC REQUIREMENTS:**
1. Calculate my BMR, TDEE, and target daily calories
2. Provide detailed macronutrient breakdown
3. Create a complete 7-day meal plan with:
   - Exact ingredient quantities
   - Step-by-step cooking instructions
   - Preparation and cooking times
   - Nutritional information per meal
   - Alternative options for variety

4. Include practical tips for meal prep and grocery shopping
5. Suggest appropriate supplements if needed
6. Provide guidance on portion control and timing
7. Include hydration recommendations

**DIETARY CONSIDERATIONS:**
- Ensure all meals align with my ${user.diet} preference
- Focus on whole, minimally processed foods
- Include foods that support my goal to ${user.goal}
- Consider my ${user.activityLevel} lifestyle
- Make meals practical for daily preparation

Please format the response clearly with headings and bullet points for easy reading and implementation.`;

  try {
    const result = await model.generateContent([
      { text: systemInstruction },
      { text: userPrompt }
    ]);
    const response = await result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error generating diet plan:", error);
    throw error;
  }
}

module.exports = getDiet;