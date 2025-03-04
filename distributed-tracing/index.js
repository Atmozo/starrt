require('./tracing'); // Load tracing first

const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Distributed Tracing!');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

