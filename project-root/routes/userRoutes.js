const express = require('express');
const router = express.Router();

// Define user-related routes
router.get('/', (req, res) => {
  res.send('User Home');
});

router.get('/:id', (req, res) => {
  res.send(`User Profile with ID: ${req.params.id}`);
});

module.exports = router;
