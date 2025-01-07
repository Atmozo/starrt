const express = require('express');
const router = express.Router();

// Mock route
router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    const error = new Error('Invalid User ID');
    error.status = 400; // Bad Request
    return next(error);
  }

  // Simulate a server error
  if (id === '500') {
    return next(new Error('Simulated Server Error'));
  }

  res.json({ id, name: `User ${id}` });
});

module.exports = router;
