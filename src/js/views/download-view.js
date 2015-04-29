/*global define*/
define([
    'views/base/view',
    'text!templates/download.hbs',
    'i18n!nls/download'
], function (View, template, i18nLabels) {

    'use strict';

    var DownloadView = View.extend({

        // Automatically render after initialize
        autoRender: true,

        className: 'download',

        // Save the template string in a prototype property.
        // This is overwritten with the compiled template function.
        // In the end you might want to used precompiled templates.
        template: template,

        getTemplateData: function () {
            return i18nLabels;
        }
    });

    return DownloadView;
});
