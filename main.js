let path = require('path');
let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let session = require('express-session');
let app = express();
let http = require('http').Server(app);
let io = require('socket.io')(http);

module.exports =  io;

app.set('views', './views');
app.set('view engine', 'pug');

// app.use(morgan('combined'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    secret: 'excel2email',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1800000 }
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.use('/static', express.static(path.join(__dirname, 'node_modules')));
app.use('/static', express.static(path.join(__dirname, 'static')));

let router = require('./routes/router');
app.use(router);

let port = 9999;

http.listen(port, function () {
    console.log(`app listening on port ${port}`);
});

io.on('connect', (socket) => {
    socket.emit('message', '邮件发送中');
});