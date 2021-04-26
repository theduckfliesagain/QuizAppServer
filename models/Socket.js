const socketio = require("socket.io");

module.exports = (socket) => {
    console.log('a user connected');
    socket.emit('admin-message', 'Hi there, new friend!')
    socket.broadcast.emit('admin-message', `A new friend has arrived!`)
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
};