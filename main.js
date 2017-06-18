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
});


app.post('/post-excel', (req, res) => {


});

app.post('/post-tmp', (req, res) => {
    let handleTmp = require('./controller/create-render');
    let tmp = '你好,{{ $1 }}！你本月的工资共{{ $5 + $4 }}';
    let render = handleTmp(tmp);
    for (let i = 1; i < excel.length; i++) {
        console.log(Date());
        console.log(typeof excel[i][4]);
        let content =  render.apply(excel[i]);
        console.log(content);
    }
});

let port = 9999;

app.listen(port, function () {
    console.log(`app listening on port ${port}`);
});