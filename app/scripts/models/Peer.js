/*global define:true */
define([
    'underscore',
    'backbone',
    'helpers/WebRTC'
], function (_, Backbone, WebRTC) {
    'use strict';

    var Peer = Backbone.Model.extend({
        defaults: {
            peerconnection: null
        },
        initialize: function () {
            var self = this;

            this.set('streams', []);

            // i can only inform other of change on the the local peer
            this.on('change', function (peer) {
                if (!peer.get('remote')) {
                    Backbone.trigger('peer:changed', peer, name);

                }
            });

            this.get('socket').on('rtc', function (message) {

                if (message.to === self.id) {
                    var peer = self.collection.get(message.from);
                    if (!peer) {
                        //an unknown peer is created
                        peer = new Peer({
                            id: message.from,
                            socket: self.get('socket'),
                            remote: true
                        });
                        self.collection.add(peer);
                    }
                    //only accept message from known clients
                    self.trigger('rtc', message, peer);

                }
            });

            this.on('rtc', function (message, peer) {
                //A rtc message and no peer connection with this peer ?
                // init peer connection as a callee
                if (self.hasPeerConnectionWith(peer) ||
                    message.type !== 'offer' ||
                    message.retriggered) {
                    return;
                }
                WebRTC.initPeerConnection(
                    this,
                    peer,
                    false, //callee
                    function (peerconnection) {
                        console.log('I ve got a peer connection');
                        console.log(peerconnection);

                    },
                    function (err) {
                        console.log('I ve got an error searching for  peer connection');
                        console.log(err);
                    }
                );
                //retrigger the message to let it be processed
                message.retriggered = true;
                self.trigger('rtc', message, peer);
            });
        },
        hasPeerConnectionWith: function (peer) {
            if (!peer) {
                return false;
            }
            if (this.get('remote')) {
                return !!this.get('peerconnection');
            } else {
                return !!peer.get('peerconnection');
            }
        },
        call: function () {
            if (!this.get('remote')) {
                return;
            }

            WebRTC.initPeerConnection(
                this.collection.getLocal(),
                this,  //remote
                true,  //local is the caller
                function (peerconnection) {
                    console.log('I ve got a peer connection');
                    console.log(peerconnection);
                },
                function (err) {
                    console.log('I ve got an error searching for  peer connection');
                    console.log(err);
                }
            );
        },
        message: function (type, payload) { //send a message to a peer
            var json = JSON.parse(JSON.stringify(payload));
            json.to = this.id;
            this.get('socket').emit(type, json);
        },
        toJSON: function () {
            var json = Backbone.Model.prototype.toJSON.call(this);
            delete json.peerconnection;
            delete json.socket;
            return json;
        }
    });
    return Peer;
});