// models/User.js
const mongoose = require('mongoose');
const favoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  recipeId: { type: String, required: true },
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  steps: { type: [String] },
  image: String,
  savedAt: { type: Date, default: Date.now }
}, { _id: false }); // Prevents nested IDs

const favourites = mongoose.model('favourites', favoriteSchema);

module.exports = favourites;