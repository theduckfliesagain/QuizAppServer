const app = require('./server');
const http = require("http")
const socketio = require("socket.io");
const server = http.createServer(app);
const options = {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
};
const io = socketio(server, options);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});
const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Express now departing from port ${port}!`))