// ============================================
// server.js
// ============================================
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./utils/requestLogger');
// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enable CORS
app.use(cors());

app.use(requestLogger);
// Routes
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/artists', require('./routes/artistRoutes'));
app.use('/api/v1/artworks', require('./routes/artworkRoutes'));
app.use('/api/v1/orders', require('./routes/orderRoutes'));
app.use('/api/v1/reviews', require('./routes/reviewRoutes'));
app.use('/api/v1/community', require('./routes/communityRoutes'));

// Error handler middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
