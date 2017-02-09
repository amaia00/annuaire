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
            'client': 'client'
        },

        server: function () {
            this.loadView(new app.ServerView());
            $('#client-view').parent().removeClass('active');
            $('#server-view').parent().addClass('active');
        },

        client: function () {
            this.loadView(new app.ClientView());
            $('#server-view').parent().removeClass('active');
            $('#client-view').parent().addClass('active');
        },

        loadView: function (view) {
            this.view && this.view.hide();
            this.view = view;
        }
    });

    var appRouter = new AppRouter();

    /**
     * On active l'option pour la gestion de l'historial du navigateur
     */
    Backbone.history.start();

})(jQuery);