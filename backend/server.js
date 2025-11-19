// backend/server.js
import express from 'express';
import cors from 'cors';
import sentimentRoutes from './routes/sentimentRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sentiment', sentimentRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Sentiment Analysis API is running!',
    endpoints: {
      train: 'POST /api/sentiment/train',
      predict: 'POST /api/sentiment/predict',
      info: 'GET /api/sentiment/info'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: 'Server error', error: err.message });
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`🚀 Server running on port ${PORT} (bound to 127.0.0.1)`);
  console.log(`📚 API Documentation: http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server failed to start:', err);
});
