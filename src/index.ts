import express, { Request, Response } from 'express';
import cors from 'cors';
import { createServer } from "http";
import { Server } from "socket.io";

// Create Express app
const app = express();

// Create HTTP server using Express app
const httpServer = createServer(app);

// Initialize Socket.IO with the HTTP server
const io = new Server(httpServer, {
    cors: {
        origin: "*", // Update this to match your client URL
        methods: ["GET", "POST"],
        credentials: true
    }
});

const port = 3000;

// Configure CORS for Express
app.use(cors({
    origin: "http://localhost:5173", // Make sure this matches Socket.IO CORS origin
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
}));

app.use(express.json());

// Basic route for Express
app.get('/', (req: Request, res: Response) => {
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

    socket.on('playerMove', (data)=>{
        console.log(data);
        socket.broadcast.emit('oppMove', data);
    })

    

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log("Disconnected socket ID: ", socket.id);
    });
});

// Start the HTTP server (not the Express app directly)
httpServer.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});