    // Constructor
function Builds(Name, Status, ID, Start, Finish) {
    // always initialize all instance properties
    this.name = Name;
    this.status = Status; // default value
    this.id = ID;
    this.startdate = Start;
    this.finishdate = Finish;
}

Builds.prototype = {
    name: "",
    status: " ",
    id: " ",
    startdate: " ",
    finishdate: " "
};
    // class methods
Builds.prototype.showBuild = function () {

};
    // export the class
module.exports = Builds;