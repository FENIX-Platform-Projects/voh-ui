/*global define,console*/
define([
        'jquery',
        'text!templates/tools/voh_chart_template.html',
        'underscore'
    ],
    function ($, template, _) {

        'use strict';

        var defaultOptions = {};

        function Base_template(o) {
            $.extend(true, this, o, defaultOptions);
            return this;
        }

        Base_template.prototype.render = function (config) {

            $.extend(true, this, config);

            if (this._validateInput() === true) {
                this._initVariable();
                this._injectTemplate();
            } else {
                console.error(this.errors);
                throw new Error("FENIX Chart creator has not a valid configuration");
            }

            return this;
        };

        Base_template.prototype._injectTemplate = function () {

            this.$container.html(_.template(template)( {labels : this.labels}));
        };

        Base_template.prototype._initVariable = function () {
            this.$container = $(this.container);
        };

        Base_template.prototype._validateInput = function () {

            this.errors = {};

            if (!this.hasOwnProperty("container")) {
                this.errors.container = "'container' attribute not present";
            }

            return (Object.keys(this.errors).length === 0);
        };

        Base_template.prototype.destroy = function () {

        };

        return Base_template;
    });