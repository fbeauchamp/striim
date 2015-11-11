/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'prezi',
        'views/DocumentView'
    ],

    function ($, Backbone, PreziPlayer, DocumentView) {
        'use strict';
        return  DocumentView.extend({
            className: 'mainView',
            render: function () {
                var self = this;
                this.$el.attr('id', this.model.id);

                this.adjust();
                this.player = new PreziPlayer(this.model.id, {
                    'preziId': this.model.get('preziId'),
                    width: this.$el.width(),
                    height: this.$el.height(),
                    controls: 1
                });
                this.player.on(PreziPlayer.EVENT_CURRENT_STEP, function (e) {
                    Backbone.trigger('share:stateSet', {id: self.model.get('id'), page: e.value});
                });

                Backbone.on('share:setState', function (state) {
                    if (state.id === self.model.get('id')) {
                        console.log('event prezi');
                        if (state.page && state.page !== self.player.getCurrentStep()) {
                            console.log('change page ');
                            self.pageNum = state.page;
                            self.player.flyToStep(state.page);
                        }
                    }

                });
                return this;
            }

        });
    });
