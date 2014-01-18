/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'pdfjs',
        'mustache',
        'views/DocumentView',
        'views/SharedCursor',
        'text!templates/pdf.tpl'
    ],

    function ($, Backbone, PDFJS, Mustache, DocumentView,SharedCursor , template) {
        'use strict';
        PDFJS.workerSrc = 'bower_components/pdf.js/build/pdf.worker.js';


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
                    this._cursors[from] = new SharedCursor({model: this.peers.get(from)});
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