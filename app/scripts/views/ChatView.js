/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'underscore',
        'mustache',
        'timeago',
        'text!templates/chat.en.tpl',
        'text!templates/chat.message.en.tpl'
    ],

    function ($, Backbone,_, Mustache,timeago,template,templateMessage) {
        'use strict';
        /*
        $.timeago.settings.strings = {
            // environ ~= about, it's optional
            prefixAgo: 'il y a',
            prefixFromNow: 'd\'ici',
            seconds: 'moins d\'une minute',
            minute: 'environ une minute',
            minutes: 'environ %d minutes',
            hour: 'environ une heure',
            hours: 'environ %d heures',
            day: 'environ un jour',
            days: 'environ %d jours',
            month: 'environ un mois',
            months: 'environ %d mois',
            year: 'un an',
            years: '%d ans'
        };*/
        var  ChatMessage = Backbone.View.extend({
                tagName: 'p',
                initialize: function (opts) {
                    var peer = opts.peers.get(this.model.get('from'));
                    if (peer) {
                        this.setPeer(peer);
                    }
                },
                setPeer: function (peer) {
                    var self = this;
                    this._peer = peer;
                    peer.on('change', function () {
                        self.render();
                    });
                },
                render: function () {
                    var json = this.model.toJSON(),
                        content = this.model.get('content'),
                    //http://blog.mattheworiordan.com/post/13174566389/url-regular-expression-for-links-with-or-without-the
                        regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/g;

                    json.at = new Date(json.at).toISOString();
                    if (this._peer) {
                        json.fromName = this._peer.get('name');
                    }
                    content = content.replace(/&/g, '&amp;')
                        .replace(/>/g, '&gt;')
                        .replace(/</g, '&lt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&apos;'); //escape

                    content = content.replace(regex, '<a href="$1" target="_blank">$1</a>');
                    json.content = content;
                    this.$el.html(Mustache.render(templateMessage, json));

                    if (this._peer) {
                        this.$('.author').css({
                            'border-color': this._peer.get('color'),
                            'color': this._peer.get('color')
                        });
                    }
                    this.$('.timeago').timeago();
                    return this;
                }
            });


        return Backbone.View.extend({
            events: {
                'submit form': 'post',
                'keyup textarea': 'keyup'
            },
            initialize: function (opts) {
                opts = opts || {};
                this._peers = opts.peers;
                this._subviews = {};

                var self = this;
                this.collection.each(function (model) {
                    self._subviews[model.id] = new ChatMessage({model: model, peers: self._peers});
                });
                this.collection.on('add', function (model) {
                    self._subviews[model.id] = new ChatMessage({model: model, peers: self._peers});
                    if (self._messageContainer) {
                        self._subviews[model.id].$el.prependTo(self._messageContainer);
                        self._subviews[model.id].render();
                    }
                });
                this.collection.on('remove', function (model) {
                    if (self._subviews[model.id]) {
                        self._subviews[model.id].$el.remove();
                        delete self._subviews[model.id];
                    }
                });
                this.collection.on('change', function (model) {
                    if (self._subviews[model.id] && self._messageContainer) {
                        self._subviews[model.id].render();
                    }
                });

                this._peers.on('add', function (peer) {
                    self.collection.each(function (message) {
                        if (message.get('from') === peer.get('id')) {
                            self._subviews[message.id].setPeer(peer);
                            self._subviews[message.id].render();
                        }
                    });
                });
            },
            keyup: function (e) {
                if (e.which === 13 && !e.shiftKey) {
                    this.post();
                }
            },
            post: function () {
                //todo : bad : a view that modify data directly
                this.collection.add({
                    id: new Date() + Math.random(),
                    mime: 'application/message',
                    content: this.$('textarea').val(),
                    at: +new Date()
                });
                this.$('textarea').val('').focus();

            },
            render: function () {
                this.$el.html(Mustache.render(template));
                this._messageContainer = this.$('.messages');
                for (var i  in this._subviews) {
                    if (this._subviews.hasOwnProperty(i)) {
                        this._subviews[i].$el.prependTo(this._messageContainer);
                        this._subviews[i].render();

                    }
                }
                return this;
            },
            remove: function () {
                _.each(this._subviews ,function(subview){
                    subview.remove();
                });
                return Backbone.View.prototype.remove.apply(this, arguments);
            }

        });
    });