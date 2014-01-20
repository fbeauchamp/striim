/*global define:true */
define(
    [
        'views/DocumentView',
        'views/Notepad',
        'views/PDF',
        'views/odf',
        'views/prezi'
    ],

    function (Document, Notepad, PFD,Odf,Prezi) {
        'use strict';

        return {
            isViewable: function (model) {
                return model && model.get('mime') != 'text/message';
            },
            makeView: function (opts) {
                var model = opts.model;
                if (!model)
                    return null;

                // try by mimetype
                switch (model.get('mime')) {
                    case 'application/notepad':
                        return new Notepad(opts);
                    case 'application/pdf':
                        return new PFD(opts);
                    case 'application/prezi':
                        return new Prezi(opts);
                        break;
                    case 'text/html': /*co browsing */
                        return new Url(opts);
                }

                // try by extension
                switch (model.get('ext')) {
                    case '.pdf':
                        return new PFD(opts);
                    case '.ods':
                    case '.odt':
                    case '.odp':
                        return new Odf(opts);

                    default :
                        return new Document(opts);
                }

            }
        };
    });