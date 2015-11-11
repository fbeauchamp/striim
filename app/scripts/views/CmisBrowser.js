/*global define:true */
define(
    [
        'jquery',
        'backbone',
        'mustache',
        'cmis',
        'text!templates/cmisfolder.tpl'
    ],
    //striimisgood4u

    function ($, Backbone, Mustache, cmis, cmisFolderTemplate) {
        'use strict';

        return Backbone.View.extend({
            initialize: function () {
                this.session = null;
                this.currentFolder = null;
                this.path = [];
                this.session = cmis.createSession('/alfresco/cmisbrowser');
            },
            events: {
                'click [data-cmis-type="cmis:folder"]': '_clickFolder',
                'click [data-cmis-type="up"]': '_up',
                'click [data-cmis-type="cmis:document"]': '_showDocument'
            },
            _getFolderContent: function (folderId, err, success) {
                this.session.getChildren(folderId)
                    .ok(function (docs) {
                        success(docs);
                    }).notOk(err);
            },
            _showDocument: function (e) {

                var el = e.target;
                while (el.nodeName !== 'LI') {
                    el = el.parentNode;
                }

                var name = el.innerText || el.textContent,
                    point = name.lastIndexOf('.'),
                    ext =  point >=0 ? name.substr(point) : '';

                this.trigger('choosen', {
                    ext:ext,
                    name: name,
                    id: el.getAttribute('data-cmis-object-id'),
                    link: this.session.getContentStreamURL(el.getAttribute('data-cmis-object-id'))
                });
            },
            _up: function () {
                this.path.unshift(); //current folder

                if (this.path.length){
                    this._showFolder(this.path[this.path.length - 1]);
                }
                this._showFolder();
            },
            _clickFolder: function (e) {

                this._showFolder(e.target.getAttribute('data-cmis-object-id'));
            },
            _showFolder: function (folderId) {
                var self = this;
                var parentFolderId;
                if (!folderId) {
                    folderId = this.session.defaultRepository.rootFolderId;
                    this.path = [];
                } else {
                    this.path.push(folderId);
                    if (this.path.length) {
                        parentFolderId = this.path[this.path.length - 1];
                    }
                }
                this._getFolderContent(
                    folderId,
                    function () {/*err*/},
                    function (docs) {
                        if (parentFolderId){
                            docs.objects.unshift({
                                object: {
                                    succinctProperties: {

                                        'cmis:name': '..',
                                        'cmis:objectId': parentFolderId,
                                        'cmis:baseTypeId': 'up'
                                    }
                                }
                            });
                        }
                        self.$el.html(Mustache.render(cmisFolderTemplate, docs));
                    });
            },
            render: function () {
                var self = this;

                this.session.setCredentials('admin', 'admin').loadRepositories()
                    .ok(function () {
                        self.session.defaultRepository.repositoryUrl =
                            '/alfresco' + self.session.defaultRepository.repositoryUrl.substring(self.session.defaultRepository.repositoryUrl.indexOf('/cmisbrowser'));
                        self.session.defaultRepository.rootFolderUrl =
                            '/alfresco' + self.session.defaultRepository.rootFolderUrl.substring(self.session.defaultRepository.rootFolderUrl.indexOf('/cmisbrowser'));
                        self._showFolder();
                    }).notOk(function (err) {
                        console.log(err);
                    });
                return this;
            }
        });
    });
