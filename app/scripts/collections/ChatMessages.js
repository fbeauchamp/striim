/*global define:true */
define([
    'underscore',
    'backbone',
    'models/ChatMessage'
], function (_, Backbone, ChatMessage) {
    'use strict';
    return  Backbone.Collection.extend({
        model: ChatMessage,
        initialize: function () {
            var self = this;
            Backbone.on('share:add', function (model) {
                console.log('check');
                if (model.mime === 'application/message') {
                    self.add(model);
                }
            });
            this.on('add', function (model) {
                if (!model.get('from')) {//message local
                    Backbone.trigger('share:added', model.toJSON());
                }
            });
        }
    });
});
