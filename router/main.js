
var mysql = require('mysql');
var client = mysql.createConnection({
    user: "root",
    password: "1234",
    database: "mydb"
});


client.connect(function(err){
    if(err){
        throw err;
    }
    console.log("Connected!");
    
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
        res.render('input.html');
    });
    app.post('/input', function(req, res){
        //res.render('input.html');
    });

    //search
    app.get('/search', function(req, res){
        var body = req.query;
        var search_sql = "SELECT * FROM carinfo WHERE carid='"+body.carid+"'";
        client.query(search_sql, function(err, result){
            if(err){
                console.log("issue in querystring.");
            }else{
                let carinfo = result[0];
                if(carinfo){
                    res.render('search.html',{carInfo: carinfo});
                }else{//자료가 없는경우
                    res.render('nosearch.html',{carID: body.carid});
                }
            }
        });

    });

    //buy
    app.get('/buy', function(req, res){
        var list_sql = "SELECT * FROM carinfo";
        client.query(list_sql, function(err, result){
            if(err){
                console.log("issue in querystring.");
            }else{
                let carinfo = result;
                if(carinfo){
                    res.render('buy.html',{carList:carinfo, carimg: 'carimg/'+carinfo[0].carimg});
                }else{
                    res.render(`
                    <!doctype html>
                    <html>
                    <body>
                        <p>자동차 목록이 존재하지 않습니다.</p>
                    </body>
                    </html>
                `);
                }
            }
        });
    });
}
