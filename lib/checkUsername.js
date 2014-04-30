var GetData = require('./Request');
var async = require('async');
var Usernames = require( 'config' ).Usernames;
var _ = require( 'lodash' );

function findDouble(name) {
    if (Usernames[name]) {
        return Usernames[name];
    } else {
        return name;
    }
};
module.exports = findDouble;
