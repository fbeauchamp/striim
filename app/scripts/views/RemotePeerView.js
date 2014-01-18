/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'underscore',
        'mustache',
        'views/PeerView',
        'text!templates/video.en.tpl',
        'text!templates/audio.en.tpl'
    ],

    function ($, Backbone, _, Mustache, PeerView,templateVideo,templateAudio) {

        'use strict';

        var template = '<h5>{{#name}}{{name}}{{/name}}{{^name}}sans nom{{/name}}</h5><div class="streams-container"></div>';
   /*     var templateVideo = '<div class="stream-container video">' +
            '<p class="stream-label">Video</p>' +
            '<video src="" autoplay=true></video>' +
            '<div class="button-container">' +
            '<a class="button alert video-status paused"><i class="fi-pause"></i><span>vidéo en pause</span></a>' +
            '<a class="button video-status playing"><i class="fi-video"></i><span>vidéo en cours</span></a>' +
            '<a class="button alert audio-status muted"><i class="fi-volume-strike"></i><span>sans le son</span></a>' +
            '<a class="button audio-status nonmuted"><i class="fi-volume"></i><span>avec le son</span></a>' +
            '<a class="button alert expand-status expanded" href="#home"><i class="fi-arrows-compress"></i><span> en grand</span></a>' +
            '<a class="button expand-status nonexpanded" href="#video/{{peerId}}/{{videoId}}"><i class="fi-arrows-expand"></i><span>en petit</span></a>' +
            '</div>' +
            '</div>';
        var templateAudio = '<div class="stream-container audio">' +
            '<p class="stream-label">Audio</p>' +
            '<div class="button-container">' +
            '<a class="button alert audio-status muted"><i class="fi-volume-strike"></i><span>sans le son</span></a>' +
            '<a class="button audio-status nonmuted"><i class="fi-volume"></i><span>avec le son</span></a>' +
            '</div>' +
            '<audio src="" autoplay=true></audio>' +
            '</div>';*/
        var RemotePeerView = PeerView.extend({


            initialize: function () {
            },
            _renderOneStream: function (stream, id) {
                var audios = stream.getAudioTracks();
                var videos = stream.getVideoTracks();
                if (videos.length > 1 || audios.length > 1) {
                    console.log('no support for multiple track in one stream');
                }
                var $container = null;
                var videolabel = videos.length ? videos[0].label : '';
                var audiolabel = audios.length ? audios[0].label : '';

                if (videos.length || (!videos.length && !audios.length)) {
                    $container = $(
                        Mustache.render(
                            templateVideo, {
                                videolabel: (!videos.length && !audios.length) ? '' : videolabel,
                                audiolabel: audiolabel,
                                videoId: id,
                                peerId: this.model.id,
                                remote : this.model.get('remote')
                            }
                        )
                    );
                    $container.find('video').attr('src', window.URL.createObjectURL(stream));
                    $container.find('.video-status.paused').hide();
                    $container.find('.expand-status.expanded').hide();
                } else {
                    // pas de video
                    $container = $(Mustache.render(templateAudio, { audiolabel: audiolabel,
                        remote : this.model.get('remote')}));
                    $container.find('audio').attr('src', window.URL.createObjectURL(stream));
                    $container.find('.video-status').hide();
                    $container.find('.expand-status').hide();
                }
                if (audios.length) {
                    $container.find('.audio-status.muted').hide();
                } else {

                    $container.find('.audio-status').hide();
                }
                if (videos.length || audios.length) {
                    $container.find('.video-status').click(function () {
                        $container.find('.video-status').toggle();
                        stream.getVideoTracks()[0].enabled = !(stream.getVideoTracks()[0].enabled);
                    });

                    $container.find('.audio-status').click(function () {
                        $container.find('.audio-status').toggle();
                        stream.getAudioTracks()[0].enabled = !(audios[0].enabled);
                    });

                } else {
                    $container.find('.audio-status').hide();
                    $container.find('.video-status').hide();
                }

                $container.find('.expand-status').click(function (e) {
                    $container.find('.expand-status').toggle();
                });

                this.$('.streams-container').append($container);
                stream.onended = function () {
                    console.log('end stream');
                    $container.remove();
                };
            },
            render: function () {
                var self = this,
                    json = this.model.toJSON();
                this.$el.html(Mustache.render(template, json));
                //self.$('h5').css('text-shadow', '0  0 2px ' + this.model.get('color'));
               // self.$('h5').css('color', self.model.get('color'));
                this.$el.css('border-color', this.model.get('color'));
                var streams = this.model.get('streams');
                if (streams && streams.length) {
                    for (var i in streams) {
                        this._renderOneStream(streams[i], i);
                    }
                }
                this.model.on('change:name', function (peer, name) {
                    self.$('h5').text(name);
                });
                this.model.on('change:color', function () {
                    //self.$('h5').css('text-shadow', '0  0 1px ' + self.model.get('color'));
                   // self.$('h5').css('color', self.model.get('color'));
                    self.$el.css('border-color', self.model.get('color'));
                });
            }
        });


        return RemotePeerView;
    });