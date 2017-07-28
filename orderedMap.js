
function OrderedMap() {
    this.map = {};
    this._array = [];
}

OrderedMap.prototype.set = function(key, value) {
    // key already exists, replace value
    if (key in this.map) {
        this.map[key] = value;
    } else { // insert new key and value
        this._array.push(key);
        this.map[key] = value;
    }
};

OrderedMap.prototype.remove = function(key) {
    var index = this._array.indexOf(key);
    if (index == -1) {
        return;
    }
    this._array.splice(index, 1);
    delete this.map[key];
};

OrderedMap.prototype.get = function(key) {
    return this.map[key];
};

OrderedMap.prototype.next = function(key) {
    var index = this._array.indexOf(key);
    if (index == -1) {
        return undefined;
    }
    if (index == this._array.length - 1) {
        return undefined;
    }
    return this.map[this._array[index + 1]];
}

OrderedMap.prototype.isLast = function(key) {
    return this._array.indexOf(key) == this._array.length - 1
}

OrderedMap.prototype.previous = function(key) {
    var index = this._array.indexOf(key);
    if (index == -1) {
        return undefined;
    }
    if (index == 0) {
        return undefined;
    }
    return this.map[this._array[index - 1]];
}

OrderedMap.prototype.isFirst = function(key) {
    return this._array.indexOf(key) == 0
}

OrderedMap.prototype.first = function() {
    if (this._array.length < 1) {
        return undefined;
    }
    return this.map[this._array[0]];
}

OrderedMap.prototype.last = function() {
    if (this._array.length < 1) {
        return undefined;
    }
    return this.map[this._array[this._array.length - 1]];
}

OrderedMap.prototype.has = function(key) {
    return (key in this.map);
}

OrderedMap.prototype.forEach = function(f) {
    var key, value;
    for (var i = 0; i < this._array.length; i++) {
        key = this._array[i];
        value = this.map[key];
        f(key, value);
    }
};
