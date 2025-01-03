const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to log requests (optional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Endpoint to stream a text file
app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, 'example.txt');

  // Checking if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('File not found');
  }

  const stat = fs.statSync(filePath);

  //  headers for file download
  res.writeHead(200, {
    'Content-Type': 'text/plain',
    'Content-Length': stat.size,
    'Content-Disposition': 'attachment; filename="example.txt"',
  });

  // Creating a read stream and pipe to response
  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);

  // Handling errors during streaming
  readStream.on('error', (err) => {
    console.error('Error streaming file:', err);
    res.status(500).send('Internal Server Error');
  });
});

// Endpoint to stream a video file with range support
app.get('/video', (req, res) => {
  const filePath = path.join(__dirname, 'video.mp4');

  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Video not found');
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;

  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    const chunkSize = end - start + 1;
    const fileStream = fs.createReadStream(filePath, { start, end });

    // Set headers for partial content
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
    });

    fileStream.pipe(res);
  } else {
    // Set headers for full file download
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    });

    fs.createReadStream(filePath).pipe(res);
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
