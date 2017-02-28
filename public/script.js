/**
 * Created by amaia.nazabal on 1/16/17.
 */
'use strict';

var Interface = {

    /**
     * Récupére tous les sites de l'annuaire
     */
    getAll: function () {
        jQuery.ajax({
            url: '/all',
            method: 'GET',
            statusCode: {
                500: function (error) {
                    jQuery(".error-section").empty().html('<div class="alert alert-danger" role="alert">' +
                        'Serveur error: ' + error + '</div>');
                }
            }
        }).done(function (data) {
            var list = JSON.parse(data);

            jQuery('#pairs-serveur > tbody').empty();
            list.forEach(function (key) {

                jQuery("#pairs-serveur > tbody").append('<tr><td>' + key.nom + '</td><td>' + key.url.value + ' </td>' +
                    '<td>' + key.url.tags.collection.join(', ') + '</td><td class="delete_btn"> ' +
                    '<button type="button" class="btn btn-danger btn-sm remove-serveur" ' +
                    'onclick="removeURL(\'' + key.nom + '\')"> <icon class="glyphicon glyphicon-remove">' +
                    '</icon> supprimer</button></td></tr>');

                var height_body_site = jQuery(".body_site .container").height();
                jQuery(".body_site").css("height", height_body_site + "px");

            });

            jQuery("#key-serveur").focus();
            jQuery('#myModal').modal('hide');

        }).fail(function (error) {
            jQuery(".error-section").empty().html('<div class="alert alert-danger" role="alert">' +
                'Serveur error: ' + error + '</div>');
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
            url: '/',
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
            url: '/' + key,
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
            url: '/get/' + key,
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