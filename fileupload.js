const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Ensure 'uploads' directory exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Dire
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Middleware for parsing JSON
app.use(express.json());

// Debug: Log every incoming request
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Route for uploading a single file
app.post('/upload', upload.single('file'), (req, res) => {
  console.log('Single file upload request received');
  if (!req.file) {
    console.error('No file uploaded');
    return res.status(400).json({ message: 'No file uploaded' });
  }

  console.log('Uploaded file:', req.file);
  res.status(200).json({
    message: 'File uploaded successfully',
    file: req.file,
  });
});

// Route for uploading multiple files
app.post('/uploads', upload.array('files', 5), (req, res) => {
  console.log('Multiple file upload request received');
  if (!req.files || req.files.length === 0) {
    console.error('No files uploaded');
    return res.status(400).json({ message: 'No files uploaded' });
  }

  console.log('Uploaded files:', req.files);
  res.status(200).json({
    message: 'Files uploaded successfully',
    files: req.files,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
