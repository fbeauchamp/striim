/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'mustache',
        'text!templates/landing.en.tpl'
    ],

    function ($, Backbone, Mustache, template) {
        'use strict';
        return  Backbone.View.extend({
            events: {
                'submit form': 'submit',
                'click #refresh-room-name': 'clickRefresh'
            },
            initialize: function (opts) {
                this.router = opts.router;
            },
            submit: function (e) {
                var $input = this.$('[name=roomname]');
                var pseudo = this.$('[name=name]').val();
                var roomName = $input.val() || $input.attr('placeholder');
                if (roomName) {
                    this.router.navigate('#join/' + roomName + '/' + pseudo, {trigger: true});
                }
                e.preventDefault();
            },
            clickRefresh: function () {
                this._refreshRoomName(true);
            },
            _refreshRoomName: function (force) {
                var self = this;
                $.ajax({
                    url: '//fr.wikipedia.org/w/api.php?callback=?',
                    data: {action: 'query', list: 'random', rnlimit: 1, format: 'json', rnnamespace: 0},
                    dataType: 'jsonp',
                    success: function (data) {
                        var $inputRoomName = self.$('[name=roomname]');
                        if (force || $inputRoomName.val() == '' )
                            $inputRoomName.val('').attr('placeholder', data.query.random[0].title);
                    }
                })
            },
            render: function () { 
                this.$el.html(Mustache.render(template,localStorage));
                $(document).foundation();
                this._refreshRoomName(false);
                return this;
            }
        });
    });