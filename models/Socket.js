const app = require('../server');
const http = require("http")
const server = http.createServer(app);
const socketio = require("socket.io");
const options = {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
};
const io = socketio(server, options);

module.exports = (socket) => {
    console.log('a user connected');
    socket.emit('admin-message', 'Hi there, new friend!')
    socket.broadcast.emit('admin-message', `A new friend has arrived!`)

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('request-join-game', ({gameId, username}) => {
        console.log(`${username} joining ${gameId}`)

        socket.join(gameId)
        socket.broadcast.to(gameId).emit('add-user', { username })

        const roomData = io.sockets.adapter.rooms[gameId]
        const inRoomCount = roomData.length
        const inRoomIds = Object.keys(roomData.sockets)

        socket.emit('entry-permission', { gameId, players: inRoomIds})
        socket.to(gameId).emit('new-player-joining', { username, gameId })
        io.in(gameId).emit('admin-message', `${inRoomCount} players now in ${gameId}!`)
    })
};