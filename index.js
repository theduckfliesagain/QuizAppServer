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

let socketUsernames = {};

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('admin-message', 'Hi there, new friend!')
    socket.broadcast.emit('admin-message', `A new friend has arrived!`)

    socket.on('disconnect', () => {
        if (socket.id.values().next().value in socketUsernames) {
            delete socketUsernames[socket.id.values().next().value];
        }
        console.log('user disconnected');
    });

    socket.on('request-join-game', ({room, username}) => {
        console.log(socket.id)
        socketUsernames[socket.id.values().next().value] = username;
        socket.join(room)
        socket.broadcast.to(room).emit('add-user', { username })

        const roomData = io.sockets.adapter.rooms.get(room);
        const inRoomCount = roomData.size
        console.log(roomData)

        socket.to(room).emit('new-player-joining', { username, room })
        io.in(room).emit('admin-message', `${inRoomCount} players now in ${room}!`)
    })
})

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Express now departing from port ${port}!`))