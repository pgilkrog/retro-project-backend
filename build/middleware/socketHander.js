"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketIO = void 0;
const socket_io_1 = require("socket.io");
const onlineUsers = [];
function setupSocketIO(httpServer, app) {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: 'http://127.0.0.1:5173',
            methods: ['GET', 'POST', 'PUT'],
        },
    });
    io.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
        socket.on('authendicate', handleAuthendication(socket));
        socket.on('joinRoom', handleJoinRoom(socket, io));
        socket.on('chatMessage', handleChatMessage(socket, io));
        socket.on('chatDisconnect', handleDisconnect(socket));
    }));
    // API endpoint to get the list of online users
    app.get('/api/online-users', (req, res) => {
        const onlineUserEmails = onlineUsers.map((user) => user.email);
        res.json(onlineUserEmails);
    });
}
exports.setupSocketIO = setupSocketIO;
const handleAuthendication = (socket) => (email) => {
    // Create a user object with socketid and email
    const userInfo = {
        email: email,
        socketId: socket.id
    };
    // Check if the user is already in the onlineUsers array
    const userIndex = onlineUsers.find((user) => user.email === email);
    if (!userIndex) {
        // If user does not already exist add it to the array
        onlineUsers.push(userInfo);
        // Emit that the specified user is online
        socket.broadcast.emit('userOnline', onlineUsers.map((user) => user.email));
    }
};
const handleJoinRoom = (socket, io) => (roomUsers) => {
    // check the array of users online from roomUsers
    const usersOnline = roomUsers.every((user) => onlineUsers.some((onlineUser) => onlineUser.email === user));
    // If usersOnline is not undefined or null
    if (usersOnline) {
        // create the room for the two users 
        socket.join(roomUsers.join('-'));
        io.to(roomUsers.join('-')).emit('chatMessage', {
            id: -1,
            text: `Room created with ${roomUsers.join(' and ')}`,
            sender: 'System',
        });
    }
};
const handleChatMessage = (socket, io) => (data) => {
    // Get the roomName from the data
    const { roomName } = data;
    if (data !== undefined)
        // emit the chat message to the users inside the given roomName
        io.to(roomName.join('-')).emit('chatMessage', data);
};
const handleDisconnect = (socket) => (email) => {
    // Get the index of 
    console.log("DISCONNECT HIT");
    const userIndex = onlineUsers.findIndex((user) => user.email === email);
    console.log(userIndex);
    if (userIndex !== -1) {
        const disconnectedUser = onlineUsers[userIndex];
        onlineUsers.splice(userIndex, 1);
        socket.broadcast.emit('userOffline', disconnectedUser.email);
    }
};
