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
        initialize: function () {
            if (app.DEBUG) {
                console.debug("DEBUG: Initializing application... ");
            }
        },

        routes: {
            '': 'home',
            'server': 'server',
            'client': 'client',
            'tag': 'tag',
            'tag/:param': 'tag'
        },

        home: function () {
            if (app.DEBUG) {
                console.debug("DEBUG: Route to home view.");
            }

            //this.loadView(new app.ViewByTag({}));
            this.loadView(new app.HomeView());

            $('#accueil-view').parent().addClass('active');
            $('#client-view').parent().removeClass('active');
            $('#server-view').parent().removeClass('active');
            $('#tag-view').parent().removeClass('active');

            $('.user-info').css("display", "block");
            $(".content-client").css("display", "none");
            $(".content-server").css("display", "none");

        },

        server: function () {

            if (app.DEBUG) {
                console.debug("DEBUG: Route to server view.");
            }

            this.loadView(new app.ServerView());

            $('#accueil-view').parent().removeClass('active');
            $('#client-view').parent().removeClass('active');
            $('#server-view').parent().addClass('active');
            $('#tag-view').parent().removeClass('active');

            //$(".content-server").css("display", "block");
            $(".content-client").css("display", "none");
            $(".content-tags").css("display", "none");
        },

        client: function () {

            if (app.DEBUG) {
                console.debug("DEBUG: Route to client view.");
            }

            this.loadView(new app.ClientView());

            $('#accueil-view').parent().removeClass('active');
            $('#server-view').parent().removeClass('active');
            $('#client-view').parent().addClass('active');
            $('#tag-view').parent().removeClass('active');

            $(".content-server").css("display", "none");
            $(".content-tags").css("display", "none");
        },

        tag: function (param) {

            if (app.DEBUG) {
                console.debug("DEBUG: Route to tag view.", param);
            }

            if (typeof param !== 'undefined' && param != null)
                this.loadView(new app.ViewByTag({selectTag: param}));
            else
                this.loadView(new app.ViewByTag({}));

            $('#accueil-view').parent().removeClass('active');
            $('#server-view').parent().removeClass('active');
            $('#client-view').parent().removeClass('active');
            $('#tag-view').parent().addClass('active');

            $('.user-info').css("display", "none");
            $(".content-server").css("display", "none");
            $(".content-client").css("display", "none");
        },

        loadView: function (view) {
            this.view && this.view.hide();
            this.view = view;
        }
    });

    app.appRouter = new AppRouter();
    app.DEBUG = false;

    /**
     * On active l'option pour la gestion de l'historial du navigateur
     */
    Backbone.history.start();


    if (app.DEBUG) {
        console.debug("DEBUG: History app initialized.");
    }

})(jQuery);