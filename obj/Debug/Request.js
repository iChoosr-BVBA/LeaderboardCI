﻿var http = require('http');
var config = require('config').Host;
var host = /*'83.219.69.27'*/config.host;
var auth = /*'student:ichose1989'*/config.auth;
var port = config.port;
/*var host = "127.0.0.1";
var auth = 'Senne:Simpel00';*/
function getData(path, callback) {
    var req = http.request({
        host: host, // here only the domain name
        auth: auth,
        port: port,//8111,
        path: path, // the rest of the url with parameters if needed
        method: 'GET', // do GET
        headers: {
            "Accept": "application/json"
        }
    }, function (res) {
        var body = "";
        res.on('data', function (chunk) {
            body += chunk;

        });

        res.on('end', function () {
            var jsonData = JSON.parse(body);
            callback(jsonData);
        });

    });

    req.end();
}
module.exports = getData;