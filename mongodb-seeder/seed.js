const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { User, Product } = require('./models');

dotenv.config();

// Sample data
const users = [
  { name: 'Alice', email: 'alice@gmail.com', age: 25 },
  { name: 'Ashely', email: 'ashely@outlook.com', age: 30 },
  { name: 'Fran', email: 'fran@outlook.com', age: 35 },
];

const products = [
  { name: 'Laptop', price: 999.99, category: 'Electronics' },
  { name: 'Chair', price: 49.99, category: 'Furniture' },
  { name: 'Notebook', price: 2.99, category: 'Stationery' },
];

// Seed function
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('Existing data cleared');

    // Insert new data
    await User.insertMany(users);
    await Product.insertMany(products);
    console.log('Data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
};

seedDatabase();
