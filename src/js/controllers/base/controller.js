/*global define*/
define(['chaplin',
    'views/site-view',
    'globals/State'
], function (Chaplin, SiteView, State) {
    'use strict';

    var Controller = Chaplin.Controller.extend({
        // Place your application-specific controller features here.
        beforeAction: function (params, options) {
            State.path = options.path;
            this.reuse('site', SiteView);
        }
    });

    return Controller;
});
