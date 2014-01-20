/*global define:true */
define([
    'underscore',
    'backbone',
    'views/DocumentViewFactory',
], function (_, Backbone,DocumentViewFactory) {

    'use strict';
    return  Backbone.Collection.extend({
        initialize: function () {
            var self = this;
            this.on('add', function (model) {
                if (!model.get('from')) {
                    Backbone.trigger('share:added', model.toJSON());
                }
            });

            this.on('remove', function (model) {
                if (!model.get('removeFromRemote')) {
                    Backbone.trigger('share:removed', model.toJSON());
                }
            });

            Backbone.on('share:add', function (jsonDoc) {
                var doc = new Backbone.Model(jsonDoc);
                if (DocumentViewFactory.isViewable(doc)) {
                    //doc is viewable, add it to the shared  docs
                    self.add(doc);
                } else {

                }
            });
            Backbone.on('share:remove', function (docId) {
                var d = self.get(docId);

                if (d) {
                    d.set('removeFromRemote', true);
                    self.remove(d);
                }
            });
            Backbone.on('share:setContent', function (jsonDoc) {
                var d = self.get(jsonDoc.id);
                if (d) {
                    d.set('content', jsonDoc.content)
                }
            });
            Backbone.on('share:updateContent', function (patch) {
                var d = self.get(patch.id);
                if (d) {
                    d.trigger('updateContent', patch)
                }
            });

        }
    });

});