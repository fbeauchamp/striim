/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'mustache',
        'text!templates/menu.en.tpl'
    ],

    function ($, Backbone, Mustache, template) {
        'use strict';

        var MenuItemView = Backbone.View.extend({
            tagName: 'li',
            className:'new',
            activate: function () {
                this.$el.addClass('active');
                return this;
            },
            deactivate: function () {
                this.$el.removeClass('active');
                return this;
            },
            render: function () {
                var self = this;
                this.$el.html(
                    Mustache.render(
                        '<a href="#doc/{{link}}" >{{name}}</a>',
                        {
                        name: self.model.get('name'),
                        link: self.model.get('id')
                    }
                    )
                );
                setTimeout(function(){
                    self.$el.removeClass('new');
                },1000);
                return this;
            }
        });


        return  Backbone.View.extend({
            initialize: function (opts) {
                var self = this;
                this.room = opts.room;

                this._subviews = [];
                this._itemContainer = null;
                this._activeView = null;

                this.collection.each(function (model) {
                    var id = model.get('id');
                    self._subviews[id] = new MenuItemView({model: model});
                });
                this.collection.on('add', function (model) {
                    var id = model.get('id');
                    self._subviews[id] = new MenuItemView({model: model});
                    if (self._itemContainer) {
                        self._subviews[id].render();
                        self._subviews[id].$el.appendTo(self._itemContainer);
                        self._itemContainer.append('<li class="divider"></li>');
                    }
                });
                this.collection.on('remove', function (model) {
                    var id = model.get('id');
                    if (self._subviews[id]) {
                        self._subviews[id].remove();
                        delete self._subviews[id];
                    }
                });
            },
            activate: function (id) {
                if (this._subviews[id]) {
                    if (this._activeView) {
                        this._activeView.deactivate();
                    }
                    this._activeView = this._subviews[id].activate();
                }
                return this;
            },
            render: function () {
                var path =  window.location.pathname,
                    url = window.location.protocol + '//' + window.location.host;

                if(path.indexOf('#') !== -1){
                    path = path.substring(0,path.indexOf('#'));
                }
                url +=path;

                this.$el.html(Mustache.render(template,{room:this.room,url:url}));
                this._itemContainer = this.$('#shared-doc-list');
                for (var id in this._subviews) {
                    this._itemContainer.append('<li class="divider"></li>');
                    this._subviews[id].$el.appendTo(this._itemContainer);
                    this._subviews[id].render();
                }
                this._itemContainer.append('<li class="divider"></li>');

            }

        });
    });
