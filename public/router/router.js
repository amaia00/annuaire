/**
 * Created by amaia.nazabal on 2/9/17.
 */
var app = app || {};

(function ($) {
    'use strict';

    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'server',
            'server': 'server', //par défaut le côté serveur
            'client': 'client',
            'tag' : 'tag'
        },

        server: function () {
            this.loadView(new app.ServerView());
            console.debug("DEBUG: serverView loaded in the router");
            $('#client-view').parent().removeClass('active');
            $('#server-view').parent().addClass('active');
            $('#tag-view').parent().removeClass('active');
        },

        client: function () {
            this.loadView(new app.ClientView());
            $('#server-view').parent().removeClass('active');
            $('#client-view').parent().addClass('active');
            $('#tag-view').parent().removeClass('active');
        },

        loadView: function (view) {
            this.view && this.view.hide();
            this.view = view;
        },
        tag: function () {
            this.loadView(new app.TagView());
            $('#server-view').parent().removeClass('active');
            $('#client-view').parent().removeClass('active');
            $('#tag-view').parent().addClass('active');

        }
    });

    new AppRouter();

    /**
     * On active l'option pour la gestion de l'historial du navigateur
     */
    Backbone.history.start();

})(jQuery);