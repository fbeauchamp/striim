/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'mustache',
        'text!templates/fileshare.tpl',
        'views/CmisBrowser'

    ],

    function ($, Backbone, Mustache, fileShareTemplate, CmisBrowser) {
        'use strict';

        return Backbone.View.extend({
            events: {
                'click #uploader': 'clickUploader',
                'click #dropbox-chooser': 'clickDropbox',
                'click #cmis-chooser': 'clickCmis'
            },
            initialize: function () {
                this.uploaderInputFile = null;
            },
            clickCmis: function(){
                var self = this;
                $('#cmis-chooser-reveal').foundation('reveal', 'open');

                this.cmisbrowser.once('choosen', function (doc) {
                    self.trigger('doc', doc);
                    $('#cmis-chooser-reveal').foundation('reveal', 'close');
                });
            },
            clickDropbox: function () {
                if (!!window.Dropbox) {
                    console.log('dropbox undefined');
                    return;
                }

                var self = this;
                window.Dropbox.choose({

                    // Required. Called when a user selects an item in the Chooser.
                    success: function (files) {
                        var file = files[0],
                            point = file.name.lastIndexOf('.');

                        file.id =  file.link.match(/\/([a-z0-9]{15,32})\//)[1];
                        file.ext =  point >=0 ? file.name.substr(point) : '';

                        self.trigger('doc', file);
                    },

                    // Optional. Called when the user closes the dialog without selecting a file
                    // and does not include any parameters.
                    cancel: function () {

                    },

                    // Optional. "preview" (default) is a preview link to the document for sharing,
                    // "direct" is an expiring link to download the contents of the file. For more
                    // information about link types, see Link types below.
                    linkType: 'direct', // or "direct"

                    // Optional. A value of false (default) limits selection to a single file, while
                    // true enables multiple file selection.
                    multiselect: false/*,
                    extensions: ['.pdf']*/
                });
            },
            clickUploader: function (e) {
                if (e.target !== this.uploaderInputFile) {
                    $(this.uploaderInputFile).click();
                }
            },
            render: function () {
                var self = this;
                this.$el.html(Mustache.render(fileShareTemplate));

                this.uploaderInputFile = this.$('#uploader input[type=file]')[0];
                $(this.uploaderInputFile)
                    .change(function () {
                        var files = this.files;
                        if (!files.length) {
                            //no files
                            return;
                        }
                        var formData = new FormData();
                        //formData.append('room', 'le nom de ma salle');
                        for (var i = 0, file = files[i]; i < files.length; ++i) {
                            formData.append('file', file);
                        }
                        var xhr = new XMLHttpRequest();
                        xhr.open('POST', '/upload', true);
                        var $progress = $('<div class="progress radius  small"></div>').append('<span class="meter"></span>');
                        $progress.find('.meter').width(0);
                        $progress.appendTo($('#uploader'));
                        xhr.onload = function (e) {
                            console.log(e);
                            var doc = JSON.parse(e.target.responseText) ;
                            if(doc.error){
                                console.log(doc.error);
                            }else{
                                self.trigger('doc', doc);
                            }
                            $progress.remove();
                        };
                        xhr.upload.onprogress = function (e) {
                            if (e.lengthComputable) {
                                $progress.find('.meter').css('width', ((e.loaded / e.total) * 100) + '%');
                            }
                        };
                        xhr.send(formData);

                    })
                    .hide();
                this.cmisbrowser=  new CmisBrowser({el: this.$('#cmis-chooser-reveal .browser')}).render();
                return this;
            }
        });
    });
