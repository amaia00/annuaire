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

        comparator: 'title'
    });

    app.ClientCollection = new Collection();
    app.ServerCollection = new Collection();
    app.ServerCollection.url = '/bookmarks/';

    app.TagCollection = Backbone.Collection.extend({
        model: app.Tag
    });


})();
