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
    var TagCollection = Backbone.Collection.extend({
        model: app.Tag
    });

    app.TagCollection = new TagCollection();
    app.ServerCollection.bind('sync remove', function () {
        _.each(app.ServerCollection.models, function (model) {
            console.debug("DEBUG: Model collection", model);
            console.debug("DEBUG: Tags", model.get('tags'));

            try {
                _.forEach(model.get('tags').split(','), function (tag) {
                    console.debug("DEBUG: tag", tag);
                    app.TagCollection.add({tag: tag});
                });
            }catch (e){
                //ignore
            }
        }, this)
    });

})();
