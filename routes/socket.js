const express = require('express');
const router = express.Router();
const io = require("socket.io")()

//then in your router you can access it like this
router.post('/getRides', function(req, res, next) {

    io.on('connection', (socket) => {
      console.log('a user connected');
      socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    });

    db.rides.find(function(err, docs) {
        res.json(docs);
    })
})

module.exports = router;