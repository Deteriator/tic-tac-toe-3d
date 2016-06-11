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

io.on('connection', (socket) => {
    console.log("socket connection established: " + socket.id);
    socket.on('2d:click:id', (data) => {
        console.log(data);
        io.emit('game:play', data);
    });
});

http.listen(app.get('port'), () => {
    console.log('express started on ' + app.get('port'));
});
