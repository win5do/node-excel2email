let path = require('path');
let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let session = require('express-session');
let app = express();

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

app.use('/static', express.static(path.join(__dirname, 'node_modules')));
app.use('/static', express.static(path.join(__dirname, 'static')));

let router = require('./routes/router');
app.use(router);

let port = 9999;

app.listen(port, function () {
    console.log(`app listening on port ${port}`);
});