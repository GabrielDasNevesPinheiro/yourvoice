const express = require('express');
const ejs = require('ejs');
const dotenv = require('dotenv');
const app = express();
const path = require('path');
const { info } = require('console');
const server = require('http').createServer(app);
const io = require('socket.io')(server);
dotenv.config();
const port = process.env.PORT || 3000;

//configuração
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');

//rotas
app.use('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname+'/public' });
});

//socket codes
io.on('connection', (socket) => {
    console.log(`socket conectado: ${socket.id}`);

    socket.on('sendText', text => {
        socket.broadcast.emit('receiveMessage', text);
    });

    socket.on('invalidChannel', error => {
        socket.broadcast.emit('channelError', error);
    });
});

io.on('disconnect', (socket) => {
    console.log(`socket desconectado: ${socket.id}`);
});
//ouvindo a porta:
server.listen(port, () => {
    console.log('Server listening at port %d', port);
});
