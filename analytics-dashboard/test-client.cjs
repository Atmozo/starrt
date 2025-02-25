const { io } = require("socket.io-client");

// Mock locations for testing
const mockLocations = [
  'US-California',
  'UK-London',
  'JP-Tokyo',
  'DE-Berlin',
  'FR-Paris',
  'CA-Toronto',
  'AU-Sydney'
];

// Sample pages for simulation
const pages = [
  '/home',
  '/products',
  '/about',
  '/contact',
  '/blog',
  '/pricing',
  '/login',
  '/signup',
  '/checkout',
  '/dashboard'
];

// Function to simulate a single user
const simulateUser = (userId) => {
  console.log(`[User ${userId}] Connecting...`);
  
  // Connect to the server
  const socket = io("http://localhost:4000");
  
  // Set up activity pattern
  const viewCount = 3 + Math.floor(Math.random() * 8); // 3-10 page views
  let viewsSent = 0;
  
  // Function to send a random page view
  const sendPageView = () => {
    if (viewsSent >= viewCount) {
      console.log(`[User ${userId}] Session complete, disconnecting`);
      socket.disconnect();
      return;
    }
    
    const randomPage = pages[Math.floor(Math.random() * pages.length)];
    socket.emit('page-view', randomPage);
    console.log(`[User ${userId}] Viewed page: ${randomPage}`);
    viewsSent++;
    
    // Schedule next page view with random delay
    const nextDelay = 1000 + Math.floor(Math.random() * 4000);
    setTimeout(sendPageView, nextDelay);
  };
  
  // Occasionally send custom events
  if (Math.random() > 0.7) {
    setTimeout(() => {
      const eventTypes = ['click', 'download', 'signup', 'purchase'];
      const randomType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
      
      socket.emit('custom-event', {
        type: randomType,
        page: pages[Math.floor(Math.random() * pages.length)],
        details: `Test event ${randomType} from user ${userId}`
      });
      
      console.log(`[User ${userId}] Sent custom event: ${randomType}`);
    }, 3000 + Math.random() * 5000);
  }
  
  // Start sending page views after a small delay
  setTimeout(sendPageView, 500 + Math.random() * 1000);
};

// Main simulation function
const runSimulation = (userCount, waveDuration) => {
  console.log(`Starting simulation with ${userCount} users over ${waveDuration / 1000} seconds`);
  
  let usersCreated = 0;
  
  // Create users at random intervals
  const interval = setInterval(() => {
    if (usersCreated >= userCount) {
      clearInterval(interval);
      console.log("All users created, simulation running...");
      return;
    }
    
    simulateUser(usersCreated + 1);
    usersCreated++;
    
  }, waveDuration / userCount);
  
  // After all users have had time to complete their sessions, offer to run another wave
  setTimeout(() => {
    console.log("\n--- First wave completed ---");
    console.log("To run another wave, call runSimulation(userCount, waveDuration) again");
  }, waveDuration + 15000);
};

// Start with 15 users over 30 seconds
console.log("Starting analytics test client");
console.log("Make sure your server is running on http://localhost:4000");
console.log("---------------------------------------------");

// Export the function so it can be called from the console
module.exports = { runSimulation };

// Auto-start the simulation
runSimulation(15, 30000);

console.log("\nTo run more simulations, use:");
console.log("runSimulation(userCount, durationInMs)");
console.log("Example: runSimulation(20, 60000) for 20 users over 60 seconds");
