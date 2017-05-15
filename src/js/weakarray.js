// @see weakmap
var WeakArray = (function () {
    function WeakArray() {
        this.keys = [];
        this.values = [];
    }
    WeakArray.prototype.get = function (key) {
        var index = this.keys.indexOf(key);
        return this.values[index];
    };
    WeakArray.prototype.set = function (key, value) {
        var index = this.keys.indexOf(key);
        if (index < 0) {
            this.keys.push(key);
            this.values.push(value);
        }
        else {
            this.values[index] = value;
        }
    };
    WeakArray.prototype.delete = function (key) {
        var index = this.keys.indexOf(key);
        if (index < 0) {
            return;
        }
        this.keys.splice(index, 1);
        this.values.splice(index, 1);
    };
    return WeakArray;
}());
