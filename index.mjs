import express from 'express';
import cors from 'cors';
import FileUpload from 'express-fileupload';
import { ChatEngine } from "./main.mjs";
import * as http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Ensure this matches your React app's URL
        methods: ['GET', 'POST'],
        credentials: true, // Allow credentials if needed
    }
});

app.use(cors());
app.use(FileUpload());
app.use(express.json());

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('send message', async (msg) => {
        const chatEngine = new ChatEngine();
        await chatEngine.connect();
        await chatEngine.SendMessage(msg);
        const response = await chatEngine.GetMessages(msg.from,msg.to);
        await chatEngine.disconnect();
        io.emit('receive message', response);
    });
    socket.on('request Messages',async (users)=>{
        const chatEngine = new ChatEngine();
        await chatEngine.connect();
        const response = await chatEngine.GetMessages(users.from,users.to);
        await chatEngine.disconnect();
        socket.emit('receive message', response);
    })
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// User registration endpoint
app.post('/signup', async (req, res) => {
    const chatEngine = new ChatEngine();
    await chatEngine.connect();
    const response = await chatEngine.RegisterUser({
        username: req.body.username,
        name: req.body.name,
        password: req.body.password,
        profile: {
            avatar: req.files.avatar
        }
    });
    await chatEngine.disconnect();
    res.send(response);
});

// User login endpoint
app.post('/login', async (req, res) => {
    const chatEngine = new ChatEngine();
    await chatEngine.connect();
    const response = await chatEngine.GetUser(req.body.username, req.body.password);
    await chatEngine.disconnect();
    res.send(response);
});

// Get user profiles endpoint
app.post('/getprofiles', async (req, res) => {
    const chatEngine = new ChatEngine();
    await chatEngine.connect();
    const response = await chatEngine.GetProfiles(req.body.username);
    await chatEngine.disconnect();
    res.send(response);
});

// Send message endpoint
app.post('/send', async (req, res) => {
    const chatEngine = new ChatEngine();
    await chatEngine.connect();
    const response = await chatEngine.SendMessage(req.body);
    await chatEngine.disconnect();
    res.send(response);
});

// Get messages endpoint
app.post('/messages', async (req, res) => {
    const chatEngine = new ChatEngine();
    await chatEngine.connect();
    const response = await chatEngine.GetMessages(req.body.from, req.body.to);
    await chatEngine.disconnect();
    res.send(response);
});

// Start the server
const PORT = 3001; // Ensure this is the port you're using for the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});