/*global define*/
define([
  'views/base/view',
  'text!templates/404.hbs'
], function(View, template) {

  'use strict';

  var HomeView = View.extend({

    // Automatically render after initialize
    autoRender: true,

    className: '404',

    // Save the template string in a prototype property.
    // This is overwritten with the compiled template function.
    // In the end you might want to used precompiled templates.
    template: template
  });

  return HomeView;
});
