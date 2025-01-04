const express = require('express');

const app = express();
const PORT = 3000;

// Sample data
const items = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  name: `Item ${i + 1}`,
}));

// Pagination endpoint
app.get('/items', (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default page = 1, limit = 10

  // Convert query parameters to numbers
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  // Validate inputs
  if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
    return res.status(400).json({ message: 'Invalid page or limit value' });
  }

  const startIndex = (pageNum - 1) * limitNum;
  const endIndex = startIndex + limitNum;

  const paginatedItems = items.slice(startIndex, endIndex);

  // Response metadata
  const response = {
    totalItems: items.length,
    totalPages: Math.ceil(items.length / limitNum),
    currentPage: pageNum,
    pageSize: paginatedItems.length,
    data: paginatedItems,
  };

  res.json(response);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
