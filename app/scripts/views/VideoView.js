/*global define:true*/
define(
    [
        'jquery',
        'backbone',
        'underscore',
        'mustache',
        'views/DocumentView'
    ],

    function ($, Backbone, _, Mustache, DocumentView) {
        'use strict';
        var VideoView = DocumentView.extend({
            className:'mainView',
            initialize: function (opts) {
                opts = opts||{};
                this.video = opts.video;
            },
            render: function () {
                $('<video></video>').attr({
                    autoplay: true,
                    src: window.URL.createObjectURL(this.video)
                }).appendTo(this.$el);

                return this;
            }
        });
        return VideoView;
    });