/**
 *
 * @param val
 * @returns {string|void|XML}
 */
var escapeHtml = function(val) {
    return val.replace(/[<>]/g, '');
};
/**
 *
 * @constructor
 */
var Annuaire = function() {
    this.collection = {};
};

/**
 *
 * @param key
 * @returns {*|string}
 */
Annuaire.prototype.get = function(key) {
	return this.collection.key;
};

/**
 *
 * @param key
 * @param value
 * @returns {boolean}
 */
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

/**
 *
 * @param key
 */
Annuaire.prototype.remove = function(key) {
	delete this.collection[key];
};