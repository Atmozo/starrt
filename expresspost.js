const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Route to handle POST requests
app.post('/submit', (req, res) => {
  const { name, email } = req.body; // Access the parsed data from the request body
  res.send(`Received data: Name - ${name}, Email - ${email}`);
});


app.listen(3000, () => console.log('Server is running on http://localhost:3000'));
