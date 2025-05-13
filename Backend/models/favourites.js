// models/User.js
const favoriteSchema = new mongoose.Schema({
  recipeId: { type: String, required: true },
  title: { type: String, required: true },
  ingredients: { type: [String], required: true },
  steps: { type: [String] },
  image: String,
  savedAt: { type: Date, default: Date.now }
}, { _id: false }); // Prevents nested IDs

const favourites = mongoose.model('favourites', favoriteSchema);

module.exports = favourites;