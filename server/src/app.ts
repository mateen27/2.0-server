import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import connectDatabase from './config/database';
import router from './routes/routes';

// http
import http from 'http';
// socket
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const app: Application = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
connectDatabase();

// routes
// sample route for checking the application is working or not!
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.use('/api/user', router);

const PORT = process.env.PORT || 3001;

// Create an HTTP server
const server = http.createServer(app);

// Create an instance of Socket.IO server and attach it to the HTTP server
const io = new SocketIOServer(server);

// Handle WebSocket connections
io.on('connection', (socket) => {
  // console.log('A user connected');

  // Listen for pause and resume events from the host
  socket.on('pauseVideo', () => {
    // Broadcast to all other users except the host to pause the video
    socket.broadcast.emit('pauseVideo');
  });

  socket.on('resumeVideo', () => {
    // Broadcast to all other users except the host to resume the video
    socket.broadcast.emit('resumeVideo');
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
