const express   = require('express');
const app       = express();
const http      = require('http').Server(app);
const io        = require('socket.io')(http);
const path      = require("path");

app.set('port', process.env.PORT || 3005);

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/app.html'));
});

app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

app.use((err, req, res, next) => {
    console.log(err);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

// Store all rooms here
const currentRooms = [];

io.on('connection', (socket) => {

    console.log("socket connection established: " + socket.id);
    console.log("current open rooms are: ", currentRooms);

    socket.emit('gamelist:all', currentRooms);

    socket.on('2d:click:id', (data) => {
        io.emit('game:play', data);
    });

    socket.on('connect:game', (gameID) => {
        console.log('connecting to ' + gameID);
        socket.join(gameID, () => {
            currentRooms.push(gameID);
            io.emit('gamelist:added', gameID);
        })
    });

    socket.on('disconnect:game', function(gameID) {
        socket.leave(gameID);
    })


});

http.listen(app.get('port'), () => {
    console.log('express started on ' + app.get('port'));
});
