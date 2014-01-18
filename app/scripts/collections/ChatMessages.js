/*global define:true */
define([
    'underscore',
    'backbone',
    'models/ChatMessage'
], function (_, Backbone, ChatMessage) {
    'use strict';
    return  Backbone.Collection.extend({
        model: ChatMessage,
        initialize: function(){
            var self = this;
            this.on('add', function(model){
                if(!model.get('from')){//message local
                    Backbone.trigger('share:added', model.toJSON());
                }
            });
            Backbone.on('share:add', function(model){
                if(model.mime === 'text/message'){
                    self.add(model);
                }
            });
        }
    });

});