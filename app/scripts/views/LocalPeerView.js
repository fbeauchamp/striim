/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'underscore',
        'mustache',
        'hark',
        'views/PeerView',
        'text!templates/video.en.tpl',
        'text!templates/audio.en.tpl'
    ],

    function ($, Backbone, _, Mustache, hark, PeerView, templateVideo, templateAudio) {
        'use strict';
        var template = '<h5 data-tooltip title="click here to change your name"> {{#name}}{{name}}{{/name}}{{^name}}cliquez pour indiquer votre nom{{/name}} </h5><div class="streams-container"></div>';


        return  PeerView.extend({
            id: 'me',
            events: {
                'click h5': 'editName'
            },
            initialize: function () {
                this.baseMargin = null;

            },
            editName: function () {
                var self = this,
                    $h5 = this.$('h5'),
                    oldName = $h5.text();

                $h5.attr('contenteditable', 'true');
                var checkEditEnd = function (e) {
                    if (e.which === 13) {

                        if ($.trim($h5.text()) !== '') {
                            var name = $.trim($h5.text());
                            self.model.set('name', name);
                            $h5.attr('contenteditable', 'false').text(name);
                            $h5.off('keyup', checkEditEnd);
                        }
                        else {
                            $h5.text(oldName).attr('contenteditable', 'false');
                            $h5.off('keyup', checkEditEnd);
                        }
                    }
                    if (e.which === 27) {
                        $h5.text(oldName).attr('contenteditable', 'false');
                        $h5.off('keyup', checkEditEnd);
                    }
                };


                $h5.keyup(checkEditEnd);
            },
            _renderOneStream: function (stream) {
                var audios = stream.getAudioTracks();
                var videos = stream.getVideoTracks();
                if (videos.length || audios.length) {
                    if (videos.length > 1 || audios.length > 1) {
                        console.log('no support for multiple track in one stream');
                    }
                    var $container = null;
                    var videolabel = videos.length ? videos[0].label : '';
                    var audiolabel = audios.length ? audios[0].label : '';


                    if (videos.length) {
                        $container = $(Mustache.render(templateVideo,
                            {
                                videolabel: videolabel,
                                audiolabel: audiolabel,
                                remote: this.model.get('remote')
                            }));
                        $container.find('video')
                            .attr('src', window.URL.createObjectURL(stream))
                            .attr('muted', true); //pas d'echo
                        $container.find('.video-status.paused').hide();
                    } else {
                        // pas de video
                        $container = $(Mustache.render(templateAudio,
                            {
                                audiolabel: audiolabel,
                                remote: this.model.get('remote')
                            }));
                        $container.find('audio')
                            .attr('src', window.URL.createObjectURL(stream))
                            .attr('muted', true);//pas d'echo
                        $container.find('.video-status').hide();
                    }
                    if (audios.length) {
                        $container.find('.audio-status.muted').hide();

                        this.speech = hark(stream, {threshold: -70});
                        //seems to work only on local stream
                        this.speech.on('speaking', function () {
                            $container.addClass('speaking');
                        });
                        this.speech.on('stopped_speaking', function () {
                            $container.removeClass('speaking');
                        });
                    } else {

                        $container.find('.audio-status').hide();
                    }

                    $container.find('.video-status').click(function () {
                        $container.find('.video-status').toggle();
                        stream.getVideoTracks()[0].enabled = !(stream.getVideoTracks()[0].enabled);
                    });

                    $container.find('.audio-status').click(function () {
                        $container.find('.audio-status').toggle();
                        audios[0].enabled = !(audios[0].enabled);
                    });

                    this.$('.streams-container').append($container);
                    stream.onended = function () {
                        $container.remove();
                    };

                }
            },
            render: function () {
                console.log(this.model.toJSON());
                this.$el.html(Mustache.render(template, this.model.toJSON()));
                //this.$('h5').css('text-shadow', '0  0 2px ' + this.model.get('color'));
                this.$el.css('border-color', this.model.get('color'));
                var streams = this.model.get('streams');
                if (streams) {
                    for (var i in streams) {
                        this._renderOneStream(streams[i]);
                    }
                }
            },
            remove: function () {

            }

        });
    });