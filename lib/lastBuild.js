var GetData = require( './Request' );
var async = require( 'async' );
var _ = require( 'lodash' );
var lastFailed = [];
var changes = [];
var changesUrl = [];

function LastFailed(call) {
    async.series([
            function(callback) {
                GetData("/httpAuth/app/rest/builds/?locator=status:failure", function(result) {
                    lastFailed = result['build'][0];
                    callback(null, lastFailed);
                });
            },
            function(callback) {
                GetData(lastFailed['href'], function(result) {
                    changes = result;
                    callback(null, result);
                });
            },
            function(callback) {
                GetData(changes.changes.href, function(result) {
                    changesUrl = result['change'];
                    callback(null, result);
                });
            },
            function(callback) { //moet nog gedaan worden kijken naar welke changes en de naam opzoeken
                async.mapSeries(changesUrl, getName, function(error, result) {
                    callback(null, result);
                });
            }
        ],
        function(err, results) {
            var persons = _.compact(_.uniq(results[3]), 'null');
            call(persons);
        });
}

module.exports = LastFailed;

function getName( url, names ) {
    if ( url != null ) {
        GetData( url['href'], function ( result ) {
            if ( result.files.file.length != 0 ) {
                if ( result['user'] ) {
                    names( null, result['user']['username'] );
                } else {
                    names( null, result["username"] );
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