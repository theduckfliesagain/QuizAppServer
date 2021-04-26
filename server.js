const express = require('express');
const cors = require('cors');

const server = express();
server.use(cors());
server.use(express.json());

const userRoutes = require('./routes/users')

server.use('/users', userRoutes)

// Root route
server.get('/', (req, res) => res.send('Hello, world!'))

const http = require('http');
const app = http.createServer(server);
const { Server } = require("socket.io");
const io = new Server(app);

io.on('connection', socket => {
    console.log("'Ello, who's this we got here?")

    const participantCount = io.engine.clientsCount
    socket.emit('admin-message', 'Hi there, new friend!')
    socket.broadcast.emit('admin-message', `A new friend has arrived!`)
    io.emit('admin-message', `There is ${participantCount} x friend here now!`)
    
    socket.on("disconnect", socket => {
        console.log("K bye then");
    });
});

module.exports = server