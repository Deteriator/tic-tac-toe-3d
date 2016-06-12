"use strict";

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

const getCurrentRoom = (rooms) => {
    var currentRoom = '';
    for (let key in rooms) {
        if (key.slice(0, 2) === "ID") {
            currentRoom = key;
        }
    }
    if(currentRoom === '') {
        currentRoom = "could not find room"
    }
    return currentRoom;
}

const getCurrentPlayers = (currentRoom, socket) => {
    var currentPlayers = [], currentClients;
    currentClients = io.sockets.adapter.rooms[currentRoom].sockets;
    for (let key in currentClients) {
        currentPlayers.push(key);
    }
    return currentPlayers;
}

const getOtherPlayer = (currentRoom, playerID, socket) => {
    var currentPlayers = [], currentClients, playerSocketID;
    playerSocketID = playerID;
    console.log('excluding ', playerSocketID)
    currentClients = io.sockets.adapter.rooms[currentRoom].sockets;
    for (let key in currentClients) {
        if(playerSocketID !== key) {
            currentPlayers.push(key);
        }
    }
    return currentPlayers[0];
}

const removeRoom = (rooms, roomID) => {
    var rooms = rooms;
    var roomIdIndex = rooms.indexOf(roomID);
    rooms.splice(roomIdIndex, 1);
    return rooms;
}

io.on('connection', (socket) => {

    console.log("socket connection established: " + socket.id);
    console.log("current open rooms are: ", currentRooms);
    console.log("this current socket is in: ", socket.rooms)

    socket.emit('gamelist:all', currentRooms);

    socket.on('game:play', (data) => {
        // only emit plays clients in the same room
        var currentRoom = getCurrentRoom(socket.rooms);
        io.to(currentRoom)
            .emit('game:play', data);
    });

    socket.on('connect:host', (gameID) => {
        console.log('connecting to ' + gameID);
        socket.join(gameID, () => {
            currentRooms.push(gameID);
            io.emit('gamelist:added', gameID);
        })
    });

    socket.on('connect:join', (gameID) => {
        socket.join(gameID, () => {
            var currentRoom = getCurrentRoom(socket.rooms);
            var joiningID = socket.id;
            var hostID = getOtherPlayer(currentRoom, joiningID, socket);
            socket.emit('player:host', hostID);
            io.emit('gamelist:removed', removeRoom(currentRooms, gameID));
            socket.to(currentRoom).emit('player:joined', joiningID);
        });
    });

    socket.on('disconnect:game', function(gameID) {
        socket.leave(gameID, () => {
            console.log('leaving');

        });
    })

    socket.on('disconnect', function () {
        console.log('disconnected');
        currentRooms.forEach((room) => {
            // possible bug when leaving a room the current socket is not a
            // part of.

            socket.leave(room);
        })
    });

});

http.listen(app.get('port'), () => {
    console.log('express started on ' + app.get('port'));
});
