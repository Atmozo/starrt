const WebSocket = require('ws');
const redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

// Redis setup
const redisPublisher = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
});

const redisSubscriber = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
  },
});

// Connect Redis
redisPublisher.connect().catch(console.error);
redisSubscriber.connect().catch(console.error);

// WebSocket 
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Send a msg when a client connects
  ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

  // Handling incoming messages from clients
  ws.on('message', (data) => {
    console.log('Received:', data);

    // Publish the message to Redis
    redisPublisher.publish('messages', data);
  });

  // Handle WebSocket disconnection
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Listen to messages on Redis and broadcast them
redisSubscriber.subscribe('messages', (message) => {
  console.log('Broadcasting message:', message);

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
});

console.log('WebSocket server running on ws://localhost:8080');
