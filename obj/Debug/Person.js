    // Constructor
function Person(Name) {
    // always initialize all instance properties
    this.name = Name;
    this.lastdate = [];
    this.build = [];
    this.builDateArr = [];
    this.gravUrl = "";
    this.status = "";
    this.streak = 0;
}
    // class methods
Person.prototype = {
    points: 0,
    build: [],
    streak: 0
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
Person.prototype.streakAdd = function () {
    this.streak += 1;
};
Person.prototype.streakReset = function () {
    this.streak = 0;
};
    // export the class
module.exports = Person;