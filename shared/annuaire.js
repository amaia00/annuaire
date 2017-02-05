/**
 * Cette méthode récupére la valeur de la chaîne
 *
 * @param val
 * @returns {string}
 */
var escapeHtml = function(val) {
    return val.replace(/[<>]/g, '');
};
/**
 * Initialise la collection de l'annuaire
 *
 * @constructor
 */
var Annuaire = function() {
    this.collection = {};
};

/**
 *
 * Cette méthode retourne l'url du site
 *
 * @param key le nom du site
 * @returns {*|string} l'url du site
 */
Annuaire.prototype.get = function(key) {
	return this.collection.key;
};

/**
 *
 * Cette méthode ajoute un nouveau item dans la collection
 *
 * @param key le nom du site
 * @param value l'url du site
 * @returns {boolean} retourne si l'objet a été ajouté dans la collection
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
 * Supprime l'item de la collection
 * 
 * @param key le nom du site
 */
Annuaire.prototype.remove = function(key) {
	delete this.collection[key];
};


module.exports = new Annuaire();