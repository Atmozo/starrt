const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

app.use('/users', createProxyMiddleware({
  target: 'http://localhost:3001',  
  changeOrigin: true,
  
}));


app.use('/orders', createProxyMiddleware({
  target: 'http://localhost:3002', 
  changeOrigin: true,
  
}));
app.get('/', (req, res) => {
  res.send('API Gateway is running!');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Gateway running on port ${PORT}`));
