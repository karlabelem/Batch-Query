import express from 'express';
import multer from 'multer';
import cors from 'cors';
import sharp from 'sharp'; // For image processing

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true); // Accept the file
    } else {
      cb(new Error('Only image files are allowed!'), false); // Reject the file
    }
  },
});

// Middleware to parse JSON and URL-encoded data
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route to process images
app.post('/api/process-images', upload.array('images', 4), async (req, res) => {
  try {
    const query = req.body.query;
    const images = req.files;

    if (!query || !images || images.length === 0) {
      return res.status(400).json({ error: 'Missing query or images.' });
    }

    // Process each image using Sharp
    const processedImages = await Promise.all(
      images.map(async (image, index) => {
        const processedImageBuffer = await sharp(image.buffer)
          .resize(300, 300) // Resize to 300x300
          .toFormat('jpeg') // Convert to JPEG
          .toBuffer();

        // Return a mock response for each image
        return {
          filename: image.originalname,
          response: `Processed Image ${index + 1}: ${query}`,
          size: processedImageBuffer.length, // Size of the processed image
        };
      })
    );

    res.json({ processedImages });
  } catch (err) {
    console.error('Error processing images:', err);
    res.status(500).json({ error: 'Failed to process images.' });
  }
});

// Global error handler for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Handle multer-specific errors
    return res.status(400).json({ error: err.message });
  } else if (err.message === 'Only image files are allowed!') {
    // Handle invalid file type
    return res.status(400).json({ error: err.message });
  }
  // Handle other errors
  console.error('Unexpected error:', err);
  res.status(500).json({ error: 'An unexpected error occurred.' });
});

// Start the server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));