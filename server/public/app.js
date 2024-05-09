"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("./config/database"));
const routes_1 = __importDefault(require("./routes/routes"));
// http
const http_1 = __importDefault(require("http"));
// socket
const socket_io_1 = require("socket.io");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
// Connect to MongoDB
(0, database_1.default)();
// routes
// sample route for checking the application is working or not!
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use('/api/user', routes_1.default);
const PORT = process.env.PORT || 3001;
// Create an HTTP server
const server = http_1.default.createServer(app);
// Create an instance of Socket.IO server and attach it to the HTTP server
const io = new socket_io_1.Server(server);
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
//# sourceMappingURL=app.js.map