var http = require('http');
var async = require('async');
var person = require('./Person');
var GetData = require('./Request');
var buildStatus = require('./Builds');
var file = require('./FileIO');
var host = '83.219.69.27';
var auth = 'student:ichose1989';
var builds = "";
var buildResult = [];
var buildID = "";
var buildtypeid = [];
var buildstatus = [];
var change = [];
var changesUrl = [];
usersarray = new Object();
var fileio = new file();
function getPoints(buildId) {
    async.series([
            function (callback) {
                GetData("/httpAuth/app/rest/builds/id:" + buildId, function (result) {
                    builds = result;
                    callback(null, builds);
                });
            },
            function (callback) {
                change = [];
                changesUrl = builds['changes']['href'];
                GetData(builds['changes']['href'], function (result) {
                    for (var i = 0; i < result.length; i++) {
                        if (result[i] != null) {
                            change.push(result[i]['href']);
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
            /*var buildfile = [];
            for (var m = 0; m < results[2].length; m++) {
                    buildfile.push({buildid:results[2][m]['buildType']['id'], date: results[2][m]['finishDate'] });                    
                }
            fileio.writefile("Builds.txt",JSON.stringify(buildfile), null, 4);*/
            if (results[0].length != results[1].length) {
                console.log("something went whrong");
            } else {
                for (var i = 0; i < results[0].length; i++) {
                    var name = "";
                    var id = "";
                    var status = "";
                    var start = "";
                    var end = "";
                    for (var j = 0; j < results.length; j++) {
                        buildstatus[i] = new buildStatus();

                        if (j == 0) {
                            name = results[j][i]['name'];
                            id = results[j][i]['id'];
                        } else if (j == 1) {
                            status = results[j][i]['status'];
                            start = results[j][i]['startDate'];
                        } else if (j == 2) {
                            end = results[j][i]['finishDate'];

                        }
                    }
                    buildstatus[i].name = name;
                    buildstatus[i].id = id;
                    buildstatus[i].status = status;
                    buildstatus[i].startdate = start;
                    buildstatus[i].finishdate = end;
                }
            }
            for (var k = 0; k < buildstatus.length; k++) {
                if (!usersarray[results[4][k]] && results[4][k] != null) {
                    usersarray[results[4][k]] = new person(results[4][k]);
                }
                if (results[4][k] != null) {
                    var tempBuilds=fileio.readFile('Builds.txt');
                    var jsonBuilds = JSON.parse(tempBuilds);
                    var tempLast=fileio.readFile('lastbuilds.txt');
                    var jsonLast = JSON.parse(tempLast);
                    for (var n = 0; n < jsonLast.length; n++) {
                        for (var o = 0; o < jsonBuilds.length; o++) {
                            if (jsonLast[n]['buildid'] == jsonBuilds[o]['buildid']&&jsonLast[n]['date']!=jsonBuilds[o]['date']) {
                                console.log("true");
                            }
                        }
                        
                    }
                    if (usersarray[results[4][k]].lastdate != buildstatus[k]['finishdate']) {//need to check for several builds finish date's
                        if (buildstatus[k]['status'] == "SUCCESS") {
                            usersarray[results[4][k]].addPoints(2);
                            usersarray[results[4][k]].lastdate.push(buildstatus[k]['finishdate']);
                            usersarray[results[4][k]].build.push(buildstatus[k]['id']);
                        } else if (buildstatus[k]['status'] == "FAILURE" && results[4][k] != null) {
                            usersarray[results[4][k]].substractPoints(4);
                            usersarray[results[4][k]].lastdate.push(buildstatus[k]['finishdate']);
                            usersarray[results[4][k]].build.push(buildstatus[k]['id']);
                        }
                    }
                }
                
                
            }
            var text = [];
            for (var user in usersarray) {
                for (var l = 0; l < usersarray[user]['build'].length; l++) {
                    text.push({ user:user, buildid:usersarray[user]['build'][l], date:usersarray[user]['lastdate'][l] });
                    //var text = user + ' ' + usersarray[user]['build'][l] + ' ' + usersarray[user]['lastdate'][l];
                }
            }
            fileio.writefile("lastbuilds.txt",JSON.stringify(text), null, 4);
        });
    //setTimeout(getPoints, 5 * 1000);
}
module.exports  = getPoints;
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

