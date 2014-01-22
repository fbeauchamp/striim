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
                console.log(local.toJSON());
                this.$el.attr('src', '//'+document.domain+'/ep/p/'+this.model.get('padID')+'?showChat=false'+"&userName="+local.get('name')+'&userColor='+local.get('color'));

                return this;
            }

        });
    });