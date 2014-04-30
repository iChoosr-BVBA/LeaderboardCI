var GetData = require('./Request');
var async = require('async');
var gravatar = require('gravatar');
var usersUrl = [];
var users = [];
var email = [];
function getUserInfo(user) {
    async.series([
            function (callback) {
                GetData("/httpAuth/app/rest/users", function (result) {
                    for (var i = 0; i < result['user'].length; i++) {
                        usersUrl.push(result['user'][i]['href']);
                    }

                    callback(null, result['user']);
                });
            },
            function (callback) {
                async.mapSeries(usersUrl, getEmail, function (error, mail) {
                    email = mail;
                    callback(null, mail);
                });
            },
            function(callback) {
                async.mapSeries(email, getGravatar, function (error, gravartarUrl) {
                    callback(null, gravartarUrl);
            });
            }
    ],
// optional callback
        function (err, results) {
            if (results[0].length == results[1].length) {
                for (var i = 0; i < results[0].length; i++) {
                    users.push({ username: results[0][i]['username'], mail: results[1][i], img: results[2][i] });
                }
            }
            user(err, users);
        });

}
module.exports = getUserInfo;
function getEmail(url, mail) {
    if (url != null) {
        GetData(url, function (result) {
            mail(null, result['email']);
        });
    } else {
        mail(null, null);
    }
}
function getGravatar(mail, gravartarUrl) {
    if (mail != null || mail != "undefined") {
        var gravUrl =gravatar.url(mail, {s: '200'});
        gravartarUrl(null, gravUrl);

    } else {
        gravartarUrl(null, null);
    }
}
