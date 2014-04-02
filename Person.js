    // Constructor
function Person(Name, status) {
    // always initialize all instance properties
    this.name = Name;
    this.lastdate = [];
    this.build = [];
    this.builDateArr = [];
    this.gravUrl = "";
    this.status = status;
}
    // class methods
Person.prototype = {
    points: 0,
    build: []
};
Person.prototype.addPoints = function (punt) {
    this.points += punt;
};
Person.prototype.substractPoints = function (punt) {
    this.points -= punt;
};
Person.prototype.organizeArray = function() {
    var object = {};
    while (this.build.length) {
        var key = this.build.pop();
        object[key] = this.lastdate.pop();
    }
    this.builDateArr.push( object);
};
Person.prototype.showPoints = function () {
    console.log("Person: " + this.name + " has " + this.points + " points");

};
    // export the class
module.exports = Person;