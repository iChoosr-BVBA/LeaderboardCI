$(function() {
    $(".gridster ul").gridster({
        widget_margins: [10, 10],
        widget_base_dimensions: [75, 93]
    });
});
var socket = io.connect()
socket.on('message', function(msg) {
    var gridster = $(".gridster ul").gridster().data('gridster');
    gridster.disable();
    gridster.remove_all_widgets();
    var sortJSON = function(json) {
        var arr = [],
            obj = {};
        arr = _.map(_.sortBy(json, 'points'), _.values);
        _.map(arr, function(el) {
            return obj[el[0]] = el;
        });
        return obj;
    };
    var result = sortJSON(msg);
    for (var name in result) {
        if (msg[name]['status'] == 'Failed') {
            if (msg[name]['points'] < 0) {
                gridster.add_widget('<li class="new"><div class="playerlist"><div class="player"><div class="box"><div class="headshot"><img src=' + msg[name]['gravUrl'] + ' border="0" style="border: 1px solid black;"><img src="/img/snow.gif" style="position: absolute; top: 17px; left:44px; opacity:0.8;"></div><div class="details wide"><div class="det"><div class="name">' + msg[name]['name'] + '</div><div class="status">' + msg[name]['status'] + '</div></div><div class="badge font-effect-ice" >You&#8217;re cold</div></div></div><div class="box"><div class="points">' + msg[name]['points'] + '</div></div></div></div></li>', 2, 1, 4, 1);
            } else {
                gridster.add_widget('<li class="new"><div class="playerlist"><div class="player"><div class="box red"><div class="headshot"><img src=' + msg[name]['gravUrl'] + ' border="0" style="border: 1px solid black; "></div><div class="details wide"><div class="name">' + msg[name]['name'] + '</div><div class="status">' + msg[name]['status'] + '</div></div></div><div class="box red"><div class="points">' + msg[name]['points'] + '</div></div></div></div></li>', 2, 1, 4, 1);
            }
        } else {
            if (msg[name]['streak5'] == true) {
                gridster.add_widget('<li class="new"><div class="playerlist"><div class="player"><div class="box"><div class="headshot"><img src=' + msg[name]['gravUrl'] + ' border="0" style="border: 1px solid black;"><img src="/img/fire.gif" style="position: absolute; top: 17px; left:44px; opacity:0.5;"></div><div class="details wide"><div class="det"><div class="name">' + msg[name]['name'] + '</div><div class="status">' + msg[name]['status'] + '</div></div><div class="badge font-effect-fire-animation" >You&#8217;re on fire</div></div></div><div class="box"><div class="points">' + msg[name]['points'] + '</div></div></div></div></li>', 2, 1, 4, 1);
            } else {
                gridster.add_widget('<li class="new"><div class="playerlist"><div class="player"><div class="box"><div class="headshot"><img src=' + msg[name]['gravUrl'] + ' border="0" style="border: 1px solid black;"></div><div class="details wide"><div class="name">' + msg[name]['name'] + '</div><div class="status">' + msg[name]['status'] + '</div></div></div><div class="box"><div class="points">' + msg[name]['points'] + '</div></div></div></div></li>', 2, 1, 4, 1);
            }
        }
    }
})
socket.on('lastfailed', function(msg) {
    $('.fail').remove();
    for (var name in msg) {
        var mydiv = document.getElementById("failed");
        var homertag = document.createElement('img');
        var imgTag = document.createElement('img');
        imgTag.className = "fail";
        homertag.setAttribute('src', '/img/homer.png');
        homertag.setAttribute('style', 'position: absolute; left:0px');
        imgTag.setAttribute('src', msg[name]['gravUrl']);
        mydiv.appendChild(imgTag);
        mydiv.appendChild(homertag);
    }//<img src="/img/snow.gif" style="position: absolute; top: 17px; left:44px; opacity:0.8;">
});