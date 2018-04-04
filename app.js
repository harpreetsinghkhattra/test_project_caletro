import express from 'express';
import path from 'path';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressSession from 'express-session';
import SocketIO from 'socket.io';
var sessionStore = require('connect-mongo')(expressSession);
import task  from './routes/tasks';
import index from './routes/index';

var app = express();
// let io = SocketIO(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({
    resave: false,
    saveUninitialized: true,
    secret: 'sdlfjljrowuroweu',
    store: new sessionStore({
        url: 'mongodb://127.0.0.1/lawyerup',
    }),
    cookie: { secure: false }
}));



/**
 * --------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------
 * Socekt implementation start
 * --------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------
 */
var clients = [];
// io.sockets.on('connection', function (socket) {

    /**
     * On user connection
     */
    // socket.on('user connection', (data) => {
    //     socket.id = data.chatSenderUser;
    //     clients.push(socket.id);
    //     clients = Array.from(new Set(clients));
    //     console.log(clients);
    //     io.emit('chat users update', { connectedUsers: clients });
    // });
    // socket.on('get message', (data) => {
    //     Operations.getAllMessages(data, (status, response) => {
    //         switch (status) {
    //             case 'success':
    //                 response.sort((a, b) => {
    //                     return a.time > b.time;
    //                 });

    //                 io.emit('chat message', response);
    //                 break;
    //             case 'err':
    //                 break;
    //             default:
    //         }
    //     });
    // });
// })

/**
 * --------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------
 * Socket End
 * --------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------
 * --------------------------------------------------------------------------------------------
 */


// Allow cross origin resource sharing (CORS) within our application
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api', task);
app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
