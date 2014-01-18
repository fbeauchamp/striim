/*global define:true */
define(
    [
        'jquery',
        'backbone'
    ],

    function ($, Backbone) {
        'use strict';
        return  Backbone.View.extend({
            className: 'panel radius'
        });
    });