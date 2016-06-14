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

const getRooms = (socketRooms) => {
    var roomsAndClients = socketRooms, rooms = {};
    for (let key in roomsAndClients) {
        var first3char = key.slice(0,3);
        if (first3char === "ID-") {
            rooms[key] = roomsAndClients[key];
        }
    }
    return rooms;
}

const getOpenRooms = (rooms) => {
    var openRooms = [];
    for (let key in rooms) {
        var occupants = rooms[key].length;
        if (occupants < 2) {
            openRooms.push(key);
        }
    }
    return openRooms;
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

    socket.on('game:state', (data) => {
        console.log('game state of', socket.id , 'is', data);
        //broadcast the state to the other client connected in the same room
        var gameState = {}
            gameState[socket.id] = data;
        var currentRoom = getCurrentRoom(socket.rooms);
        socket.to(currentRoom)
            .emit('game:state', gameState);
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
            // console.log('connect:join - socket.rooms: ', socket.rooms);
            // console.log('connect:join - io.rooms: ', io.sockets.adapter.rooms)
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
    });

    socket.on('disconnect', function () {
        console.log('disconnected');
        var rooms = getRooms(io.sockets.adapter.rooms);
        var openRooms = getOpenRooms(rooms);
        openRooms.forEach((room) => {
            io.emit('gamelist:added', room)
            currentRooms.push(room);
        });
        console.log('rooms: ', rooms);
        console.log('openRooms: ', openRooms);
    });
});

http.listen(app.get('port'), () => {
    console.log('express started on ' + app.get('port'));
});
