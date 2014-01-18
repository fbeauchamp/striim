/*global define:true */

define(
    [
        'jquery',
        'backbone',
        'underscore',
        'mustache',
        'views/PeerView',
        'views/LocalPeerView',
        'views/RemotePeerView'
    ],

    function ($, Backbone, _, Mustache, PeerView, LocalPeerView, RemotePeerView) {
        'use strict';
        return  Backbone.View.extend({
            className: 'panel radius',
            initialize: function () {
                var self = this;
                this._subviews = [];

                this.collection.each(function (model) {
                    self._subviews[model.get('id')] = self._makeOnePeerView(model);
                });

                this.collection.on('add', function (peer) {
                    var peerView = self._makeOnePeerView(peer);
                    self._subviews[peer.get('id')] = peerView;
                    peerView.render();
                });
                this.collection.on('remove', function (peer) {

                    if (self._subviews[peer.get('id')]) {
                        self._subviews[peer.get('id')].remove();
                        delete self._subviews[peer.get('id')];
                    }
                });
                this.collection.on('change:streams', function (peer) {
                    self._subviews[peer.get('id')].render();
                });

            },
            _makeOnePeerView: function (peer) {

                var peerView;
                if (peer.get('remote')) {
                    peerView = new RemotePeerView({model: peer});
                    $('#others').append(peerView.$el);
                } else {
                    peerView = new LocalPeerView({model: peer});
                    $('#chat-container').prepend(peerView.$el);
                }
                return peerView;
            },
            render: function () {
                for (var index in this._subviews) {
                    this._subviews[index].render();
                }
                return this;
            },
            remove: function () {
                for (var i in this._subviews) {
                    this._subviews[i].remove();
                }
                return Backbone.View.prototype.remove.apply(this, arguments);
            }

        });
    });
