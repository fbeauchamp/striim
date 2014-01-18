/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'mustache',
        'collections/ChatMessages',
        'views/MenuView',
        'views/ChatView',
        'views/PeersView',
        'views/UploaderView',
        'views/VideoView',
        'views/DocumentViewFactory',
        'text!templates/main.tpl'

    ],

    function ($, Backbone, Mustache, Messages, MenuView, ChatView, PeersView, UploaderView, VideoView, DocumentViewFactory, mainTemplate) {
        'use strict';

        return  Backbone.View.extend({
            initialize: function (opts) {
                opts = opts || {};
                this.shares = opts.shares;
                this.messages = new Messages();
                this.peers = opts.peers;
                this.room = opts.room;
                this._shareViewCache = [];
                this._videoView = null;
                this._currentShareView = null;
                var self = this;
            },
            render: function () {
                var self = this;

                this.$el.html(Mustache.render(mainTemplate, {room: this.room}));
                this.menu = new MenuView({collection: this.shares, el: 'header.masthead', room: this.room});
                this.menu.render();

                //add uploader
                this.uploader = new UploaderView().render();
                $('#chat-container').append(this.uploader.$el);
                this.uploader.on('doc', function (doc) {
                    self.shares.add(doc);
                });

                //add chat
                this.chat = new ChatView({collection: this.messages, peers: this.peers});
                $('#chat-container').append(this.chat.$el);
                this.chat.render();

                //and finally the peers views ( local and remote )
                this.peersView = new PeersView({collection: this.peers}).render();
                if (this.shares.length) {
                    var m = this.shares.at(0);
                    this.showShare(m.id);
                }
                $(document).foundation();
                return  this;
            },
            showVideo: function (peerId, videoId) {
                var peer = this.peers.get(peerId);
                if (!peer) {
                    return;
                }
                var video = peer.get('streams')[videoId];
                if (!video) {
                    return;
                }

                this.menu.activate('');
                if (this._currentShareView) {
                    this._currentShareView.$el.hide();
                }
                if (this._videoView) {
                    this._videoView.remove();
                }
                this._videoView = new VideoView({video: video});
                this._videoView.$el.appendTo('#main-content');
                this._videoView.render();

            },
            showShare: function (id) {

                if (!this.shares.get(id)){
                    console.log(' doc unknown')
                    return;
                }

                this.menu.activate(id);
                if (this._currentShareView) {
                    this._currentShareView.$el.hide();
                }
                if (this._videoView) {
                    this._videoView.remove();
                }
                if (this._shareViewCache[id]) {
                    this._currentShareView = this._shareViewCache[id];
                    this._currentShareView.$el.show();
                } else {
                    this._currentShareView = this._shareViewCache[id] = DocumentViewFactory.makeView({peers: this.peers, model: this.shares.get(id) });
                    this._currentShareView.$el.appendTo('#main-content');
                    this._currentShareView.render();
                }
            },
            remove: function () {
                this.menu.remove();
                this.uploader.remove();
                this.chat.remove();
                this.peersView.remove();
                _.each(this._shareViewCache, function (shareView) {
                    shareView.remove();
                });
                if (this._videoView) {
                    this._videoView.remove();
                }
                return Backbone.View.prototype.remove.apply(this, arguments);
            }

        });
    });