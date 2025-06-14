require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');

const port = process.env.PORT || 4000;
const server = http.createServer(app);
app.set('PORT_NUMBER', port);

// Mongo
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(console.error);

// HTTP
server.listen(port, () => console.log(`Server up on ${port} - ${new Date().toISOString()}`));

// graceful shutdown
process.on('SIGTERM', () => server.close(() => process.exit(0)));

module.exports = server;
