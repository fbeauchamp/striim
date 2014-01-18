/*global define:true */
define([
    'underscore',
    'backbone',
    'models/Peer'
], function (_, Backbone, Peer) {

    'use strict';
    return  Backbone.Collection.extend({
        model: Peer,
        message: function (payload) { //send a message to all these peers
            this.each(function (peer) {
                peer.message(payload);
            });
        },
        getLocal: function () {
            return this.where({remote: false})[0];
        },
        getRemotes: function () {
            return this.where({remote: true});
        }
    });

});