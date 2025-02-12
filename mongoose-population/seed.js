const mongoose = require("mongoose");
const { User, Post } = require("./models");

// Connect to MongoDB
mongoose.connect("mongodb://admin:password@localhost:27017/mydatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  await User.deleteMany({});
  await Post.deleteMany({});

  // Create a user
  const user = await User.create({ name: "John Doe", email: "john@example.com" });

  // Create a post linked to the user
  const post = await Post.create({ title: "Mongoose Population", content: "This is an example of population.", author: user._id });

  console.log("Sample Data Inserted");
  mongoose.connection.close();
};

seedData();
