const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

const ProductSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
});

const User = mongoose.model('User', UserSchema);
const Product = mongoose.model('Product', ProductSchema);

module.exports = { User, Product };
