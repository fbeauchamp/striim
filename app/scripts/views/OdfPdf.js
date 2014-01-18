/*global define:true */
define(
    [
        'jquery',
        'underscore',
        'backbone',
        'pdfjs',
        'mustache',
        'views/DocumentView',
        'text!templates/pdf.tpl'
    ],

    function ($, underscore, Backbone, PDFJS, Mustache, DocumentView, template) {
        'use strict';
        PDFJS.workerSrc = 'bower_components/pdf.js/build/pdf.worker.js';


        var Cursor = Backbone.View.extend({

            initialize: function () {
                var self = this;
                this.model.on('change', function () {
                    self.render();
                });
            },
            click: function () {
                var offset = this.$el.offset();
                var $circle = $('<div></div>');

                $circle
                    .css({
                        'background-color': 'yellow',
                        position: 'absolute',
                        'border-radius': '50%',
                        opacity: 0.25,
                        width: '0',
                        height: '0',
                        'z-index':4
                    })
                    .offset({
                        top:offset.top -8,
                        left:offset.left -8
                    })
                    .appendTo('body')
                    .animate({
                        opacity: 0.75,
                        width: '3em',
                        height: '3em',
                        left:'-=1.5em',
                        top:'-=1.5em'
                    }, 400, function () {
                        $circle.fadeOut(200, function () {
                            $circle.remove()
                        });
                    });
            },
            move: function (offsetX, offsetY) {
                var self = this,
                    canvas = this.$el.parents('.canvasContainer').find('canvas'),
                    offset = canvas.offset(),
                    width = canvas.width(),
                    height = canvas.height();

                if (this.fade) {
                    clearInterval(this.fade);
                }
                this.$el.show();
                this.$el.offset({
                    top: height * offsetY + offset.top + 8,
                    left: width * offsetX + offset.left + 8
                });

                this.fade = setTimeout(function () {
                    self.$el.fadeOut()
                }, 800);
                return this;
            },
            render: function () {
                this.$el.css({
                    position: 'absolute',
                    'z-index': 5,
                    'background-color': 'rgba(255,255,255,0.8)',
                    color: this.model.get('color')
                }).text(this.model.get('name')).prepend('<i class="fi-play" style="display:block;position:absolute;top:-10px;left:-8px; text-shadow: white 0.1em 0.1em 0.2em"></i>');
                return this;
            }
        });

        return  DocumentView.extend({
            initialize: function (opts) {
                var self = this;
                this.peers = opts.peers;
                this._cursors = [];
                Backbone.on('share:setState', function (state) {
                    if (state.id === self.model.get('id')) {
                        if (state.page && state.page !== self.pageNum) {
                            self.pageNum = state.page;
                            self._renderPage();
                        }

                        if (state.cursor) {
                            var cursor = self.getCursor(state.from);
                            cursor.move(state.cursor.x, state.cursor.y);
                            if (state.type == 'click') {
                                cursor.click();
                            }
                        }
                    }

                });
            },
            className: 'mainView',
            events: {
                'click .nextPage': 'next',
                'click .previousPage': 'prev',
                'click .fullscreen': 'fullscreen',
                'click canvas': 'clickCanvas',
                'mousemove canvas': 'move'
            },
            clickCanvas: function (e) {
                var canvas = this.$('canvas'),
                    offset = canvas.offset(),
                    width = canvas.width(),
                    height = canvas.height();

                Backbone.trigger('share:stateSet',
                    {
                        id: this.model.id,
                        type: 'click',
                        cursor: {
                            x: (e.pageX - offset.left) / width,
                            y: (e.pageY - offset.top) / height
                        }
                    }
                )
            },
            move: function (e) {
                var canvas = this.$('canvas'),
                    offset = canvas.offset(),
                    width = canvas.width(),
                    height = canvas.height();
                Backbone.trigger('share:stateSet',
                    {
                        id: this.model.id,
                        type: 'move',
                        cursor: {
                            x: (e.pageX - offset.left) / width,
                            y: (e.pageY - offset.top) / height
                        }
                    }
                )
            },
            getCursor: function (from) {
                if (!this._cursors[from]) {
                    this._cursors[from] = new Cursor({model: this.peers.get(from)});
                    this._cursors[from].$el.appendTo(this.$('.canvasContainer'));
                    if (this.pdf) {
                        this._cursors[from].render();
                    }
                }
                return this._cursors[from];
            },
            next: function (e) {
                e.preventDefault();
                if (this.pageNum >= this.pdf.pdfInfo.numPages)
                    return;
                this.pageNum++;
                this._renderPage();
                Backbone.trigger('share:stateSet', {id: this.model.get('id'), page: this.pageNum});
            },
            prev: function (e) {
                e.preventDefault();
                if (this.pageNum <= 1)
                    return;
                this.pageNum--;
                this._renderPage();
                Backbone.trigger('share:stateSet', {id: this.model.get('id'), page: this.pageNum});

            },
            fullscreen: function () {
                if (this.el.requestFullscreen) {
                    this.el.requestFullscreen();
                } else if (this.el.msRequestFullscreen) {
                    this.el.msRequestFullscreen();
                } else if (this.el.mozRequestFullScreen) {
                    this.el.mozRequestFullScreen();
                } else if (this.el.webkitRequestFullscreen) {
                    this.el.webkitRequestFullscreen();
                }
            },

            _renderPage: function () {
                var canvas = this.$('canvas')[0], self = this;
                if (!this.pdf)
                    return;
                this.pdf.getPage(this.pageNum).then(function (page) {
                    //get native scale
                    var viewport = page.getViewport(1);
                    self.adjust();
                    var scale = Math.min(
                        self.$el.width() / viewport.width,
                        (self.$el.height()) / viewport.height
                    );

                    viewport = page.getViewport(scale);

                    //
                    // Prepare canvas using PDF page dimensions
                    //
                    var context = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    //
                    // Render PDF page into canvas context
                    //
                    var renderContext = {
                        canvasContext: context,
                        viewport: viewport
                    };
                    page.render(renderContext);
                    if (self.pageNum == self.pdf.pdfInfo.numPages) {
                        self.$('.nextPage').attr('disabled', 'disabled');
                    } else {
                        self.$('.nextPage').attr('disabled', null);
                    }

                    if (self.pageNum == 1) {
                        self.$('.previousPage').attr('disabled', 'disabled');
                    } else {
                        self.$('.previousPage').attr('disabled', null);
                    }
                });
            },
            render: function () {
                var self = this;
                this.$el.html(Mustache.render(template, this.model.toJSON()));
                PDFJS.getDocument(this.model.get('link')).then(function (pdf) {
                    self.pdf = pdf;
                    self.pageNum = 1;
                    self._renderPage();
                });
                _.each(this._cursors, function (cursor) {
                    cursor.$el.appendTo(self.$('.canvasContainer'));
                    cursor.render();
                });

                return this;
            }
        });
    });