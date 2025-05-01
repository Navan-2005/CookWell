const generateRecipe = require("../ai/getrecipe");
const getRecipe = require("../ai/recipefromtext");

const generateRecipefromimg = async (req, res) => {
  const { ingredients } = req.body;

  if (!Array.isArray(ingredients)) {
    return res.status(400).json({ error: "Ingredients must be an array" });
  }

  try {
    const recipe = await generateRecipe(ingredients);
    console.log(recipe);

    res.status(200).json({ recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error generating recipe" });
  }
};

const getRecipefromtxt = async (req, res) => {
  const { prompt, history = [] } = req.body;

  try {
    const recipe = await getRecipe(prompt, history);
    res.status(200).json({ recipe });
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ error: "Error generating recipe" });
  }
};

module.exports = {
  generateRecipefromimg,getRecipefromtxt
};
