const express = require('express');
const app = express();

// Sample data 
const data = [
  { id: 1, name: 'Ashely', age: 25, city: 'Zimbabwe' },
  { id: 2, name: 'Fran', age: 30, city: 'South Africa' },
  { id: 3, name: 'chaps', age: 35, city: 'Zambia' },
  { id: 4, name: 'gijg', age: 40, city: 'San Francisco' },
  { id: 5, name: 'Evey', age: 45, city: 'Boston' },
];

// Helper function for pagination
function paginate(array, page, limit) {
  const offset = (page - 1) * limit;
  return array.slice(offset, offset + limit);
}

// Endpoint with query parameters: filtering, validation, and pagination
app.get('/api/users', (req, res) => {
  const { name, age, city, page = 1, limit = 2 } = req.query;

  // Validation for `page` and `limit`
  if (isNaN(page) || isNaN(limit)) {
    return res.status(400).send('Page and limit must be numbers');
  }

  // Filter data based on query parameters
  let filteredData = data.filter((item) => {
    return (
      (!name || item.name.toLowerCase().includes(name.toLowerCase())) &&
      (!age || item.age === Number(age)) &&
      (!city || item.city.toLowerCase() === city.toLowerCase())
    );
  });

  // Paginate the filtered data
  const paginatedData = paginate(filteredData, Number(page), Number(limit));

  res.send({
    totalItems: filteredData.length,
    totalPages: Math.ceil(filteredData.length / limit),
    currentPage: Number(page),
    pageSize: Number(limit),
    users: paginatedData,
  });
});


app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000');
});
