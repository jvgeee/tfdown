var express = require('express');
var h5bp = require('h5bp');
var http = require('http');
var fs = require('fs');
var path = require('path');
var Step = require('step');

var app = express();

app.configure(function () {
    // settings
    app.set('port', process.env.PORT || 80);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'ejs');
});

app.configure(function () {
    // middleware
    app.use(express.static(__dirname + '/public'));
    
    app.use(express.favicon());
    app.use(express.logger('dev'));

    app.use(h5bp.ieEdgeChromeFrameHeader());
    app.use(h5bp.suppressWww(true));
    app.use(h5bp.protectDotfiles());
    app.use(h5bp.blockBackupFiles());
    app.use(h5bp.removePoweredBy());

    app.use(require('./lib/assets')(path.join(__dirname, 'assets/'))());
    app.use(express.query());
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.methodOverride());

    app.use(require('gzippo').compress());

    app.use(app.router);
    
});

app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// bootstrap our routes
var routePath = __dirname + '/routes/';
var routeFiles = fs.readdirSync(routePath);
routeFiles.forEach(function(file) {
    require(routePath + file)(app);
});

app.all('*', function (req, res) {
   res.status(404);
   res.render('errors/404'); 
});

http.createServer(app).listen(app.get('port'), function() {
    console.log("web server listening on port %d in %s mode", app.get('port'), app.settings.env);
});
