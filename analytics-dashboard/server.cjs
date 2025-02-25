const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const geoip = require('geoip-lite');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// In-memory storage for analytics (in production, use a database)
let analytics = {
  activeUsers: 0,
  pageViews: {},
  locations: {},
  events: []
};

// Middleware to parse JSON
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  analytics.activeUsers++;
  
  // Get user's IP and location
  const clientIp = socket.handshake.address;
  const geo = geoip.lookup(clientIp) || {
    country: 'Unknown',
    region: 'Unknown',
    city: 'Unknown'
  };
  
  // Store location data
  const locationKey = `${geo.country}-${geo.region}`;
  analytics.locations[locationKey] = (analytics.locations[locationKey] || 0) + 1; // Fixed: was "a1"
  
  // Emit updated analytics to all clients
  io.emit('analytics-update', analytics);
  
  // Handle page view events
  socket.on('page-view', (page) => {
    analytics.pageViews[page] = (analytics.pageViews[page] || 0) + 1;
    analytics.events.push({
      type: 'page-view',
      page,
      timestamp: new Date(),
      location: locationKey
    });
    io.emit('analytics-update', analytics);
  });
  
  // Handle custom events
  socket.on('custom-event', (eventData) => {
    analytics.events.push({
      ...eventData,
      timestamp: new Date(),
      location: locationKey
    });
    io.emit('analytics-update', analytics);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    analytics.activeUsers--;
    analytics.locations[locationKey]--;
    io.emit('analytics-update', analytics);
  });
});

// API endpoints for getting analytics data
app.get('/api/analytics', (req, res) => {
  res.json(analytics);
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Analytics server running on port ${PORT}`);
});
