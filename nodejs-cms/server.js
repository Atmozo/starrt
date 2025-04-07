const express = require('express');
const app = express();
require('dotenv').config();

const articleRoutes = require('./routes/articles');

// Middleware
app.use(express.json()); // Parse JSON bodies

// Routes
app.use('/api/articles', articleRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
