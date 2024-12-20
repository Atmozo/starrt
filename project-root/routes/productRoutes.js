const express = require('express');
const router = express.Router();

// Define product-related routes
router.get('/', (req, res) => {
  res.send('Product List');
});

router.get('/:id', (req, res) => {
  res.send(`Product Details with ID: ${req.params.id}`);
});

module.exports = router;
