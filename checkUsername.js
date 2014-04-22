var GetData = require('./Request');
var async = require('async');

function findDouble(name) {
 
            if(name == "rakhmetovruslan"){
                return "ruslan";
                }
            if(name == "cybercaveman"){
                return "wouter";
                }
            if(name == "bobvanlooveren" || name == "bubbltrubl"){
                return "bob";
                }
            else{
                 return name;
                }
        
};
module.exports = findDouble;
