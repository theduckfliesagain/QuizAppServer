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
    socket.on('disconnect', () => {
        if (socket.id in socketUsernames) {
            delete socketUsernames[socket.id];
        }
    });

    socket.on('request-join-game', ({room, username}) => {
        socketUsernames[socket.id] = username;
        socket.join(room)

        const roomData = io.sockets.adapter.rooms.get(room);
        const inRoomCount = roomData.size
        let roomUsernames = [];
        for (const user of roomData) {
            roomUsernames.push(socketUsernames[user])
        }
        io.in(room).emit('all-players', { roomUsernames })
        io.in(room).emit('admin-message', `${inRoomCount} players now in ${room}!`)
    })

    socket.on('chat-message', (message) => {
        const username = socketUsernames[socket.id];
        const room = [...socket.rooms].filter(r => r != socket.id)[0];
        io.in(room).emit('new-chat-message', {username: username, message: message});
    })
})

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Express now departing from port ${port}!`))