/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'mustache',
        'text!templates/download.en.tpl'
    ],

    function ($, Backbone,Mustache,template) {
        'use strict';

        return  Backbone.View.extend({
            className: 'mainView row file',

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
                console.log(this.model.toJSON());
                this.$el.html(Mustache.render(template,this.model.toJSON()));
                return this;
            }
        });
    });