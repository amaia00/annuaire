/**
 * Created by amaia.nazabal on 2/9/17.
 */

var app = app || {};

(function ($) {
    'use strict';

    /**
     *
     */
    var FormClient = Backbone.View.extend({
        initialize: function (e) {
            this.render(e)
        },

        render: function () {

            app.Collection.add({
                title: this.$el.find('input[id="key-client"]').val(),
                url: this.$el.find('input[id="value-client"]').val(),
                tags: this.$el.find('input[id="tags-client"]').val()
            });

            $('#myModal1').modal('hide');

            this.clean();
        },

        clean: function () {
            this.$el.find('input[id="key-client"]').val('');
            this.$el.find('input[id="value-client"]').val('');
            this.$el.find('input[id="tags-client"]').tagsinput('removeAll');

        }
    });

    /**
     *
     */
    app.ClientView = Backbone.View.extend({
        el: '.content-client',

        template: 'client-template',

        events: {
            'click #form-client .add-site': 'addSite',
            'click .remove-site': 'removeSite'
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
            var view = new app.ClientViewList({collection: app.Collection});
        },

        addSite: function (e) {
            var site = new FormClient({el: $('#form-client')});
            this.show();

        },

        removeSite: function (ev) {
            var title = $(ev.currentTarget).attr('data-title');
            var url = $(ev.currentTarget).attr('data-url');

            var site = app.Collection.findWhere({title: title, url: url});
            app.Collection.remove(site);

            this.show();
        }
    });

    app.ClientViewList = Backbone.View.extend({
        type: 'ClientViewList',

        el: '#table-body-client',

        template: _.template($('#client-template').html()),

        tagName: 'tr',

        initialize: function () {
            _.bindAll(this, "render");
            this.listenTo(this.collection, 'add remove', this.render);
            this.render();
        },

        render: function () {
            this.$el.empty();

            _.each(app.Collection.models, function (model) {
                this.$el.append(this.template(model.toJSON()));
            }, this);
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

jQuery(document).ready(function () {
    $(window).load(function () {
        var pathname = window.location.href;
        var expr = "client";

        if (pathname.match(expr) != null) {
            $(".content-server").css("display", "none");

        }

    });
});