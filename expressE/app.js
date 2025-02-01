const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage
let products = [
    { id: 'P1001', name: 'Laptop', price: 999.99, stock: 50 },
    { id: 'P1002', name: 'Smartphone', price: 499.99, stock: 100 },
    { id: 'P1003', name: 'Headphones', price: 99.99, stock: 200 },
    { id: 'P1004', name: 'Tablet', price: 299.99, stock: 75 },
    { id: 'P1005', name: 'Smartwatch', price: 199.99, stock: 150 }
];

let carts = new Map();
let orders = new Map();

// GET /api/products - List all products
app.get('/api/products', (req, res) => {
    setTimeout(() => {  // Artificial delay to simulate processing
        res.json(products);
    }, 100);
});

// GET /api/products/:id - Get single product
app.get('/api/products/:id', (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }
    setTimeout(() => {
        res.json(product);
    }, 50);
});

// POST /api/cart - Add to cart
app.post('/api/cart', (req, res) => {
    const { productId, quantity } = req.body;
    const sessionId = req.headers['session-id'] || 'default-session';
    
    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ error: 'Product not found' });
    }

    if (!carts.has(sessionId)) {
        carts.set(sessionId, []);
    }

    const cart = carts.get(sessionId);
    cart.push({ productId, quantity });
    
    setTimeout(() => {
        res.status(201).json({ message: 'Added to cart', cartSize: cart.length });
    }, 150);
});

// POST /api/checkout - Process checkout
app.post('/api/checkout', (req, res) => {
    const { shippingAddress, paymentMethod } = req.body;
    const sessionId = req.headers['session-id'] || 'default-session';
    
    if (!carts.has(sessionId) || carts.get(sessionId).length === 0) {
        return res.status(400).json({ error: 'Cart is empty' });
    }

    const orderId = 'ORD' + Date.now();
    const order = {
        id: orderId,
        items: carts.get(sessionId),
        shippingAddress,
        paymentMethod,
        status: 'confirmed'
    };

    orders.set(orderId, order);
    carts.delete(sessionId);  // Clear cart after checkout

    setTimeout(() => {
        res.json({ orderId, status: 'success' });
    }, 200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});