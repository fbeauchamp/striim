/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'webodf',
        'mustache',
        'views/DocumentView',
        'views/RemoteCursor',
        'text!templates/odf.tpl'
    ],

    function ($, Backbone, odf, Mustache, DocumentView, RemoteCursor, template) {
        'use strict';


        return  DocumentView.extend({
            initialize: function (opts) {
                var self = this;
                this.peers = opts.peers;
                this._cursors = [];
                Backbone.on('share:setState', function (state) {
                    if (state.id === self.model.get('id')) {
                        console.log('event')
                        if (state.page && state.page !== self.pageNum) {
                            console.log('change page ')
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
                'click .fullscreen': 'fullscreen'
            },
            getCursor: function (from) {
                if (!this._cursors[from]) {
                    this._cursors[from] = new RemoteCursor({model: this.peers.get(from)});
                    this._cursors[from].$el.appendTo(this.$('.canvasContainer'));
                    if (this.pdf) {
                        this._cursors[from].render();
                    }
                }
                return this._cursors[from];
            },
            next: function (e) {
                e.preventDefault();
                /*if (this.pageNum >= this.pdf.pdfInfo.numPages)
                 return;*/
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
            _renderPage: function () {
                console.log('_render page ')
                if (!this.odf)
                    return;
                this.odf.showPage(this.pageNum);

            },
            render: function () {
                var self = this;

                this.$el.html(Mustache.render(template, this.model.toJSON()));
                this.odf = new odf.OdfCanvas(this.$('#odf')[0]);
                this.pageNum = 1;
                this.adjust();
                this.odf.load(this.model.get('link'));

                this.odf.addListener('statereadychange', function () {
                    self.rootElement = self.odf.odfContainer().rootElement;
                    self.initialized = true;
                    self.documentType = self.odf.odfContainer().getDocumentType(self.rootElement);
                    self.odf.fitToWidth(self.$el.width());
                    console.log('loaded');
                });

                return this;
            }
        });
    });