const express = require('express');
const app = express();

app.use(express.json());

const orders = [
  { id: 101, item: 'Laptop', quantity: 1 },
  { id: 102, item: 'Phone', quantity: 2 },
];

// Route to fetch all orders
app.get('/orders', (req, res) => {
  res.json(orders);
});

const PORT = 3002;
app.listen(PORT, () => console.log(`📦 Order Service running on port ${PORT}`));
