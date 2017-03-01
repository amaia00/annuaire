/**
 * Created by amaia.nazabal on 2/9/17.
 * TODO:
 * Try to remake the view generics
 **/

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

            app.ClientCollection.add({
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

        hide: function () {
            this.$el.css('display', 'none');
        },

        show: function () {
            this.$el.css('display', 'block');
            new app.ClientViewList({collection: app.ClientCollection});
        },

        addSite: function () {
            new FormClient({el: $('#form-client')});
            this.show();

        },

        removeSite: function (ev) {
            var title = $(ev.currentTarget).attr('data-title');
            var url = $(ev.currentTarget).attr('data-url');

            var site = app.ClientCollection.findWhere({title: title, url: url});
            app.ClientCollection.remove(site);

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

            _.each(this.collection.models, function (model) {
                console.debug("DEBUG Client", model);
                this.$el.append(this.template(model.toJSON()));
            }, this);
        }
    });


    /* Server side views' */

    var FormServer = Backbone.View.extend({
        initialize: function (e) {
            this.render(e)
        },

        render: function () {

            app.ServerCollection.create({
                title: this.$el.find('input[id="key-serveur"]').val(),
                url: this.$el.find('input[id="value-serveur"]').val(),
                tags: this.$el.find('input[id="tags-serveur"]').val()
            }, {url: '/bookmarks/', method: 'POST', emulateJSON: true});

            $('#myModal').modal('hide');
            $('#myModal').modal('hide');
            this.clean();
        },

        clean: function () {
            this.$el.find('input[id="key-serveur"]').val('');
            this.$el.find('input[id="value-serveur"]').val('');
            this.$el.find('input[id="tags-serveur"]').tagsinput('removeAll');

        }
    });
    /**
     *
     */
    app.ServerView = Backbone.View.extend({
        el: '.content-server',

        template: 'server-template',

        events: {
            'click .add-site': 'addSite',
            'click .remove-site': 'removeSite'
        },

        initialize: function () {
            this.show();
        },

        addSite: function () {
            new FormServer({el: $('#form-server')});
            this.show();

        },

        removeSite: function (ev) {
            console.debug("DEBUG: remove site");
            var title = $(ev.currentTarget).attr('data-title');
            var url = $(ev.currentTarget).attr('data-url');

            console.debug("DEBUG: ", title, url);
            app.ServerCollection.where({title: title, url: url})[0].destroy();

        },

        hide: function () {
            this.$el.css('display', 'none');
        },

        show: function () {
            this.$el.css('display', 'block');
            new app.ServerViewList({collection: app.ServerCollection});
        }
    });


    app.ServerViewList = Backbone.View.extend({
        type: 'ServerViewList',

        el: '#table-body-server',

        template: _.template($('#server-template').html()),

        tagName: 'tr',

        initialize: function () {
            _.bindAll(this, "render");
            this.listenTo(this.collection, 'all', this.render);

            app.ServerCollection.fetch();
        },

        render: function () {
            this.$el.empty();
            console.debug("DEBUG: Server list render.");
            _.each(this.collection.models, function (model) {
                this.$el.append(this.template(model.toJSON()));
            }, this);
        }
    });

    /**
     *
     */
    app.TagView = Backbone.View.extend({
        el: '.content-tag',

        template: 'tag-template',

        events: {
            'click #form-tag .search-tags': 'search-tag'
        },

        initialize: function () {
            this.show();
        },

        hide: function () {
            this.$el.css('display', 'none');
        },

        show: function () {
            this.$el.css('display', 'block');
            new app.ClientViewList({collection: app.ClientCollection});
        },


    });


})(jQuery);

jQuery(document).ready(function () {
    $(window).load(function () {
        var pathname = window.location.href;
        var client = "client";
        var tags ="tag";

        if (pathname.match(client) != null) {
            $(".content-server").css("display", "none");
            $(".tag-server").css("display", "none");

        }
        else if(pathname.match(tags) != null) {
            $(".content-server").css("display", "none");
            $(".client-server").css("display", "none");

        }

    });
});