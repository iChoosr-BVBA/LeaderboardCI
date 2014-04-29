var express = require( "express" );
var app = express();
var http = require( 'http' );
var server = http.createServer( app );
var io = require( 'socket.io' ).listen( server );
var points = require( './GetBuilds' );
var file = require( './FileIO' );
var redis = require('redis-url').connect(process.env.REDISTOGO_URL);
var score = [];
var profiles = [];
var fileio = new file();
app.configure( function () {
    app.use( "/css", express.static( __dirname + '/css' ) );
    app.use( "/js", express.static( __dirname + '/js' ) );
    app.use( "/img", express.static( __dirname + '/img' ) );
    app.set( 'views', __dirname + '/views' );
    app.set( 'view engine', 'jade' );

    app.use( express.logger() );
    app.use( express.bodyParser() );
});

io.configure( function () {
    io.set( "transports", ["xhr-polling"] );
    io.set( "polling duration", 10 );
});

app.get( '/', function ( req, res ) {
    res.render( 'index' );
});

app.post( '/', function ( req, res ) {
    //POST data to any listeners
    console.log( req['body']['build']['buildId'] );
    try {
        points(req['body']['build']['buildId'], function ( err, profile ) {
            profiles = profile;
            try {
                redis.get("failed", function(er, result) {
                    if (result) {
                        io.sockets.emit('lastfailed', JSON.parse(result));
                    }
                });
                redis.get( "obj", function ( er, data ) {
                    if (data) {
                        score = JSON.parse(data);
                        io.sockets.in('callbackroom').emit('message', score);
                        io.sockets.emit('test', 'hallo');
                        console.log(score);
                    }
                });
                //score = JSON.parse( fileio.readFile( "temp/score.txt" ) );
            } catch ( d ) {
                console.log( "score.txt doesn't exist" );
            }
            
        });
    } catch ( e ) {
        console.log( e );
    }

    //points(req['body']['build']['buildInternalTypeId']);
    res.send( "ok" );
});

var port = process.env.PORT || 8000;
server.listen( port, function () {
    console.log( "Listening on " + port );
});



//Socket events
io.on( 'connection', function ( socket ) {
    socket.join( 'callbackroom' );
    try {
        redis.get("failed", function(er, result) {
                    if (result) {
                        io.sockets.emit('lastfailed', JSON.parse(result));
                    }
                });
        redis.get( "obj", function ( er, data ) {
            if (data) {
                score = JSON.parse(data);
                if (score) {
                    io.sockets.in('callbackroom').emit('message', score);
                    io.sockets.emit('test', 'hallo');
                }
            }
        });

        //score = JSON.parse( fileio.readFile( "temp/score.txt" ) );
    } catch ( e ) {
        console.log( "score.txt doesn't exist" );
    }
    

});
