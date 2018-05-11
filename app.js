// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
//
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
//
// var app = express();
//
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
//
// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });
//
// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};
//
//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });
//
// module.exports = app;
//------------------------------------------------------------------------------------------------
var express = require('express');
var multer = require('multer');
// var cors = require('cors');
var fs = require('fs');
var app = express();
var morgan = require('morgan');
var path = require('path');

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(morgan('short', {stream: accessLogStream}));
// var DIR = './uploads/';
//
// var upload = multer({dest: DIR});

var createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
};

var uploadFolder = './uploads/';

createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, file.fieldname + '-' + Date.now()+'.bin');
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })


app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://192.168.31.126:8100'); //之后这边主服务器设置个固定的外网IP或者域名
    res.header('Access-Control-Allow-Methods', 'POST');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.header('Access-Control-Allow-Credentials', true);
    if (req.method == 'OPTIONS') {
        res.sendStatus(200); /让options请求快速返回/
    }
    else {
        next();
    }
});


app.get('/api', function (req, res) {
    res.end('file catcher example');
});

//single 的参数一定要和post 中的name的值相同
app.post('/api', upload.single('file'), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    console.log("in this");//不知道为什么ajax的post时，console.log不起作用；怀疑和express的内部处理有关系（版本问题？）{因为我看网上写的demo没有问题}
    console.log(req.file);
    // console.log(req.body);
    res.end('file cpmp');
});
var PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log('Working on port ' + PORT);
});
