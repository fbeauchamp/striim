/*global define:true */
define(
    [
        'jquery',
        'backbone'
    ],

    function ($, Backbone) {
        'use strict';

        return  Backbone.View.extend({

            initialize: function (opts) {
                opts = opts || {};
                var self = this;
                this.document = opts.document;
                $(window).resize(function () {
                    self.adjust();
                });
            },
            toJSON: function () {
                if (this.model) {
                    return this.model.toJSON();
                }
                return {};
            },
            adjust: function () {
                console.log('adjust');
                this.$el.height(Math.max(500,$(window).height() - this.$el.offset().top - 10));
                 // this.$el.width($(window).width() - this.$el.offset().left - 10);
                return this;
            },
            render: function () {
                return this;
            }
        });
    });