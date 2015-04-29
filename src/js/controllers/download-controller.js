/*global define*/
define([
    'controllers/base/controller',
    'views/download-view'
], function (Controller, DownalodView) {
    'use strict';

    var DownloadController = Controller.extend({

        show: function (params) {

            this.view = new DownalodView({
                region: 'main'
            });
        }
    });

    return DownloadController;
});
