const express = require('express');
const fs = require('fs'); // For file storage
const path = require('path'); // For path manipulation
const multer = require('multer'); // For file upload handling

const app = express();
const port = 3000;

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

// Configure Multer for file upload handling
const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 5242880 }, // Limit file size to 5MB (adjust as needed)
  fileFilter: (req, file, cb) => {
    const allowedExtensions = ['.wav', '.mp3'];
    const extname = path.extname(file.originalname);
    if (allowedExtensions.includes(extname)) {
      cb(null, true);
    } else {
      cb(new Error('Only WAV or MP3 files are allowed'));
    }
  },
});

// Define route for uploading audio using single file upload
app.post('/upload', upload.single('audioData'), (req, res) => {
  if (req.fileValidationError) {
    return res.status(400).send(req.fileValidationError);
  } else if (req.file) {
    const filename = req.file.filename; // Get filename from Multer
    res.send('Audio uploaded successfully'); // Or handle success differently
  } else {
    res.status(400).send('No audio file uploaded');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
