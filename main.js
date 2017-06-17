let path = require('path');
let express = require('express');
let bodyParser = require('body-parser');
let app = express();

app.set('views', './views');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/static', express.static(path.join(__dirname, 'node_modules')));
app.use('/static', express.static(path.join(__dirname, 'static')));

let excel = require('./controller/read-excel');

app.get('/', (req, res) => {
    res.render('index', {title: 'salary', data: excel});

    let tmp = '你好,{{ $1 }}！你本月的工资共{{ $2 }}';
});


app.post('/post-excel', (req, res) => {
});

app.post('/post-tmp', (req, res) => {

});

let port = 9999;

app.listen(port, function () {
    console.log(`app listening on port ${port}`);
});