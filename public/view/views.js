/**
 * Created by amaia.nazabal on 2/9/17.
 **/

var app = app || {};
(function ($) {
    'use strict';

    /**** to print ******/

    /**
     * La vue pour le login, logout et l'option d'effacement de tous les bookmarks
     */

    var reload = _.extend({}, Backbone.Events);

    /*var appImpression= Backbone.View.extend({
         el: $(".content-server"),

            events: {
                'click  #impression_serveur': 'impression',

            },
        impression: function () {
            if(app.ServerCollection.length===0) {
                $(".content-server").append("<div class='message'> Vous n'avez pas de sites à imprimer");
                $("#pairs-server").css("display","none");
                window.print();
            }
            else {

                $(".content-server .message").css('display','none');
                $("#pairs-server").css("display","block");
                window.print();
            }
        }


        }

    );
    var appImpression = new appImpression();*/

    app.HomeView = Backbone.View.extend({
        el: '.content-home',

        historyTemplate: _.template($('#home-history-template').html()),

        bookmarksTemplate : _.template($('#home-bookmarks-template').html()),

        userData: $('.user-data'),

        username: $('#username'),

        userLabel: $('#user-name-label'),

        logoutButton: $('.logout-btn'),

        lastMofication: $('#last_modification'),

        initialize: function () {
            this.show();

            if (this.activeSession()) {
                this.hideUserForm();
                this.render();
            } else {
                this.showUserForm();

            }
        },

        events: {
            'click .login-btn': 'login',
            'click .logout-btn': 'logout',
            'click .clean-btn': 'clean'
        },

        hide: function () {
            this.hideUserForm();
            this.$el.css('display', 'none');
        },

        show: function () {
            this.$el.css('display', 'block');
        },

        hideUserForm: function () {

            this.userData.css('display', 'none');
            this.logoutButton.css('display', 'block');

            if (sessionStorage.getItem('_cache_last_modification') != null ){
                this.lastMofication.css('display', 'block');
                this.lastMofication.html("Dernière modification: " +
                    sessionStorage.getItem('_cache_last_modification'));
            } else
                this.lastMofication.css('display', 'none');

            this.userLabel.html('Welcome ' + sessionStorage.getItem('user') + '!');
            this.userLabel.addClass("name");
        },

        showUserForm: function () {

            this.userData.css('display', 'block');
            this.logoutButton.css('display', 'none');
            this.userLabel.html('');
            $('#last_modification').css('display', 'none');
            this.userLabel.removeClass("name");
        },

        login: function () {
            sessionStorage.setItem('user', this.username.val());
            this.hideUserForm();
        },

        render: function () {

            var historySelector = $('.history');
            historySelector.empty();

            if (sessionStorage.getItem('_cache_last_five_changes') != null) {
                $('#activity_history').removeClass('hidden');

                var history = JSON.parse(sessionStorage.getItem('_cache_last_five_changes'));
                historySelector.append(this.historyTemplate({history: history}));
            }

            var bookmarkSelector = $('.bookmarks');
            bookmarkSelector.empty();

            if (sessionStorage.getItem('_cache_last_bookmark_client') != null) {
                $('#last_bookmarks').removeClass('hidden');
                var bookmark_client = JSON.parse(sessionStorage.getItem('_cache_last_bookmark_client')) || {};
                bookmark_client.cote = 'Client';

                bookmarkSelector.append(this.bookmarksTemplate({bookmarks: [bookmark_client]}));
            }

            if (sessionStorage.getItem('_cache_last_bookmark_server') != null) {
                $('#last_bookmarks').removeClass('hidden');
                var bookmark_server = JSON.parse(sessionStorage.getItem('_cache_last_bookmark_server')) || {};
                bookmark_server.cote = 'Serveur';

                bookmarkSelector.append(this.bookmarksTemplate({bookmarks: [bookmark_server]}));
            }


        },

        logout: function () {
            $('#activity_history').addClass('hidden');
            $('#last_bookmarks').addClass('hidden');

            this.showUserForm();

            sessionStorage.clear();
            this.render();
        },

        activeSession: function () {
            if (typeof (Storage) !== 'undefined') {
                return sessionStorage.getItem('user') != null;
            }
            return false;
        },

        clean: function () {
            localStorage.clear();
            app.ClientCollection.reset();

            _.each(_.clone(app.ServerCollection.models), function (model) {
                model.destroy();
            }, this);

            app.AddEvent.trigger('clean-all');
            reload.trigger('reload-tag-view');
        }
    });

    /**
     * La vue pour le formulaire du côté client, pour l'ajouter dans la collection
     * de bookmarks.
     */
    var FormClient = Backbone.View.extend({
        initialize: function (e) {
            this.title = $('#key-client');
            this.url = $('#value-client');
            this.tags = $('#tags-client');
            console.log(this.tags);
            this.render(e)
        },

        render: function () {
            if (this.title.val() !== '') {
                _.each(this.tags.val().split(','), function (tag) {
                    app.TagCollection.add(tag);
                }, this);

                var model = {
                    title: this.title.val(),
                    url: this.url.val(),
                    tags: this.tags.val()
                };
                //console.log( this.tags.val()+"tags")
                app.ClientCollection.add(model);
                //console.log(app.ClientCollection);
                /*app.ServerCollection.create(model,
                    {url: '/bookmarks/', method: 'POST', emulateJSON: true});

                app.AddEvent.trigger('server-add', model);*/

                app.AddEvent.trigger('client-add', model);

                if (app.DEBUG) {
                    console.debug("DEBUG: Site added client side.");
                }

            }

            $('#clientModal').modal('hide');
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

            //this.render();
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
            'click .remove-site': 'removeSite',
            'click  #impression_client': 'impression'
        },

        initialize: function () {
            this.listenTo(this.model, 'sync', this.render);
            this.show();
        },

        hide: function () {
            this.$el.css('display', 'none');
        },

        show: function () {
            this.$el.css('display', 'block');

            //console.log("ok i'll enter now !!! ");
            //app.ClientCollection.fetch();
            app.ServerCollection.fetch().done( function(){

                if(app.ClientCollection.length==0 && app.ServerCollection.length!=0){
                    for(var i= 0; i < app.ServerCollection.length; i++){
                        app.ClientCollection.add(app.ServerCollection.models[i]);
                    }
                    //app.ClientCollection = app.ServerCollection;
                    console.log("ok i've passed it !!! ");
                }else{
                    for(var i= 0; i < app.ServerCollection.length; i++){
                        //console.log(app.ClientCollection.findWhere({title: app.ServerCollection.models[i].title, url: app.ServerCollection.models[i].url}));
                        if(app.ClientCollection.findWhere({title: app.ServerCollection.models[i].title, url: app.ServerCollection.models[i].url})===undefined){
                            app.ClientCollection.add(app.ServerCollection.models[i]);
                        }
                    }
                }
                new ClientViewList({collection: app.ClientCollection});

            });
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
            app.AddEvent.trigger('client-remove', title);

            if (app.DEBUG) {
                console.debug("DEBUG: Site removed client side.");
            }

            this.show();
        },
        impression: function () {
            if(app.ClientCollection.length===0) {
                $(".content-client .message").css("display","block");
                $(".content-client .message").html(" Vous n'avez pas de sites à imprimer");
                $("#pairs-client").css("display","none");
                window.print();
            }
            else {

                $(".content-client .message").css('display','none');
                $("#pairs-client").css("display","block");
                window.print();
            }
        }
    });


    /**
     * La vue pour le formulaire du côté serveur, pour l'ajouter dans la collection
     * de bookmarks, et aussi l'ajoute dans le serveur à travers de create.
     */
    var FormServer = Backbone.View.extend({
        initialize: function (e) {
            $("#pairs-server").css('display','block');
            $(".message").css('display','none');
            if (app.DEBUG) {
                console.debug("DEBUG: Form server initialized.");
            }

            this.title = $('#key-server');
            this.url = $('#value-server');
            this.tags = $('#tags-server');
            this.render(e);
        },

        render: function () {
            if (this.title.val() !== '') {
                _.each(this.tags.val().split(','), function (tag) {
                    app.TagCollection.add(tag);
                }, this);

                var model = {
                    title: this.title.val(),
                    url: this.url.val(),
                    tags: this.tags.val()
                };
                app.ServerCollection.create(model,
                    {url: '/bookmarks/', method: 'POST', emulateJSON: true});

                app.AddEvent.trigger('server-add', model);
                app.ClientCollection.add(model);
                //console.log(app.ClientCollection);
                /*app.ServerCollection.create(model,
                 {url: '/bookmarks/', method: 'POST', emulateJSON: true});

                 app.AddEvent.trigger('server-add', model);*/

                app.AddEvent.trigger('client-add', model);
                if (app.DEBUG) {
                    console.debug("DEBUG: Site added server side.");
                }
            }

            $('#serverModal').modal('hide');

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
            if (app.DEBUG) {
                console.debug("DEBUG: Sites server collection initialized.");
            }

            _.bindAll(this, "render");
            app.ServerCollection.bind('sync remove', this.render);
            app.ServerCollection.fetch();
        },

        render: function () {
            if (app.DEBUG){
                console.debug("DEBUG: Render function for sites list.");
            }

            this.$el.empty();

            _.each(app.ServerCollection.models, function (model) {
                if (typeof (model.get('tags')) !== 'object')
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
            'click .remove-site': 'removeSite',
            'click  #impression_serveur': 'impression'
        },

        initialize: function () {
            if (app.DEBUG) {
                console.debug("DEBUG: Server view initialized.");
            }

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
            app.AddEvent.trigger('server-remove', title);

            if (app.DEBUG) {
                console.debug("DEBUG: Site removed server side.");
            }

        },

        hide: function () {
            this.$el.css('display', 'none');
        },

        show: function () {
            this.$el.css('display', 'block');
            new ServerViewList({collection: app.ServerCollection});
            //app.ClientView.render;
        },
        impression: function () {
            if(app.ServerCollection.length===0) {
                $(".content-server .message").css("display","block");
                $(".content-server .message").html(" Vous n'avez pas de sites à imprimer");
                $("#pairs-server").css("display","none");
                window.print();
            }
            else {

                $(".content-server .message").css('display','none');
                $("#pairs-server").css("display","block");
                window.print();
            }
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

            reload.bind('reload-tag-view', this.render, this);

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
            if (app.DEBUG) {
                console.debug("DEBUG: Tag list view initialized.");
            }

            this.$el.empty();
            _.each(app.TagCollection.models, function (model) {
                console.log(model.toJSON());
                if (model.toJSON() != '')
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
            'click .search-btn': 'listTag'
        },

        searchTag: function () {
            if (app.DEBUG) {
                console.debug("DEBUG: Tag form initialized.");
            }

            $('#myModal2').modal('hide');
            app.appRouter.navigate('#/tag/' + $('#tag-search').val(), {trigger: true});
        },

        listTag: function () {
            new TagList();
        }
    });

    app.TagForm = new TagForm();


}(jQuery));