const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const app = express();

// Critical error/activity log, written to /app/logs (bind-mounted to host)
const logDir = path.join(__dirname, 'logs');
const logFile = path.join(logDir, 'server.log');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
const writeLog = (msg) => {
  fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
};

// SABOTAGE 1: Expects a very specific environment variable name!
const dbUri = process.env.DATABASE_URI || 'mongodb://localhost:27017/phoenix';

mongoose.connect(dbUri)
  .then(() => console.log('Connected to MongoDB!'))
  .catch(err => console.error('Failed to connect:', err));

// SABOTAGE 2: Express is looking for a 'public' folder, but Vite builds to 'dist'!
const uiPath = path.join(__dirname, 'dist'); 
app.use(express.static(uiPath));

app.get('/api/health', (req, res) => {
  writeLog('Health check hit - API is alive');
  res.json({ status: 'API is alive' });
});

app.listen(5000, () => console.log('Server running on port 5000'));