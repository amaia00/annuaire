/**
 * Created by amaia.nazabal on 2/9/17.
 */

var app = app || {};

(function ($) {
    'use strict';

    /**
     *
     */
    app.ClientView = Backbone.View.extend({
        el: '.content-client',

        template: 'client-template',

        events: {
            'click .add-site': 'addSite'
        },

        initialize: function () {
            this.show();
        },

        execute: function () {
            this.$el.html(this.html);
        },

        hide: function () {
            this.$el.css('display', 'none');
        },

        show: function () {
            this.$el.css('display', 'block');
        },

        addSite: function () {
            console.log("add collection")
        }
    });

    /**
     *
     */
    app.ServerView = Backbone.View.extend({
        el: '.content-server',
        //tagName: 'tr',
        template: 'server-template',

        initialize: function () {
            this.show();
        },

        hide: function () {
            this.$el.css('display', 'none');
        },

        show: function () {
            this.$el.css('display', 'block');
        }
    });

})(jQuery);