//test unicode compatibility
require.paths.push(__dirname + "/../../Common/node");

var http = require("http");
var fs = require("fs");
var lfs = require("lfs");
var querystring = require("querystring");
    express = require('express'),
    connect = require('connect'),
    sys = require('sys'),
    app = express.createServer(
                    connect.bodyParser(),
                    connect.cookieParser(),
                    connect.session({secret : "locker"}));


var stdin = process.openStdin();
var me;
var processInfo;
stdin.setEncoding('utf8');
stdin.on('data', function (chunk) {
    processInfo = JSON.parse(chunk);
    process.chdir(processInfo.workingDirectory);
    me = lfs.loadMeData();
    sys.debug(sys.inspect(me));
    app.listen(processInfo.port);
    var returnedInfo = {port: processInfo.port};
    console.log(JSON.stringify(returnedInfo));
});

app.get('/external', function red(req, res) {
    res.redirect("http://www.example.com");
});

app.get('/internal', function red(req, res) {
    res.redirect('http://localhost:' + processInfo.port + '/landing');
});

app.get('/landing',
function(req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/html'
    });
    res.end('landed!');
});