/**
 * Created by amaia.nazabal on 2/09/17.
 * Script pour la collection
 *
 */

var app = app || {};

(function () {
    'use strict';

    app.Model = Backbone.Model.extend({
        defaults: {
            title: '',
            url: ''
        }
    });

    app.Categorie = Backbone.Mode.extend({
        defaults: {
            categorie: ''
        }
    });
})();
