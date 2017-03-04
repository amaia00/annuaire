/**
 * Created by amaia.nazabal on 2/9/17.
 * TODO: try to remake the view generics
 **/

var app = app || {};

(function ($) {
    'use strict';

    /**
     * La vue pour le formulaire du côté client, pour l'ajouter dans la collection
     * de bookmarks.
     */
    var FormClient = Backbone.View.extend({
        initialize: function (e) {
            this.title = $('#key-client');
            this.url = $('#value-client');
            this.tags = $('#tags-client');
            this.render(e)
        },

        render: function () {
            if (this.title.val() !== '') {
                _.each(this.tags.val().split(','), function (tag) {
                    app.TagCollection.add(tag);
                }, this);

                app.ClientCollection.add({
                    title: this.title.val(),
                    url: this.url.val(),
                    tags: this.tags.val()
                });
            }

            $('#myModal1').modal('hide');
            this.reset();
        },

        reset: function () {
            this.title.val('');
            this.url.val('');
            this.tags.tagsinput('removeAll');

        }
    });

    /**
     * La vue pour lister tous les sites qui sont déjà dans la collection du côté
     * client.
     */
    var ClientViewList = Backbone.View.extend({
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
                this.$el.append(this.template(model.toJSON()));
            }, this);
        }
    });

    /**
     * La vue qui recupère les événements pour ajouter ou bien supprimer
     * certains sites de l'annuaire côté client.
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
            new ClientViewList({collection: app.ClientCollection});
        },

        addSite: function (e) {
            e.preventDefault();

            new FormClient({el: $('#form-client')});
            this.show();
        },

        removeSite: function (e) {
            e.preventDefault();

            var title = $(e.currentTarget).attr('data-title');
            var url = $(e.currentTarget).attr('data-url');

            var site = app.ClientCollection.findWhere({title: title, url: url});
            app.ClientCollection.remove(site);

            this.show();
        }
    });


    /**
     * La vue pour le formulaire du côté serveur, pour l'ajouter dans la collection
     * de bookmarks, et aussi l'ajoute dans le serveur à travers de create.
     */
    var FormServer = Backbone.View.extend({
        initialize: function (e) {
            this.title = $('#key-serveur');
            this.url = $('#value-serveur');
            this.tags = $('#tags-serveur');
            this.render(e);
        },

        render: function () {
            if (this.title.val() !== '') {
                _.each(this.tags.val().split(','), function (tag) {
                    app.TagCollection.add(tag);
                }, this);

                app.ServerCollection.create({
                    title: this.title.val(),
                    url: this.url.val(),
                    tags: this.tags.val()
                }, {url: '/bookmarks/', method: 'POST', emulateJSON: true});
            }

            $('#myModal').modal('hide');

            this.reset();
        },

        reset: function () {
            this.title.val('');
            this.url.val('');
            this.tags.tagsinput('removeAll');

        }
    });

    /**
     * La vue pour lister tous les sites qui sont déjà dans la collection du côté
     * serveur.
     */
    var ServerViewList = Backbone.View.extend({
        type: 'ServerViewList',

        el: '#table-body-server',

        template: _.template($('#server-template').html()),

        tagName: 'tr',

        initialize: function () {
            _.bindAll(this, "render");
            this.collection.bind('sync remove', this.render);
            app.ServerCollection.fetch();
        },

        render: function () {
            this.$el.empty();

            _.each(this.collection.models, function (model) {
                if (model.get('title') != '')
                    this.$el.append(this.template(model.toJSON()));
            }, this);
        }
    });

    /**
     * La vue qui recupère les événements pour ajouter ou bien supprimer
     * certains sites de l'annuaire côté serveur, cette vue fait aussi la synchronisation
     * avec le serveur en utilisant las fonctions de sync.
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

        addSite: function (e) {
            e.preventDefault();

            new FormServer({el: $('#form-server')});
            this.show();

        },

        removeSite: function (ev) {
            ev.preventDefault();

            var title = $(ev.currentTarget).attr('data-title');
            var url = $(ev.currentTarget).attr('data-url');

            app.ServerCollection.findWhere({title: title, url: url}).destroy();

        },

        hide: function () {
            this.$el.css('display', 'none');
        },

        show: function () {
            this.$el.css('display', 'block');
            new ServerViewList({collection: app.ServerCollection});
        }
    });


    /*Tag view*/

    app.ViewByTag = Backbone.View.extend({
        el: '.content-tags',

        template: _.template($('#tags-template').html()),

        table: $('#table-body-tags'),

        initialize: function (options) {
            var self = this;
            app.ServerCollection.fetch({success: function () {
                self.show(options.selectTag)
            }});
        },

        hide: function () {
            this.$el.css('display', 'none');
        },

        show: function (tag) {
            this.$el.css('display', 'block');
            this.render(tag);
        },

        render: function (tag) {
            var self = this;
            self.table.empty();

            tag = tag || '';

            console.debug("DEBUG: View param tag after instruction:", tag);
            console.debug(app.ServerCollection.models);

            app.ServerCollection.each(function (model) {

                if (model.get('tags').indexOf(tag) !== -1)
                    self.table.append(self.template(model.toJSON()));
            }, self);

            _.each(app.ClientCollection.models, function (model) {

                if (model.get('tags').indexOf(tag) !== -1)
                    self.table.append(self.template(model.toJSON()));
            }, this);

        }
    });

    /**
     *
     */
    var TagList = Backbone.View.extend({
        el: '#tag-search',

        template: _.template($('#tags-list').html()),

        initialize: function () {
            console.debug("DEBUG: tag list initialized.");
            this.$el.empty();
            _.each(app.TagCollection.models, function (model) {
                console.debug("DEBUG: Model tag list:", model);
                this.$el.append(this.template(model.toJSON()));
            }, this);
        }
    });


    /**
     *
     */
    var TagForm = Backbone.View.extend({
        el: '.content-tags',

        template: 'tag-template',

        events: {
            'click .search-button': 'searchTag',
            'click .search-tag': 'listTag'
        },

        searchTag: function () {
            console.debug("DEBUG: Search tag in");
            $('#myModal2').modal('hide');
            app.appRouter.navigate('#/tag/' + $('#tag-search').val(), {trigger: true});
        },

        listTag: function () {
            console.debug("DEBUG: Event catch!");
            new TagList();
        }
    });

    app.TagForm = new TagForm();


})(jQuery);