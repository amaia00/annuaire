/**
 * Created by amaia.nazabal on 1/16/17.
 */
'use strict';

var app = app || {};

var Interface = {

    /**
     * Récupére tous les sites de l'annuaire
     */
    getAll: function () {
        jQuery.ajax({
            url: 'bookmarks/',
            method: 'GET',
            async: 'false',
            statusCode: {
                500: function (error) {
                    jQuery(".error-section").empty().html('<div class="alert alert-danger" role="alert">' +
                        'Serveur error: ' + error + '</div>');

                    return false;
                }
            }
        }).done(function (data) {
            var list = JSON.parse(data);

            console.debug("DEBBUG: list: ",list);
            /*
            _.each(list, function (obj) {
                console.log(obj);
                app.ServerCollection.add({
                    title: obj.title,
                    url: obj.url,
                    tags: obj.tags.join(', ')
                });
            });*/

            app.ServerCollection.fetch({url: 'http://localhost:3000/bookmarks/'});
            console.debug("DEBUG: Done getAll call");

        }).fail(function (error) {
            jQuery(".error-section").empty().html('<div class="alert alert-danger" role="alert">' +
                'Serveur error: ' + error + '</div>');

            return false;
        });
    },

    /**
     * Crée un nouveau site dans l'annuaire
     *
     * @param key le nom du site
     * @param value l'url du site
     */
    bind: function (key, value, tags) {
        var params = {};
        params['url'] = value;
        params['nom'] = key;
        params['tag'] = tags;

        jQuery.ajax({
            url: 'bookmarks/',
            method: 'POST',
            data: params,
            statusCode: {
                500: function () {
                    jQuery(".error-section").empty().html('<div class="alert alert-danger" role="alert">' +
                        'Serveur error </div>');
                }
            }
        }).done(function () {
            Interface.getAll();
            jQuery("#key-serveur").val("").focus();
            jQuery("#value-serveur").val("");
        }).fail(function (error) {
            jQuery(".error-section").empty().html('<div class="alert alert-danger" role="alert">' +
                'Serveur error: ' + error + '</div>');
        });
    },

    /**
     *
     * Supprime le site du nom
     *
     * @param key le nom du site
     */
    delete: function (key) {
        jQuery.ajax({
            url: 'bookmarks/' + key,
            method: 'DELETE',
            statusCode: {
                500: function () {
                    jQuery(".error-section").empty().html('<div class="alert alert-danger" role="alert">' +
                        'Serveur error </div>');
                }
            }
        }).done(function () {
            Interface.getAll();
        }).fail(function (error) {
            jQuery(".error-section").empty().html('<div class="alert alert-danger" role="alert">' +
                'Serveur error: ' + error + ' </div>');
        });
    },

    /**
     *
     * Récupére un site selon le nom indiqué
     *
     * @param key le nom du site
     */
    get: function (key) {
        jQuery.ajax({
            url: 'bookmarks/' + key,
            method: 'GET',
            statusCode: {
                500: function () {
                    jQuery(".error-section").empty().html('<div class="alert alert-danger" role="alert">' +
                        'Serveur error </div>');
                }
            }
        }).done(function (data) {
            console.log("Server get", data);
        }).fail(function (error) {
            jQuery(".error-section").empty().html('<div class="alert alert-danger" role="alert">' +
                'Serveur error: ' + error + ' </div>');
        });
    }
};

jQuery(document).ready(function () {
    jQuery(window).load(function () {
        var pathname = window.location.href;
        var expr = "client";

        if (pathname.match(expr) != null) {
            jQuery(".content-server").css("display", "none");

        }

    });
});