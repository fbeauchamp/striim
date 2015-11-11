/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'views/DocumentView',
        'socket.io'
    ],

    function ($, Backbone, DocumentView, io) {
        'use strict';
        var TreeMirror = window.TreeMirror;
        var changes = io.connect('/cobrowsing-viewer');
        changes.on('connect', function () {
            console.log('viewer connected');
        });
        return DocumentView.extend({
            tagName: 'iframe',
            className: 'mainView',
            initialize: function () {
                console.log('init');
                var self = this;
                if (typeof TreeMirror === 'undefined') {
                    //bypass require.js, probably not a good idea
                    $.getScript('/cobrowsing/mutation-summary.js', function () {
                        $.getScript('/cobrowsing/tree-mirror.js', function () {
                            self.ready = true;
                        });
                    });
                } else {
                    self.ready = true;
                }

                changes.on('initialize', function (msg) {
                    self.clearPageAndInit(msg);
                });
                changes.on('mutation', function (msg) {
                    if (self.mirror){
                        self.mirror.applyChanged(
                            msg.removed,
                            msg.addedOrMoved,
                            msg.attributes,
                            msg.text);
                    }
                });
            },
            render: function () {
                console.log('render');
                console.log(this.$el.contents());
                changes.emit('key', this.model.get('key'));
                this.rendered = true;
                this.$el.css({width: 1024});
                this.adjust();
                return this;
            },

            clearPageAndInit: function (msg) {
                console.log('clearPageAndInit');
                var self = this;
                var doc = this.el.contentDocument || this.el.contentWindow;
                if (!this.rendered) {
                    return;
                }
                while (doc.firstChild) {
                    doc.removeChild(doc.firstChild);
                }
                this.base = msg.base;
                doc.cookie= msg.cookie;
                this.mirror = new TreeMirror(doc, {
                    createElement: function (tagName) {
                        var node;
                        if (tagName === 'SCRIPT') {
                            //script are rendered server side,
                            node = document.createElement('NO-SCRIPT');
                            node.style.display = 'none';
                            return node;
                        }

                        if (tagName === 'HEAD') {
                            node = document.createElement('HEAD');
                            node.appendChild(document.createElement('BASE'));
                            node.firstChild.href = self.base;
                            return node;
                        }


                        return null;
                    },
                    setAttribute: function (node, attrName, attribute) {
                        if (attrName.toLowerCase().substr(0, 2) === 'on' ||
                            attrName.toLowerCase() === 'http-equiv'
                            ) {
                            // no you won't try to redirect or reload a viewer
                            //console.log(attrName + ' is forbidden ');
                        } else {
                            try {
                                node.setAttribute(attrName, attribute);
                            } catch (e) {
                                //console.log(e);
                            }
                        }

                        //@todo : if attribute = src then use proxy
                        return node;
                    }
                });
                console.log('cookie');
                console.log(doc.cookie);
                this.mirror.initialize(msg.rootId, msg.children);
                $(doc).off('click');
                $(doc).off('input');
                $(doc).click(function noop(e) {
                    var id = e.target.getAttribute('__id');
                    changes.emit('click', { key: self.model.get('key'), htmlElementId: id});
                    e.preventDefault();
                });

                $(doc).on('input', 'input', function (e) {
                    var val = e.target.value;
                    var id = e.target.getAttribute('__id');
                    changes.emit('input', {  key: self.model.get('key'), htmlElementId: id, val: val});

                });

                $(doc).on('img','error', function(){
                    console.log('error loading ');
                });
                $(doc).on('form' , 'submit', function(e){
                    e.preventDefault();
                });
                console.log('initialize done');
            }

        });
    });
