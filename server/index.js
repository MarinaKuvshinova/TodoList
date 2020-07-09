const app = require('./app');

const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
require('./socket')(io);

server.listen(app.get('port'), () => {
    console.log('Server has been started...')
});