const express = require('express');
const session = require('express-session');
const config = require('./config');
const authRouter = require('./api/auth');

const app = express();

// Middleware
app.use(express.json());
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: true, // Set to true to save session for OAuth state
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true,
  }
}));

// Routes
const roomsRouter = require('./api/rooms');
const bookingsRouter = require('./api/bookings');

app.use('/api/auth', authRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);

app.get('/', (req, res) => {
  res.send('Backend server is running! Welcome.');
});

module.exports = app;
