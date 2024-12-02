const http = require('http');

//  HTTP server
const server = http.createServer((req, res) => {
  // common response header
  res.setHeader('Content-Type', 'text/plain');

  // Routing logic
  if (req.url === '/' && req.method === 'GET') {
    res.statusCode = 200;
    res.end('Welcome to the Home Page!');
  } else if (req.url === '/about' && req.method === 'GET') {
    res.statusCode = 200;
    res.end('This is the About Page.');
  } else if (req.url === '/contact' && req.method === 'GET') {
    res.statusCode = 200;
    res.end('Contact us at contact@mozo.com.');
  } else if (req.url === '/api/data' && req.method === 'GET') {
    //  sending JSON data
    res.setHeader('Content-Type', 'application/json');
    res.statusCode = 200;
    res.end(JSON.stringify({ message: 'Here is your data.', data: [1, 2, 3] }));
  } else {
    // Handle unknown routes
    res.statusCode = 404;
    res.end('404 Not Found');
  }
});

// Start the server on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
