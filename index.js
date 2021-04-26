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

    socket.on('request-join-game', ({room, username}) => {

        socket.join(room)
        socket.broadcast.to(room).emit('add-user', { username })

        const roomData = io.sockets.adapter.rooms.get(room);
        const inRoomCount = roomData.size

        socket.to(room).emit('new-player-joining', { username, room })
        io.in(room).emit('admin-message', `${inRoomCount} players now in ${room}!`)
    })
})

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Express now departing from port ${port}!`))