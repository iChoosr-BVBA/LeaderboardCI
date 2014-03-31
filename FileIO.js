var fs = require('fs');
function file() {
    
}

file.prototype.appendfile = function(path, text) {
    fs.appendFileSync(path, text );

};
file.prototype.writefile = function(path, text) {
    fs.writeFileSync(path, text );

};
file.prototype.readFile = function(path) {
    var contents = fs.readFileSync(path).toString();
    return contents;

};
file.prototype.eraseContent = function(path) {
    fs.writeFile(path, '', function(err) {
        if (err) throw err;
    });
};
module.exports = file;