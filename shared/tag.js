/**
 * Created by amaia.nazabal on 2/9/17.
 */


/**
 * Constructeur des categories
 * @constructor
 */
var Tag = function () {
    this.collection = {};
};

/**
 *
 * @returns {{}|*}
 */
Tag.prototype.getAll = function () {
    return this.collection;
};

/**
 *
 * @param data
 */
Tag.prototype.add = function (data) {
    if (!this.exists(data)) {
        this.collection.push(data);
    }
};

/**
 *
 * @param data
 * @returns {boolean}
 */
Tag.prototype.exists = function (data) {
    return typeof this.collection[data] != 'undefined';
};

/**
 *
 * @param data
 */
Tag.prototype.delete = function (data) {
    delete this.collection[data];
};


/**
 *
 */
try {
    module.exports = new Tag();
}catch (Exception){
    console.log("")
}