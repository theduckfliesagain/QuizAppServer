const app = require('./server');
const http = require("http")
const server = http.createServer(app);
const socketio = require("socket.io");
const connectionFunctions =  require('./models/Socket');
const options = {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
};
const io = socketio(server, options);

io.on('connection', connectionFunctions)

const port = process.env.PORT || 3000;

server.listen(port, () => console.log(`Express now departing from port ${port}!`))