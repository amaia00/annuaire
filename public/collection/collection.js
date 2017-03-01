/**
 * Created by amaia.nazabal on 2/09/17.
 *
 * Script pour les collections
 *
 */

var app = app || {};

(function () {
    'use strict';

    /**
     * La collection pour les bookmarks
     */
    var Collection = Backbone.Collection.extend({
        model: app.Model,
        comparator: 'title'
    });

    /**
     * Les instances pour les bookmarks de côté serveur et client
     */
    app.ClientCollection = new Collection();
    app.ServerCollection = new Collection();
    app.ServerCollection.url = '/bookmarks/';

    /**
     * La collections pour les tags
     */
    app.TagCollection = Backbone.Collection.extend({
        model: app.Tag
    });
})();
