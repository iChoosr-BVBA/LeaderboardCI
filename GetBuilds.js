var http = require('http');
var async = require('async');
var person = require('./Person');
var GetData = require('./Request');
var buildStatus = require('./Builds');
var file = require('./FileIO');
var userInfo = require('./getUsers');
var _ = require('lodash');
var builds = "";
var buildID = "";
var buildstatus = [];
var change = [];
var usersarray = {};
var fileio = new file();
function getPoints(buildId, Person) {
    async.series([
            function (callback) {
                GetData("/httpAuth/app/rest/builds/id:" + buildId, function (result) {
                    builds = result;
                    callback(null, builds);
                });
            },
            function (callback) {
                change = [];
                GetData(builds['changes']['href'], function (result) {
                    for (var i = 0; i < result['change'].length; i++) {
                        if (result['change'] != null) {
                            change.push(result['change'][i]['href']);
                        } else {
                            change.push(null);
                        }
                    }
                    callback(null, null);


                });
            },
            function (callback) {
                async.mapSeries(change, getName, function (error, names) {
                    callback(null, names);
                });
            }
    ],
// optional callback
        function (err, results) {
            try {
                var tempfile = JSON.parse(fileio.readFile("temp/score.txt"));
                for (var user in tempfile) {
                    usersarray[user] = new person(tempfile[user]['name']);
                    usersarray[user].lastdate = tempfile[user]['lastdate'];
                    usersarray[user].build = tempfile[user]['build'];
                    usersarray[user].gravUrl = tempfile[user]['gravUrl'];
                    if (tempfile[user]['points'] > 0) {
                        usersarray[user].addPoints(tempfile[user]['points']);
                    }
                        
                    else {
                        usersarray[user].substractPoints(tempfile[user]['points']);
                    }
                        
                }
            } catch (e) {
                console.log(e);
            }
            buildstatus[0] = new buildStatus(results[0]['buildType']['name'], results[0]['status'], results[0]['buildType']['id'], results[0]['startDate'], results[0]['finishDate']);
            var uniqpersons = _.uniq(results[2]);

            for (var k = 0; k < uniqpersons.length; k++) {
                if (uniqpersons[k] != "undefined" && uniqpersons[k] != null) {
                    if (!usersarray[uniqpersons[k]]) {
                        usersarray[uniqpersons[k]] = new person(uniqpersons[k]);
                    }
                }

                if (usersarray[uniqpersons[k]]) {
                    if (results[0] != null && buildstatus[0]['id'] != 'bt15') {
                        if (buildstatus[0]['status'] == "SUCCESS") {
                            usersarray[uniqpersons[k]].addPoints(2);
                            usersarray[uniqpersons[k]].lastdate.push(buildstatus[0]['finishdate']);
                            usersarray[uniqpersons[k]].build.push(buildstatus[0]['id']);
                        } else if (buildstatus[0]['status'] == "FAILURE" && buildstatus[0]['id'] != 'bt15') {
                            usersarray[uniqpersons[k]].substractPoints(4);
                            usersarray[uniqpersons[k]].lastdate.push(buildstatus[0]['finishdate']);
                            usersarray[uniqpersons[k]].build.push(buildstatus[0]['id']);
                        }
                    }
                }

            }



            /*userInfo(function (er2, profiles) {
                /*var user = Object.keys(usersarray);
                user.forEach(function (user) {
                    var items = Object.keys(usersarray[user]);
                    items.forEach(function (item) {
                        var value = usersarray[user][item];
                        console.log(user + ': ' + item + ' = ' + value);
                    });
                });#1#
                for (var user = 0; user < usersarray.length; user++) {
                    for (var i = 0; i < profiles.length; i++) {
                        if (usersarray[user]['name'] == profiles[i]['username']) {
                            usersarray[user].gravUrl = profiles[i]['img'];
                        }
                    }
                }
                
            });*/
            fileio.writeFile("temp/score.txt", JSON.stringify(usersarray));
                console.log(usersarray);
                Person(err, usersarray);

        });
    //setTimeout(getPoints, 5 * 1000);
    }
module.exports = getPoints;
function getChanges(url, changes) {
    GetData(url, function (result) {
        if (result['count'] != 0) {
            changes(null, result['change'][0]);
        } else {
            changes(null, null);
        }
    });
}

function getName(url, names) {
    if (url != null) {
        GetData(url, function (result) {
            names(null, result['username']);
        });
    } else {
        names(null, null);
    }
}
function getBuilds(url, buildinfo) {
    GetData(url, function (result) {
        buildinfo(null, result);
    });
}
function compare() {

}

