import { createServer } from 'http';
import SocketIO from 'socket.io';

const server = createServer();

const io = new SocketIO(server, {
    serveClient: false,
    handlePreflightRequest: (req, res) => {
        const headers = {
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Allow-Origin": req.headers.origin,
            "Access-Control-Allow-Credentials": true
        };
        res.writeHead(200, headers);
        res.end();
    }
})

server.listen(process.env.PORT || 3000, () => {
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
    socket.on('send-message', (payload, cb) => {
        setTimeout(() => {
            cb();
            io.emit('receive-message', payload)
        }, 500);
    });

    socket.on('typing', (payload, cb) => {
        cb();
        io.emit('typing', payload)
    });
})