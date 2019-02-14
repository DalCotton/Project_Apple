var express = require('express');
var app = express();

//Router Module(main.js) >> app
var router = require('./router/main') (app);

//html위치정의(server html rendering),EJS engine setting. 
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);


var server = app.listen(3000, function(){
    console.log("Express server has started on port 3000.");
});

//정적파일(css,js,image)
app.use(express.static('public'));
app.use('/users',express.static('public/carimg'));

