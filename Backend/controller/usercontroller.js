const User=require('../models/User')
const favourites=require('../models/favourites')
const mongoose=require('mongoose');
const nodemailer=require('nodemailer');
// const dotenv = require('dotenv');
// dotenv.config();
require('dotenv').config();
const createUser = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await User.hashPassword(password);
      const existinguser=await User.findOne({email});
      if(existinguser){
        console.log('User already exists');
        return res.status(409).json({ error: 'User already exists' });
      }
      const user = new User({ username, email,password:hashedPassword });
      await user.save();
      const token=user.generateAuthToken();
      
      res.status(201).json({user,token});
    } catch (error) {
      console.log('In catch block');
      
      res.status(400).json({ error: error.message });
    }
  };
  
  const getUsers = async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  const loginuser=async(req,res)=>{
    try {
      const { email, password } = req.body;
      const user= await User.findOne({email});
      if(!user){
        res.status(404).json({error:"user not found"});
      }
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
      }
      const token = user.generateAuthToken();
      res.cookie('token', token);
      console.log('token : ',token);
      
      res.status(200).json({token,user});
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: error.message });
    }
  }
  const getprofile=async(req,res)=>{res.send(req.user);};

  const save =async(req,res)=>{
    try {
      const { userId, title, ingredients, steps, image } = req.body;

  const favorite = {
    recipeId: new mongoose.Types.ObjectId(), 
    userId,// Generate unique ID
    title,
    ingredients,
    steps,
    image,
    savedAt: new Date(),
    source: 'chatbot' // Track origin
  };

  // await User.findByIdAndUpdate(
  //   req.user._id,
  //   { $addToSet: { favorites: favorite } },
  //   { new: true }
  // );

  const newfavorite =  new favourites(favorite);
  await newfavorite.save();
  res.status(201).json(newfavorite);
    } catch (error) {
      console.log('Error in saving recipe : ',error.message);
      res.status(400).json({ error: error.message });
    }
  }

  const getallusers=async(req,res)=>{
    try {
      const users = await User.find();
      res.status(200).json({users});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

//   const nodemailer = require('nodemailer');
// require('dotenv').config(); // <-- Make sure this is called early

const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Please fill in all fields.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mrunknown.2005.2027@gmail.com',
        pass: 'mxscayqtduvwwoce',
      },
    });

    const mailOptions = {
      from: email,
      to: 'mrunknown.2005.2027@gmail.com',
      replyTo: 'mrunknown.2005.2027@gmail.com',
      subject: `Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send email.' });
  }
};


const getfavourites=async(req,res)=>{
  const { userId } = req.body;
  try {
    // const favorites = await favourites.findById({ userId });
    const response = await favourites.find({userId:userId});
    console.log('favorites : ',response);
    // const filteredFavorites = response.favorites.filter(favorite => favorite.userId === userId);
    res.status(200).json({response});
  } catch (error) {
    console.log('Error in getting favourites : ',error.message);
    res.status(400).json({ error: error.message });
  }
}



  module.exports={
    createUser,
    getUsers,
    loginuser,
    getprofile,
    getallusers,
    save,
    getfavourites,
    sendContactEmail
  }