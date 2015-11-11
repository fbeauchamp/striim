/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'underscore',
        'pdfjs',
        'mustache',
        'views/DocumentView',
        'text!templates/pdf.tpl'
    ],

    function ($, Backbone, _, PDFJS, Mustache, DocumentView, template) {
        'use strict';
        PDFJS.workerSrc = 'bower_components/pdf.js/build/pdf.worker.js';


        return  DocumentView.extend({
            initialize: function (opts) {
                DocumentView.prototype.initialize.call(this,opts);
                var self = this;
                this.peers = opts.peers;

                Backbone.on('share:setState', function (state) {
                    if (state.id === self.model.get('id')) {
                        console.log('event');
                        if (state.page && state.page !== self.pageNum) {
                            console.log('change page ');
                            self.pageNum = state.page;
                            self._renderPage();
                        }

                    }

                });
            },
            className: 'mainView',
            events: {
                'click .nextPage': 'next',
                'click .previousPage': 'prev',
                'click .fullscreen': 'fullscreen',
                'click .canvas': 'onDocumentClick',
                'mousemove .canvas': 'onMouseMove'
            },
            next: function (e) {
                e.preventDefault();
                if (this.pageNum >= this.pdf.pdfInfo.numPages){
                    return;
                }
                this.pageNum++;
                this._renderPage();
                Backbone.trigger('share:stateSet', {id: this.model.get('id'), page: this.pageNum});
            },
            prev: function (e) {
                e.preventDefault();
                if (this.pageNum <= 1){
                    return;
                }
                this.pageNum--;
                this._renderPage();
                Backbone.trigger('share:stateSet', {id: this.model.get('id'), page: this.pageNum});

            },
            _renderPage: function () {
                var canvas = this.$('.canvas')[0], self = this;
                if (!this.pdf){
                    return;
                }
                this.pdf.getPage(this.pageNum).then(function (page) {
                    //get native scale
                    var viewport = page.getViewport(1);
                    self.adjust();
                    var scale = Math.min(
                        self.$el.width() / viewport.width,
                        self.$el.height() / viewport.height
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
                    if (self.pageNum === self.pdf.pdfInfo.numPages) {
                        self.$('.nextPage').attr('disabled', 'disabled');
                    } else {
                        self.$('.nextPage').attr('disabled', null);
                    }

                    if (self.pageNum === 1) {
                        self.$('.previousPage').attr('disabled', 'disabled');
                    } else {
                        self.$('.previousPage').attr('disabled', null);
                    }
                });
            },
            render: function () {
                console.log(this.model.toJSON());
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
