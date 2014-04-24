var http = require( 'http' );
var async = require( 'async' );
var person = require( './Person' );
var GetData = require( './Request' );
var buildStatus = require( './Builds' );
var file = require( './FileIO' );
var userInfo = require( './getUsers' );
var _ = require( 'lodash' );
var checkdouble = require( './checkUsername' );
var redis = require( 'redis-url' ).connect( process.env.REDISTOGO_URL );
var excludedBuilds = require( 'config' ).ExcludeBuilds;
var builds = "";
var buildID = "";
var buildstatus = [];
var change = [];
var usersarray = {};
var fileio = new file();
function getPoints( buildId, Person ) {
    async.series( [
        function ( callback ) {
            GetData( "/httpAuth/app/rest/builds/id:" + buildId, function ( result ) {
                builds = result;
                callback( null, builds );
            });
        },
        function ( callback ) {
            change = [];
            GetData( builds['changes']['href'], function ( result ) {
                for ( var i = 0; i < result['change'].length; i++ ) {
                    if ( result['change'] != null ) {
                        change.push( result['change'][i]['href'] );
                    } else {
                        change.push( null );
                    }
                }
                callback( null, null );


            });
        },
        function ( callback ) {
            async.mapSeries( change, getName, function ( error, names ) {
                callback( null, names );
            });
        }
    ],
        function ( err, results ) {
            try {

                redis.get( "obj", function ( er, data ) {
                    if ( data ) {
                        var tempfile = JSON.parse( data );
                        for ( var user in tempfile ) {
                            usersarray[user] = new person( tempfile[user]['name'] );
                            usersarray[user].lastdate = tempfile[user]['lastdate'];
                            usersarray[user].build = tempfile[user]['build'];
                            usersarray[user].gravUrl = tempfile[user]['gravUrl'];
                            usersarray[user].status = tempfile[user]['status'];
                            usersarray[user].streak = tempfile[user]['streak'];
                            usersarray[user].points = tempfile[user]['points'];

                        }

                        buildstatus[0] = new buildStatus( results[0]['buildType']['name'], results[0]['status'], results[0]['buildType']['id'], results[0]['startDate'], results[0]['finishDate'] );
                        var uniqpersons = _.uniq( results[2] );

                        for ( var k = 0; k < uniqpersons.length; k++ ) {
                            if ( uniqpersons[k] != "undefined" && uniqpersons[k] != null ) {
                                var userName = checkdouble( uniqpersons[k] );
                                if ( !usersarray[uniqpersons[k]] ) {

                                    usersarray[userName] = new person( userName );
                                }
                            }

                            if ( usersarray[userName] ) {
                                if ( results[0] != null && !_.contains( excludedBuilds, buildstatus[0]['id'] ) ) {
                                    if ( buildstatus[0]['status'] == "SUCCESS" ) {
                                        usersarray[userName].addPoints( 1 );
                                        usersarray[userName].lastdate.push( buildstatus[0]['finishdate'] );
                                        usersarray[userName].build.push( buildstatus[0]['id'] );
                                        if ( usersarray[userName].status && usersarray[userName].status == "Success" ) {
                                            if ( usersarray[userName].streak < 5 ) {
                                                usersarray[userName].streakAdd();
                                            }
                                            if ( usersarray[userName].streak >= 5 ) {
                                                usersarray[userName].streakReset();
                                                usersarray[userName].addPoints( 4 );
                                            }
                                        }
                                        usersarray[userName].status = "Success";
                                    } else if ( buildstatus[0]['status'] == "FAILURE" && !_.contains( excludedBuilds, buildstatus[0]['id'] ) ) {
                                        usersarray[userName].substractPoints( 4 );
                                        usersarray[userName].lastdate.push( buildstatus[0]['finishdate'] );
                                        usersarray[userName].build.push( buildstatus[0]['id'] );
                                        usersarray[userName].status = "Failed";
                                        usersarray[userName].streakReset();
                                    }
                                }
                            }

                        }


                        userInfo( function ( er2, profiles ) {
                            for ( var user in usersarray ) {
                                for ( var i = 0; i < profiles.length; i++ ) {
                                    if ( usersarray[user]['name'] == profiles[i]['username'] ) {
                                        usersarray[user].gravUrl = profiles[i]['img'];
                                    }
                                }
                            }
                            redis.set( "obj", JSON.stringify( usersarray ) );
                            fileio.writeFile( "temp/score.txt", JSON.stringify( usersarray ) );
                            console.log( usersarray );
                            Person( err, usersarray );
                        });
                    }
                });

            } catch ( e ) {
                console.log( e );
            }
        });
}
module.exports = getPoints;
function getChanges( url, changes ) {
    GetData( url, function ( result ) {
        if ( result['count'] != 0 ) {
            changes( null, result['change'][0] );
        } else {
            changes( null, null );
        }
    });
}

function getName( url, names ) {
    if ( url != null ) {
        GetData( url, function ( result ) {
            if ( result.files.file.length != 0 ) {
                if (result['user']) {
                    names(null, result['user']['username']);
                } else {
                    names(null, result["username"]);
                }
            }
            else {
                names( null, null );
            }
        });
    } else {
        names( null, null );
    }
}
function getBuilds( url, buildinfo ) {
    GetData( url, function ( result ) {
        buildinfo( null, result );
    });
}


