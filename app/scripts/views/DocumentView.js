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
                this.$el.height(Math.max(500,$(window).height() - this.$el.offset().top - 10));
                return this;
            },
            render: function () {
                return this;
            }
        });
    });