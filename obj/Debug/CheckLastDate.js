var async = {};
async.forEach = function (o, cb) {
    var counter = 0,
      keys = Object.keys(o),
      len = keys.length;
    var next = function () {
        if (counter < len) cb(o[keys[counter++]], next);
    };
    next();
};
function checkDate(buildId, buildDate, personArr) {

    var obj = [{ id: 'bt2', date: '15354615' }, { id: 'bt3', date: '45354353' }, { id: 'bt16', date: '453453' }, { id: 'bt4', date: '12' }, { id: 'bt5', date: '453453453' }];

    async.forEach(obj, function (val, next) {
        // do things
        setTimeout(next, 100);
    });

}