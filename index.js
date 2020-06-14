import { createServer } from 'http';
import SocketIO from 'socket.io';

const server = createServer();

const io = new SocketIO(server, {
    serveClient: false,
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": "http://192.168.0.36:8080",
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
})

server.listen(3000, () => {
    console.log('listening on *:3000');
});

io.use((socket, next) => {
    let clientId = socket.handshake.headers['authorization'];
    if (clientId === 'abcd') {
        return next();
    }
    return next(new Error('authentication error'));
});

io.on('connection', (socket) => {
    // console.log('connection')
    socket.on('send-message', (payload) => {
        setTimeout(() => {
            io.emit('receive-message', payload)
        }, 2000);
    });
})