/*global define*/
define(function() {
  'use strict';

  // The routes for the application. This module returns a function.
  // `match` is match method of the Router
  return function(match) {
    match('', 'home#show');
    match('home', 'home#show');
    match('visualization/scores', 'visualization-scores#show');
    match('visualization/table', 'visualization-table#show');
    match('country', 'country#show');
    match('standards(/)(:id)', 'standards#show');
    match('*anything', '404#show');
  };
});
