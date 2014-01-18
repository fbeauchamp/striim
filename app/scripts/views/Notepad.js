/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'views/DocumentView'
    ],

    function ($, Backbone,  DocumentView) {
        'use strict';
        return  DocumentView.extend({
            tagName: 'iframe',
            className:'mainView',
            render: function () {
                this.adjust();

                this.$el.attr('src', '//'+document.domain+'/ep/p/'+this.model.get('padID')+'?showChat=false');

                return this;
            }

        });
    });