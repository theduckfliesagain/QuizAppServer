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
        if (socket.id in socketUsernames) {
            delete socketUsernames[socket.id.values().next().value];
        }
        console.log('user disconnected');
    });

    socket.on('request-join-game', ({room, username}) => {
        socketUsernames[socket.id] = username;
        socket.join(room)
        socket.broadcast.to(room).emit('add-user', { username })

        const roomData = io.sockets.adapter.rooms.get(room);
        const inRoomCount = roomData.size
        let roomUsernames = [];
        for (const user of roomData) {
            roomUsernames.push(socketUsernames[user])
        }
        socket.to(room).emit('all-payers', { roomUsernames })
        io.in(room).emit('admin-message', `${inRoomCount} players now in ${room}!`)
    })
})

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Express now departing from port ${port}!`))