/*global define:true */
define([
    'underscore',
    'backbone',
    'hark'
], function (_, Backbone, hark) {
    'use strict';

    return  Backbone.Model.extend({
        defaults: {
            peer: null,
            stream: null
        },
        initialize: function () {
            var self = this,
                speech = hark(this.get('stream'));
            //seems to work only on local stream
            speech.on('speaking', function () {
                self.trigger('speaking');
            });
            speech.on('stopped_speaking', function () {
                self.trigger('stopped_speaking');
            });
        }
    });
});