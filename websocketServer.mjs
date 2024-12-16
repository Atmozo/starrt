import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

// Handle WebSocket connection events
wss.on('connection', (ws) => {
  console.log('A new client connected.');

  // Send a message to the client once they are connected
  ws.send('Welcome to the WebSocket server!');

  // Handle incoming messages from the client
  ws.on('message', (message) => {
    // Log the received message in a human-readable format
    console.log('Received:', message.toString());

    // Respond to the client with a message
    ws.send(`You sent: ${message}`);
  });

  // Handle the WebSocket close event
  ws.on('close', () => {
    console.log('A client has disconnected.');
  });

  // Handle WebSocket error event
  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

console.log('WebSocket server is listening on ws://localhost:8080');
