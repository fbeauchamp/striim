/*global define:true */

define(
    [
        'jquery',
        'backbone',
        'underscore',
        'collections/Shares',
        'collections/ChatMessages',
        'helpers/WebRTC',
        'views/MainView',
        'views/LandingView'
    ],

    function ($, Backbone, _, Shares,Messages, WebRTC, MainView, LandingView) {

        return  Backbone.Router.extend({

            routes: {
                "home": "home",
                "join/:room/(:pseudo)": "join",
                "leave": "leave",
                "room": "room",  //room information
                "doc/*id": "showDoc", //show one doc  information
                "video/:peerId/:videoId": "showVideo",
                "login": "login",
                "*a": "login" //et tout le reste aussi
            },
            initialize: function (opts) {
                opts = opts || {};
                this.currentDocView = null;
                this.videoView = null;
                this.room = null;
                this.local = opts.local;
                this.peers = opts.peers;

                this.local.on('change:name', function (model, name) {
                    localStorage.pseudo = name;
                })

            },
            login: function () {

                if (localStorage.shouldReconnect && localStorage.room) {
                    this.navigate('#join/' + localStorage.room + '/' + localStorage.pseudo, {trigger: true});
                    return;
                }
                $('body').empty();
                var $el = $('<div></div>').appendTo('body');
                this.landingView = new LandingView({el: $el, router: this}).render();
            },
            room: function () {
                if (!this.room) {
                    this.navigate('#login', {trigger: true});
                }
                var self = this;
                $('#room-information').foundation('reveal', 'open');

                $(document).on('closed', '#room-information', function () {
                    self.navigate('#');
                });
            },
            home: function () {
                if (!this.room) {
                    this.navigate('#login', {trigger: true});
                }
                if (this.videoView) {
                    this.videoView.remove();
                }
                if (this.currentDocView) {
                    this.currentDocView.$el.show();
                }
            },
            join: function (room, pseudo) {
                var self = this;
                pseudo = $.trim(pseudo || '') || localStorage.pseudo;
                localStorage.pseudo = pseudo;
                if (pseudo) {
                    this.local.set('name', pseudo);
                }
                //update UI and get back an escaped
                // room = $('#room-name').text(room).show().html();
                console.log('room ' + room);
                this.room = $('<div></div>').text(room).html();
                console.log('room ' + room);
                this.room = room;


                $('body h2').text('Waiting for webcam authorization');
                WebRTC.getLocalScreen(
                    {},
                    getCam
                    , function (error) {
                        console.log('couldn t get the screen ' + error);
                        getCam();
                    });
                function getCam(screen) {
                    WebRTC.getLocalWebcam(
                        {
                            audio: true,
                            video: true
                        },
                        function (cam) {
                            console.log(' get the cam');
                            var streams = [cam];
                            if (screen) {
                                streams.push(screen);
                            }
                            self.local.set('streams', streams);
                            emitJoin();
                        }, function (error) {
                            console.log('and fail to get cam');
                            console.log(error);
                            if (screen) {
                                self.local.set('streams', [screen]);
                            } else {
                                console.log(' no stream ')
                            }
                            emitJoin();
                        }
                    )
                }

                function emitJoin() {

                    if (self.landingView) {
                        self.landingView.remove();
                    }
                    $('body').empty();
                    var $el = $('<div></div>').appendTo('body');
                    self.mainView = new MainView({
                        shares: new Shares(),
                        messages: new Messages(),
                        peers: self.peers,
                        el: $el,
                        room: self.room
                    }).render();

                    self.mainView.shares.once('add', function (m) {

                        self.navigate('doc/' + m.id, {trigger: true});

                    });
                    self.local.get('socket').emit('join', self.room, function () {

                        localStorage.room = self.room;
                        localStorage.shouldReconnect = true;
                        self.peers.each(function (peer) {
                            peer.call();
                        });

                        $('#room-name').click();
                    });
                }
            },
            leave: function () {
                this.local.get('socket').emit('leave');
                localStorage.removeItem('shouldReconnect');
                this.mainView.remove();
                this.mainView = null;
                this.room = null;
                this.navigate('#home', {trigger: true});
            },
            showDoc: function (id) {

                //spat are left encodeded
                id = decodeURIComponent(id);


                if (!this.room) {
                    this.navigate('#login', {trigger: true});
                }
                if (this.mainView) {
                    this.mainView.showShare(id);
                }
            },
            showVideo: function (peerId, videoId) {

                if (!this.room) {
                    this.navigate('#login', {trigger: true});
                }
                this.mainView.showVideo(peerId, videoId);
            }

        });

    });