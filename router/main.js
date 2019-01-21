
var mysql = require('mysql');
var client = mysql.createConnection({
    user: "root",
    password: "1234",
    database: "mydb"
});



module.exports = function(app){
    
    //POST Parameters
    var bodyParser = require('body-parser');
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());

    //session
    var expressSession = require('express-session');
    app.use(expressSession({
        secret: 'my key',
        resave: true,
        saveUninitialized: true
    }));
    

    /* WEB URI */
    //index
    app.get('/', function(req, res){
        if(req.session.user){
            //
            res.render('index.html');
        }else{
            res.render('index.html');
        }
    });
    app.post('/', function(req, res, next){
        //
    });

    //userInput(스마트컨트랙트)
    app.get('/input', function(req, res){
        //if(req.session.user){
            //
            res.render('input.html');
        //}else{
        //    console.log('need login!');
        //    res.render('index.html');
        //}
    });

    //search
    app.get('/search', function(req, res){
        //if(req.session.user){
            //
            res.render('search.html');
        //}else{
        //    console.log('need login!');
        //    res.render('index.html');
        //}
    });
}
