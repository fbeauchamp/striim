/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'mustache',
        'views/RemoteCursor',
        'text!templates/download.en.tpl'
    ],

    function ($, Backbone,Mustache,RemoteCursor ,template) {
        'use strict';

        return  Backbone.View.extend({
            className: 'mainView row file',

            initialize: function (opts) {
                this._cursors = [];
                Backbone.on('share:setState', function (state) {
                    if (state.id === self.model.get('id')) {
                        if (state.cursor) {
                            var cursor = self.getCursor(state.from);
                            cursor.move(state.cursor.x, state.cursor.y);
                            if (state.type == 'click') {
                                cursor.click();
                            }
                        }
                    }

                });
                opts = opts || {};
                var self = this;
                this.peers = opts.peers;
                this.document = opts.document;
                $(window).resize(function () {
                    self.adjust();
                });
            },
            toJSON: function () {
                if (this.model) {
                    return this.model.toJSON();
                }
                return {};
            },
            adjust: function () {
                this.$el.height(Math.max(500,$(window).height() - this.$el.offset().top - 10));
                return this;
            },
            fullscreen: function () {
                if (this.el.requestFullscreen) {
                    this.el.requestFullscreen();
                } else if (this.el.msRequestFullscreen) {
                    this.el.msRequestFullscreen();
                } else if (this.el.mozRequestFullScreen) {
                    this.el.mozRequestFullScreen();
                } else if (this.el.webkitRequestFullscreen) {
                    this.el.webkitRequestFullscreen();
                }
            },
            onDocumentClick: function (e) {
                var target  = $(e.target),
                    offset = target.offset(),
                    width = target.width(),
                    height = target.height();

                Backbone.trigger('share:stateSet',
                    {
                        id: this.model.id,
                        type: 'click',
                        cursor: {
                            x: (e.pageX - offset.left) / width,
                            y: (e.pageY - offset.top) / height
                        }
                    }
                )
            },
            onMouseMove: function (e) {
                var target  = $(e.target),
                    offset = target.offset(),
                    width = target.width(),
                    height = target.height();
                Backbone.trigger('share:stateSet',
                    {
                        id: this.model.id,
                        type: 'move',
                        cursor: {
                            x: (e.pageX - offset.left) / width,
                            y: (e.pageY - offset.top) / height
                        }
                    }
                )
            },
            getCursor: function (from) {
                if (!this._cursors[from]) {
                    this._cursors[from] = new RemoteCursor({model: this.peers.get(from)});
                    this._cursors[from].$el.appendTo(this.$('.canvasContainer'));
                    if (this.pdf) {
                        this._cursors[from].render();
                    }
                }
                return this._cursors[from];
            },
            render: function () {
                console.log(this.model.toJSON());
                this.$el.html(Mustache.render(template,this.model.toJSON()));
                return this;
            }
        });
    });