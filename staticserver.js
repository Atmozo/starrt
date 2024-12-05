const express = require('express');
const path = require('path'); 
const app = express();

// Serve static files from the  directory
app.use(express.static(path.join(__dirname, 'staticfileswithexpress')));

app.listen(3000, () => console.log('Server is running at http://localhost:3000'));
