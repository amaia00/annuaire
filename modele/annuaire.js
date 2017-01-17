
var escapeHtml = function(val) {
    return val.replace(/[<>]/g, '');
};

var Annuaire = function() {
    this.collection = {};
};

Annuaire.prototype.get = function(key) {
	return this.collection.key;
};

Annuaire.prototype.bind = function(key, value) {
	try {  
		key = escapeHtml(key);
		value = escapeHtml(value);
		this.collection[key] = value;
		return true;
	} catch(e) {
		return false;
	}
};

Annuaire.prototype.remove = function(key) {
	delete this.collection[key];
};