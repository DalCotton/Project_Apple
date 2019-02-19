
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

/** == ImageUpload npm Multer == */
//Multer Module(imgupload)
var multer = require('multer');

//imageUpload(multer, storage)
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        //console.log(file.fieldname);
        if(file.fieldname == 'carImageA'){
            cb(null, 'public/uploads/carimg');
        }else if(file.fieldname == 'carImageB'){
            cb(null, 'public/uploads/paperA');
        }else if(file.fieldname == 'carImageC'){
            cb(null, 'public/uploads/paperB');
        }else{
            cb(null, 'public/uploads/carimg/');//콜백함수(cb)를 통해 전송된 파일 저장 디렉토리 설정.
        }
    },
    filename: function(req, file, cb){
        cb(null, new Date().valueOf() + "_" + file.originalname);
    }
});
var upload = multer({storage: storage});
/*
const upload = multer({ dest: 'uploads/', limits: { fileSize: 5*1024*1024 } });//지정경로(dest), 크기(limits)(5MB)
app.post('/up', upload.single('img'), (req, res) => {//이미지파일'하나'받음
    console.log(req.file);//업로드이미지
});
*/
/** == ImageUpload npm Multer == */


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

    //userInput
    app.get('/input', function(req, res){
        res.render('input.html');
    });
    app.post('/input', upload.fields([{name: 'carImageA'},{name: 'carImageB'},{name: 'carImageC'}]), function(req, res){
        var body = req.body;
        //console.log(body.carColor);

        //imageUpload
        //res.send('Uploaded! : '+req.file);
        //filename
        //console.log(req.file.filename);
        let carImage = 'null';
        if(req.files){
            var carimgA = req.files['carImageA'];
                carimgA = carimgA[0].filename;
            var carimgB = req.files['carImageB'];
                carimgB = carimgB[0].filename;
            var carimgC = req.files['carImageC'];
                carimgC = carimgC[0].filename;
            carImage = carimgA+"|"+ carimgB+"|"+ carimgC;
            //console.log(req.files);
            //console.log(carImage);
            //return;

        }
        
        let carskinRepair = '"'+body.skinRepair+'"';
        let carmainRepair = '"'+body.mainRepair+'"';
        var values = [
            [body.carId, body.carNum, '', body.carName, body.carDistance,
            body.instrument, '', body.carMyear, body.chkDtFrom, body.chkDtTo,
            body.firstRegiDt, body.assurance, body.illegalchange, carImage, body.carColor,
            body.carSize, body.acciorflooding, carskinRepair, carmainRepair, body.Txtetc,
            body.carPrice, body.carConfirmDt, body.inspectorName, body.informerName, body.grantDt,
            body.buyerName, '0']
        ];
        var ins_sql = "INSERT INTO carinfo (carid, itemnm, brand, carname, cardistance, "+
                        "instrument_status, engine, carmyear, chkdatefrom, chkdateto,"+
                        "firstregidate, assurance, illegalchange, carimg, carcolor,"+
                        "carsize, acciorflooding, carskinRepair, carmainRepair, carremarks,"+
                        "carprice, carconfirmdate, inspector, informer, cargrantdate,"+
                        "buyer, carstar) VALUES ?";
        client.query(ins_sql, [values], function(err, result){
            if(err){
                console.log("issue in querystring.");
                throw err;
            }else{
                //alert("차량 등록 완료.");
                //res.render('input.html');
                res.redirect('/');
            }
        });
});

    //search
    app.get('/search', function(req, res){
        var body = req.query;
        var search_sql = "SELECT * "
                            +",date_format(chkdatefrom, '%Y-%m-%d') as chkfromdt "
                            +",date_format(chkdateto, '%Y-%m-%d') as chktodt "
                            +",date_format(firstregidate, '%Y년 %m월 %d일') as firstredt "
                            +",date_format(carconfirmdate, '%Y년 %m월 %d일') as confidt "
                            +",date_format(cargrantdate, '%Y년 %m월 %d일') as grantdt "
                            +" FROM carinfo WHERE carid='"+body.carid+"'";
        client.query(search_sql, function(err, result){
            if(err){
                console.log("issue in querystring.");
                throw err;
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
                throw err;
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
