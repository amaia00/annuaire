/**
 * Created by amaia.nazabal on 2/09/17.
 * Script pour la collecion
 *
 */

var app = app || {};

(function () {
    'use strict';

    var Collection = Backbone.Collection.extend({
        model: app.Model,

        initialize: function () {
            this.reset();
        },

        comparator: 'title'
    });

    app.Collection = new Collection();
})();
