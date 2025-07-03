const router=require('express').Router();
const {generateRecipefromimg,getRecipefromtxt,getpersonalised}=require('../controller/aiController');

router.post('/generate-recipe',generateRecipefromimg)
router.post('/get-recipe',getRecipefromtxt)
router.post('/get-diet',getpersonalised)

module.exports=router;