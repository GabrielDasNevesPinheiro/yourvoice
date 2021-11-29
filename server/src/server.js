const express = require('express');
const ejs = require('ejs');
const dotenv = require('dotenv');
const app = express();
const path = require('path');
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
app.use('/', (req, res) => {// na rota padrão
    res.sendFile('index.html', { root: __dirname+'/public' }); // html que será enviado na rota
});

//socket
io.on('connection', (socket) => { // quando alguém conectar
    console.log(`socket conectado: ${socket.id}`); // mostrando id do socket.

    socket.on('sendText', text => { // quando um pacote for enviado de alguma conexão
        socket.broadcast.emit('receiveMessage', text); // emita o mesmo para todos os clientes conectados
    });

    socket.on('invalidChannel', error => { // Tratando um possível erro de Canal inválido enviado pelo Bot
        socket.broadcast.emit('channelError', error); // Enviando esse erro, que será tratado pelo front-end
    });
});

io.on('disconnect', (socket) => {
    console.log(`socket desconectado: ${socket.id}`);
});

//ouvindo a porta:
server.listen(port, () => {
    console.log('Server listening at port %d', port);
});
