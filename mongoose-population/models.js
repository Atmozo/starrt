const mongoose = require("mongoose");

// Connect to MongoDB
mongoose.connect("mongodb://admin:password@localhost:27017/mydatabase?", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => console.error("MongoDB connection error:", err));
// Define the User schema
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
});

// Define the Post schema with a reference to User
const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User
});

const User = mongoose.model("User", UserSchema);
const Post = mongoose.model("Post", PostSchema);

module.exports = { User, Post };
