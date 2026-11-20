const express = require('express');
const cors = require('cors');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN || process.env.FRONTEND_URL;

const corsOptions = {
  origin: allowedOrigins
    ? allowedOrigins.includes(',')
      ? allowedOrigins.split(',').map((o) => o.trim())
      : allowedOrigins
    : '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Endpoint de health check para Render / orquestradores
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Suporte para rotas com e sem prefixo /api
app.use('/api/books', bookRoutes);
app.use('/books', bookRoutes);

module.exports = app;


