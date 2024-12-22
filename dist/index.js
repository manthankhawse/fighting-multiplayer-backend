"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const socket_io_1 = require("socket.io");
// Create Express app
const app = (0, express_1.default)();
// Create HTTP server using Express app
const httpServer = (0, http_1.createServer)(app);
// Initialize Socket.IO with the HTTP server
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*", // Update this to match your client URL
        methods: ["GET", "POST"],
        credentials: true
    }
});
const port = 3000;
// Configure CORS for Express
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // Make sure this matches Socket.IO CORS origin
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
}));
app.use(express_1.default.json());
// Basic route for Express
app.get('/', (req, res) => {
    res.send('Hello, TypeScript with Express!');
});
let players = [];
// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(socket.id);
    // Handle incoming messages
    socket.on('playerMoveRight', (data) => {
        // console.log("Opp moved ", socket.id);
        socket.broadcast.emit('oppMoveLeft');
    });
    socket.on('playerMoveLeft', (data) => {
        // console.log("Opp moved ", socket.id);
        socket.broadcast.emit('oppMoveRight');
    });
    socket.on('playerJump', (data) => {
        // console.log("Opp moved ", socket.id);
        socket.broadcast.emit('oppJump', data);
    });
    socket.on('playerMove', (data) => {
        console.log(data);
        socket.broadcast.emit('oppMove', data);
    });
    // Handle disconnect
    socket.on('disconnect', () => {
        console.log("Disconnected socket ID: ", socket.id);
    });
});
// Start the HTTP server (not the Express app directly)
httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
