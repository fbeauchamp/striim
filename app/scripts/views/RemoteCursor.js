/*global define:true */
define(
    [
        'jquery',
        'backbone'
    ],

    function ($, Backbone) {
        'use strict';
        return  Backbone.View.extend({

            initialize: function () {
                var self = this;
                this.model.on('change', function () {
                    self.render();
                });
            },
            click: function () {
                var offset = this.$el.offset();
                var $circle = $('<div></div>');

                $circle
                    .css({
                        'background-color': 'yellow',
                        position: 'absolute',
                        'border-radius': '50%',
                        opacity: 0.25,
                        width: '0',
                        height: '0',
                        'z-index': 4
                    })
                    .offset({
                        top: offset.top - 8,
                        left: offset.left - 8
                    })
                    .appendTo('body')
                    .animate({
                        opacity: 0.75,
                        width: '3em',
                        height: '3em',
                        left: '-=1.5em',
                        top: '-=1.5em'
                    }, 400, function () {
                        $circle.fadeOut(200, function () {
                            $circle.remove();
                        });
                    });
            },
            move: function (offsetX, offsetY) {
                var self = this,
                    canvas = this.$el.parents('.canvasContainer').find('.canvas'),
                    offset = canvas.offset(),
                    width = canvas.width(),
                    height = canvas.height();

                if (this.fade) {
                    clearInterval(this.fade);
                }
                this.$el.show();
                this.$el.offset({
                    top: height * offsetY + offset.top + 8,
                    left: width * offsetX + offset.left + 8
                });

                this.fade = setTimeout(function () {
                    self.$el.fadeOut();
                }, 800);
                return this;
            },
            render: function () {
                this.$el.css({
                    position: 'absolute',
                    'z-index': 5,
                    'background-color': 'rgba(255,255,255,0.8)',
                    color: this.model.get('color')
                }).text(this.model.get('name')).prepend('<i class="fi-play" style="display:block;position:absolute;top:-10px;left:-8px; text-shadow: white 0.1em 0.1em 0.2em"></i>');
                return this;
            }
        });
    });
