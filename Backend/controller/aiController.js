const generateRecipe = require("../ai/getrecipe");
const getRecipe = require("../ai/recipefromtext");
const getdiet = require("../ai/bmicalculator");

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

const getpersonalised = async (req,res)=>{
  const {user}=req.body;
  try {
    const recipe = await getdiet(user);
    console.log(recipe);
    
    res.status(200).json({ dietPlan:recipe });
  } catch (error) {
    console.log('Getting diet error : ',error);
    res.status(500).send({ error});
  }

}

module.exports = {
  generateRecipefromimg,getRecipefromtxt,getpersonalised
};
