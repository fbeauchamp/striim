/*global require*/
'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        foundation: {
            deps: [
                'jquery'
            ],
            exports: 'Foundation'
        },
        'socket.io': {
            exports: 'io'
        },
        treemirror: {
            deps: [
                'mutation-summary'
            ]
        },
        pdfjs: {
            exports: 'PDFJS'
        },
        webodf: {
            exports: 'odf'
        }
    },
    //should be integrated in grunt https://github.com/yeoman/grunt-bower-requirejs
    paths: {
        text: '../bower_components/requirejs-text/text',
        jquery: '../bower_components/jquery/jquery',
        timeago: '../bower_components/jquery-timeago/jquery.timeago',
        backbone: '../bower_components/backbone/backbone',
        underscore: '../bower_components/underscore/underscore',
        foundation: '../bower_components/foundation/js/foundation',
        'socket.io': '../bower_components/socket.io-client/dist/socket.io',
        mustache: '../bower_components/mustache/mustache',
        hark: '../bower_components/hark/hark.bundle',
        webrtcadapter: 'vendor/adapter',
        pdfjs: '../bower_components/pdf.js/build/pdf',
        webodf: '../bower_components/WebODF/build/webodf',
        cmis: '../bower_components/cmis/lib/cmis',
        'superagent': '../bower_components/superagent/superagent'
    }
});

require([
    'underscore',
    'backbone',
    'jquery',
    'foundation',
    'socket.io',
    'collections/Peers',
    'views/DocumentViewFactory',
    'routes/router'
], function (_, Backbone, $, Foundation, io, Peers, DocumentViewFactory, MainRouter) {

    var peers = new Peers();
    var socket = io.connect();
    var local;

    $('body h2').text('Connecting to server');

    socket.on('connect', function () {

        var color = '';
        do {
            color = Math.floor(Math.random() * 16777215).toString(16);
        } while (parseInt(color.substr(0, 2), 16) +
            parseInt(color.substr(2, 2), 16) +
            parseInt(color.substr(4, 2), 16) > 300 /*trop clair */);

        local = peers.add({ remote: false, socket: socket,
            id: socket.socket.sessionid,
            color: '#' + color}).at(0);
        console.log('connected');

        var app = new MainRouter({
            local: local,
            peers: peers
        });

        Backbone.history.start();


    });



//Backbone is an event hub
//wire together this event hub with socket.io

    //inform other peer that I  have changed
    Backbone.on('peer:changed', function (peer) {
        var json = peer.toJSON();
        delete json.streams;
        delete json.peerconnection;
        delete json.socket;
        socket.emit('peer:change', json, function (res) {
            if (res.error) {
                console.log('server disagrees ');
                console.log(res);
                //@todo inform user add doc failed , and give a reason
                //it's a local delete, don't bother others wit it
                //@todo undo it
            }
        })
    });

    //collect any occured change
    socket.on('peer:change', function (peer) {
        //created by another peer
        delete peer.remote;
        var bbPeer = peers.get(peer.id);
        if (bbPeer && bbPeer.get('remote')) {
            delete peer.id;
            bbPeer.set(peer);
        } else {
            console.log('peer unkown or local')
        }
    });
    socket.on('peer:add', function (peer) {
        //created by another peer*
        if (peers.get(peer.id)) {
            return;
        }
        peer.remote = true;
        peer.socket = socket;
        peers.add(peer);

    });

    socket.on('peer:remove', function (peer) {
        //created by another peer
        peers.remove(peer)
    });

    Backbone.on('share:added', function (sharedDoc) {
        console.log('doc added');
        //ask other peers to add this document
        socket.emit('share:add', sharedDoc, function (res) {
            if (res.error) {
                console.log('server disagrees ');
                console.log(res);
                //@todo inform user add doc failed , and give a reason
                //it's a local delete, don't bother others wit it
                Backbone.trigger('share:delete', sharedDoc);
            } else {
                // console.log('success')
            }
        })
    });

    socket.on('share:add', function (sharedDoc) {
        //created by another peer
        Backbone.trigger('share:add', sharedDoc, {silent: true})
    });


    Backbone.on('share:removed', function (sharedDocId) {
        console.log('doc removed');
        console.log(sharedDocId);
        //ask other peers to add this document
        socket.emit('share:remove', sharedDocId, function (res) {
            if (res.error) {
                console.log('server disagrees ');
                console.log(res);
                //@todo inform user remove doc failed , and give a reason
                //it's a local add, don't bother others wit it
                Backbone.trigger('share:unremove', sharedDocId);
            } else {
                //todo can really delete the document
            }
        })
    });

    socket.on('share:remove', function (sharedDocId) {
        //created by another peer
        Backbone.trigger('share:remove', sharedDocId)
    });


    Backbone.on('share:contentSet', function (sharedDocContent) {
        //ask other peers to update their content
        socket.emit('share:setContent', sharedDocContent, function (res) {
            if (res.error) {
                //@todo inform user update  doc failed , and give a reason
                //rollback to the server controlled content
                Backbone.trigger('share:setContent', res.originalContent);
            }
        })
    });

    socket.on('share:setContent', function (sharedDoc) {
        //modified  by another peer and checked by the server
        Backbone.trigger('share:setContent', sharedDoc)
    });

    //incremental update of th content of a share
    socket.on('share:updateContent', function (sharedDoc) {
        //modified  by another peer and checked by the server
        Backbone.trigger('share:updateContent', sharedDoc)
    });


//@todo : incremental update instead of full update
//state :{id: sharedoc.id + state info : position

    Backbone.on('share:stateSet', function (state) {
        //inform other peers of content modified
        //it's just an information, it can't be forbidden
        socket.emit('share:setState', state);
    });

    socket.on('share:setState', function (state) {
        //modified  by another peer and checked by the server
        Backbone.trigger('share:setState', state)
    });

})
;
