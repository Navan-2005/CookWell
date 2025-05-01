const router=require('express').Router();
const {generateRecipefromimg,getRecipefromtxt}=require('../controller/aiController');

router.post('/generate-recipe',generateRecipefromimg)
router.post('/get-recipe',getRecipefromtxt)

module.exports=router;