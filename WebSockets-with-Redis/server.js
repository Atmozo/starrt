// server.js - Updated with support for raw WebSockets
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { createAdapter } = require('@socket.io/redis-adapter');
const { createClient } = require('redis');
const WebSocket = require('ws');
const path = require('path');

// Create Express app and HTTP server
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server);

// Also create a WebSocket server on the same HTTP server
// This allows us to handle raw WebSocket connections (like from wscat)
const wss = new WebSocket.Server({ noServer: true });

// Configuration
const PORT = process.env.PORT || 3000;
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

// Serve static client file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client.html'));
});

// Set up Redis clients
const pubClient = createClient({ url: REDIS_URL });
const subClient = pubClient.duplicate();

// Create a third Redis client for raw WebSocket communication
const wsRedisClient = createClient({ url: REDIS_URL });

// Track connected clients
let connectedClients = 0;
let rawWsClients = new Map(); // Track raw WebSocket clients

// Main function
async function main() {
  try {
    // Connect Redis clients
    await pubClient.connect();
    await subClient.connect();
    await wsRedisClient.connect();
    
    console.log('Connected to Redis server at:', REDIS_URL);
    
    // Set up Redis pub/sub for raw WebSockets
    const channelName = 'ws-messages';
    await wsRedisClient.subscribe(channelName, (message) => {
      // When a message is received from Redis, broadcast to all raw WebSocket clients
      const msgData = JSON.parse(message);
      
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          // Don't send back to the original sender
          const clientId = rawWsClients.get(client);
          if (clientId !== msgData.sender) {
            client.send(JSON.stringify({
              type: msgData.type,
              message: msgData.message,
              sender: msgData.sender,
              serverInstance: process.env.SERVER_INSTANCE || 'default'
            }));
          }
        }
      });
    });
    
    // Set up the Redis adapter for Socket.IO
    io.adapter(createAdapter(pubClient, subClient));
    
    // Socket.IO connection handler
    io.on('connection', (socket) => {
      connectedClients++;
      console.log(`Socket.IO client connected: ${socket.id} (Total: ${connectedClients})`);
      
      // Broadcast new connection info
      io.emit('server-info', `New client connected. Total clients: ${connectedClients}`);
      
      // Send welcome message to new client
      socket.emit('welcome', {
        message: 'Welcome to the WebSocket server!',
        socketId: socket.id,
        serverInstance: process.env.SERVER_INSTANCE || 'default'
      });
      
      // Handle broadcast messages
      socket.on('chat-message', (msg) => {
        console.log(`Message from ${socket.id}: ${msg}`);
        // Broadcast to all clients across all server instances
        io.emit('chat-message', {
          sender: socket.id,
          text: msg,
          timestamp: new Date().toISOString(),
          serverInstance: process.env.SERVER_INSTANCE || 'default'
        });
        
        // Also publish to the raw WebSocket channel
        wsRedisClient.publish(channelName, JSON.stringify({
          type: 'chat-message',
          message: msg,
          sender: socket.id,
          timestamp: new Date().toISOString()
        }));
      });
      
      // Handle room joining
      socket.on('join-room', (room) => {
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);
        io.to(room).emit('room-event', {
          type: 'join',
          room: room,
          user: socket.id,
          timestamp: new Date().toISOString()
        });
      });
      
      // Handle room messages
      socket.on('room-message', (data) => {
        console.log(`Room message from ${socket.id} to ${data.room}: ${data.message}`);
        io.to(data.room).emit('room-message', {
          sender: socket.id,
          room: data.room,
          text: data.message,
          timestamp: new Date().toISOString(),
          serverInstance: process.env.SERVER_INSTANCE || 'default'
        });
      });
      
      // Handle private messages
      socket.on('private-message', (data) => {
        console.log(`Private message from ${socket.id} to ${data.to}: ${data.message}`);
        io.to(data.to).emit('private-message', {
          sender: socket.id,
          text: data.message,
          timestamp: new Date().toISOString(),
          serverInstance: process.env.SERVER_INSTANCE || 'default'
        });
      });
      
      // Handle disconnect
      socket.on('disconnect', () => {
        connectedClients--;
        console.log(`Socket.IO client disconnected: ${socket.id} (Total: ${connectedClients})`);
        io.emit('server-info', `A client disconnected. Total clients: ${connectedClients}`);
      });
      
      // Handle errors
      socket.on('error', (error) => {
        console.error(`Socket error for ${socket.id}:`, error);
      });
    });
    
    // Handle raw WebSocket connections (for wscat)
    wss.on('connection', (ws, req) => {
      // Generate a simple ID for this raw WebSocket client
      const clientId = 'raw-' + Math.random().toString(36).substring(2, 10);
      rawWsClients.set(ws, clientId);
      
      console.log(`Raw WebSocket client connected: ${clientId}`);
      
      // Welcome message
      ws.send(JSON.stringify({
        type: 'welcome',
        message: 'Welcome to the raw WebSocket server!',
        clientId: clientId,
        serverInstance: process.env.SERVER_INSTANCE || 'default'
      }));
      
      // Handle messages from this client
      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          console.log(`Raw WebSocket message from ${clientId}:`, data);
          
          // Handle different event types
          if (data.event === 'chat-message') {
            // Publish to Redis so all servers receive it
            wsRedisClient.publish(channelName, JSON.stringify({
              type: 'chat-message',
              message: data.data,
              sender: clientId,
              timestamp: new Date().toISOString()
            }));
            
            // Also send to Socket.IO clients
            io.emit('chat-message', {
              sender: clientId,
              text: data.data,
              timestamp: new Date().toISOString(),
              serverInstance: process.env.SERVER_INSTANCE || 'default'
            });
            
            // Send back to this client too
            ws.send(JSON.stringify({
              type: 'chat-message',
              message: data.data,
              sender: clientId,
              serverInstance: process.env.SERVER_INSTANCE || 'default'
            }));
          }
          // Add more event handlers as needed
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Invalid message format. Expected JSON with event and data fields.'
          }));
        }
      });
      
      // Handle client disconnect
      ws.on('close', () => {
        console.log(`Raw WebSocket client disconnected: ${clientId}`);
        rawWsClients.delete(ws);
      });
    });
    
    // Handle upgrade for WebSocket connections
    server.on('upgrade', (request, socket, head) => {
      const pathname = new URL(request.url, 'http://localhost').pathname;
      
      if (pathname === '/ws') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      } else {
        // Let Socket.IO handle its own upgrades
        socket.destroy();
      }
    });
    
    // Start HTTP server
    server.listen(PORT, () => {
      console.log(`Server instance ${process.env.SERVER_INSTANCE || 'default'} running on port ${PORT}`);
    });
    
    // Handle process termination
    const cleanup = async () => {
      console.log('Shutting down server...');
      await pubClient.quit();
      await subClient.quit();
      await wsRedisClient.quit();
      io.close();
      wss.close();
      server.close();
      process.exit(0);
    };
    
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
    
  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

main();
