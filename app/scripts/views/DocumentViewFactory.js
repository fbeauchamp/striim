/*global define:true */
define(
    [
        'views/DocumentView',
        'views/Notepad',
        'views/OdfPdf'/*,
        'views/Url'*/
    ],

    function (Document, Notepad, OdfPdf/*, Url*/) {
        'use strict';

        return {
            isViewable: function (model) {
                if (!model) {
                    return false;
                }
                switch (model.get('ext')) {
                    case '.pdf':
                    /*case '.ods':
                    case '.odt':
                    case '.odp':*/
                        return true;

                }

                switch (model.get('mime')) {
                    case 'application/notepad':
                    case 'application/pdf':
                    case 'text/html':
                        return true;
                    default :
                        return false;
                }
            },
            makeView: function (opts) {
                var model = opts.model;
                if (!model)
                    return null;

                switch (model.get('ext')) {
                    case '.pdf':
                    /*case '.ods':
                    case '.odt':
                    case '.odp':*/
                        return new OdfPdf(opts);

                }

                switch (model.get('mime')) {
                    case 'application/notepad':
                        return new Notepad(opts);

                    case 'application/pdf':
                        return new OdfPdf(opts);
                    case 'text/html':
                        return new Url(opts);
                    default :
                        return null;
                }
            }
        };
    });