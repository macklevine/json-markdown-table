'use strict';

var common = require('./common');
var defaults = require('./defaults');

var config = {
	settings : process.env.ENV === 'Production' ? common : defaults
};

module.exports = config;