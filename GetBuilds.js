var http = require('http');
var async = require('async');
var person = require('./Person');
var GetData = require('./Request');
var buildStatus = require('./Builds');
var file = require('./FileIO');
var userInfo = require('./getUsers');
var builds = "";
var buildID = "";
var buildstatus = [];
var change = [];
var usersarray = [];
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
            var tempfile= JSON.parse(fileio.readFile("temp/score.txt"));
            for (var i = 0; i < tempfile.length; i++) {
                usersarray[i]=new person(tempfile[i]['name']);
                usersarray[i].lastdate = tempfile[i]['lastdate'];
                usersarray[i].build = tempfile[i]['build'];
                usersarray[i].gravUrl = tempfile[i]['gravUrl'];
                usersarray[i].points = tempfile[i]['points'];
            }
            buildstatus[0] = new buildStatus(results[0]['buildType']['name'], results[0]['status'], results[0]['buildType']['id'], results[0]['startDate'], results[0]['finishDate']);

            for (var k = 0; k < buildstatus.length; k++) {
                if (!usersarray[k] && results[2] != null) {
                    //usersarray[k] = new person(results[2][0]);
                    usersarray.push(new person(results[2][0]));
                }
                if (results[0] != null && buildstatus[0]['id'] != 'bt15') {
                    if (buildstatus[k]['status'] == "SUCCESS") {
                        usersarray[k].addPoints(2);
                        usersarray[k].lastdate.push(buildstatus[k]['finishdate']);
                        usersarray[k].build.push(buildstatus[k]['id']);
                    } else if (buildstatus[k]['status'] == "FAILURE" && results[4][k] != null) {
                        usersarray[k].substractPoints(4);
                        usersarray[k].lastdate.push(buildstatus[k]['finishdate']);
                        usersarray[k].build.push(buildstatus[k]['id']);
                    }

                }


            }
            userInfo(function (er2, profiles) {
                for (var user = 0; user < usersarray.length; user++) {
                    for (var i = 0; i < profiles.length; i++) {
                        if (usersarray[user]['name'] == profiles[i]['username']) {
                            usersarray[user].gravUrl = profiles[i]['img'];
                        }
                    }
                }
                fileio.writeFile("temp/score.txt", JSON.stringify(usersarray));
                Person(err, usersarray);
            });


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

