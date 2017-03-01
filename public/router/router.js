/**
 * Created by amaia.nazabal on 2/9/17.
 *
 * Script pour le routage du côte client.
 */
var app = app || {};

(function ($) {
    'use strict';

    /**
     * Le router pour la gestion des urls côté client
     */
    var AppRouter = Backbone.Router.extend({
        routes: {
            '': 'server',
            'server': 'server',
            'client': 'client',
            'tag': 'tag',
            'tag/:param': 'tag'
        },

        server: function () {
            this.loadView(new app.ServerView());

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

        tag: function (param) {

            if (typeof param !== 'undefined' && param != null)
                this.loadView(new app.ViewByTag({selectTag: param}));
            else
                this.loadView(new app.TagView());

            $('#server-view').parent().removeClass('active');
            $('#client-view').parent().removeClass('active');
            $('#tag-view').parent().addClass('active');
        },

        loadView: function (view) {
            this.view && this.view.hide();
            this.view = view;
        }
    });

    new AppRouter();

    /**
     * On active l'option pour la gestion de l'historial du navigateur
     */
    Backbone.history.start();

})(jQuery);