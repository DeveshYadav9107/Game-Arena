// server.js
// Entry point of the GameArena backend API

const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

dotenv.config();
connectDB();

const app = express();

// ---- Global Middleware ----
app.use(cors());
app.use(express.json()); // parse JSON request bodies
app.use(express.urlencoded({ extended: true }));

// ---- API Routes ----
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tournaments', require('./routes/tournamentRoutes'));
app.use('/api/registrations', require('./routes/registrationRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));
app.use('/api/leaderboard', require('./routes/leaderboardRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Simple health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'GameArena API is running' });
});

// (Optional) Serve the frontend folder as static files so the whole
// project can be run from a single server during development/viva.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// ---- Error Handling Middleware (must be last) ----
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`GameArena server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
