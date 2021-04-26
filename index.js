const app = require('./server');
const http = require("http")
const server = http.createServer(app);
const socketio = require("socket.io");
//const connectionFunctions =  require('./models/Socket');
const options = {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
};
const io = socketio(server, options);

io.on('connection', (socket) => {
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

        console.log(io.sockets.adapter.rooms)

        const roomData = io.sockets.adapter.rooms.get(gameId);
        console.log(roomData)
        const inRoomCount = roomData.size
        console.log(inRoomCount)
        const inRoomIds = Array(roomData)

        socket.to(gameId).emit('new-player-joining', { username, gameId })
        io.in(gameId).emit('admin-message', `${inRoomCount} players now in ${gameId}!`)
    })
})

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Express now departing from port ${port}!`))