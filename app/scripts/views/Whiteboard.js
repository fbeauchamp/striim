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
                var local = this.peers.getLocal();
                this.$el.attr('src', '//'+document.domain+'/draw/d/'+this.model.get('padID')+'?showChat=false'+"&userName="+local.get('name')+'&userColor='+local.get('color'));

                return this;
            }

        });
    });