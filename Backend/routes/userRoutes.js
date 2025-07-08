// routes/userRoutes.js
const express = require('express');
const { createUser, getUsers,loginuser,getprofile,getallusers,save,getfavourites,sendContactEmail ,updategrocery,getallgrocery} = require('../controller/usercontroller');
const router = express.Router();
const authmiddleware=require('../middlewares/authmiddleware')

router.post('/signup', createUser);  // Route to create a new user
router.get('/getuser', getUsers); 
router.post('/profile',getprofile)    // Route to get all users
router.post('/login',loginuser)
router.post('/getallusers',getallusers)
router.post('/saverecipe',save)
router.post('/getfavourites',getfavourites)
router.post('/contact',sendContactEmail)
router.post('/updategrocery',updategrocery)
router.post('/allgrocery',getallgrocery)

module.exports = router;
