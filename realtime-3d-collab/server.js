const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const sceneRoutes = require('./routes/scene');
const sceneSocket = require('./sockets/sceneSocket');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketio(server, { cors: { origin: '*' } });

connectDB();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/scenes', sceneRoutes);

sceneSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));