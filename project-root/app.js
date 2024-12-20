const express = require('express');
const app = express();


const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

// Use routes
app.use('/users', userRoutes);
app.use('/products', productRoutes);

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
