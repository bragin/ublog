var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var moment = require('moment');
var relativePath = require('./relativepath');

// Create a wrapper around fs.readFileSync function for easier access
function read(filename) {
  return fs.readFileSync(path.join(relativePath('../'), filename), 'utf8');
}

var themes = {

	helpers: {
		asset: function (context, options) {
			var output = '/themes/casper/assets/' + context; // FIXME: Hardcoded for now
			return new handlebars.SafeString(output);
		},
		author: function (context, options) {
			console.log('author helper called!');
		},
		content: function (context, options) {
			console.log('content helper called!');
		},
		title: function (context, options) {
			console.log('title helper called!');
		},
		date: function (context, options) {
			// Formats a date using moment.js. Formats published_at by default but will also take a date as a parameter
			//console.log('date helper called!');
			var f = 'MMM Do, YYYY';

			return moment(context).format(f);
		},
		encode: function (context, options) {
			console.log('encode helper called!');
		},
		excerpt: function (context, options) {
			console.log('excerpt helper called!');
		},
		foreach: function (context, options) {
			console.log('foreach helper called!');
		},
		is: function (context, options) {
			console.log('is helper called!');
		},
		input_password: function (context, options) {
			console.log('input_password helper called!');
		},
		has: function (context, options) {
			console.log('has helper called!');
		},
		//navigation: function (context, options) {
			// Outputs navigation menu of static urls
			//console.log('navigation helper called!');
			//return null;
		//},
		page_url: function (context, options) {
			console.log('page_url helper called!');
		},
		pageUrl: function (context, options) {
			console.log('pageUrl helper called!');
		},
		pagination: function (context, options) {
			console.log('pagination helper called!');
		},
		tags: function (context, options) {
			console.log('tags helper called!');
		},
		plural: function (context, options) {
			console.log('plural helper called!');
		},
		url: function (context, options) {
			console.log('url helper called!');
		},
		image: function (context, options) {
			console.log('image helper called!');
		}
	},

	setTheme: function(name) {
		this.active = name;

		this.default = read('themes/' + this.active + '/default.hbs');
		//this.index = read('themes/' + this.active + '/index.hbs');
	},

	init: function(hbs) {
		// Register theme helpers
		hbs.registerHelper('asset', this.helpers.asset);
		hbs.registerHelper('author', this.helpers.author);
		hbs.registerHelper('content', this.helpers.content);
		hbs.registerHelper('title', this.helpers.title);
		hbs.registerHelper('date', this.helpers.date);
		hbs.registerHelper('encode', this.helpers.encode);
		hbs.registerHelper('excerpt', this.helpers.excerpt);
		hbs.registerHelper('foreach', this.helpers.foreach);
		hbs.registerHelper('is', this.helpers.is);
		hbs.registerHelper('input_password', this.helpers.input_password);
		hbs.registerHelper('has', this.helpers.has);
		//hbs.registerHelper('navigation', this.helpers.navigation);
		hbs.registerHelper('page_url', this.helpers.page_url);
		hbs.registerHelper('pageUrl', this.helpers.pageUrl);
		hbs.registerHelper('pagination', this.helpers.pagination);
		hbs.registerHelper('tags', this.helpers.tags);
		hbs.registerHelper('plural', this.helpers.plural);
		hbs.registerHelper('url', this.helpers.url);
		hbs.registerHelper('image', this.helpers.image);
	}
};

module.exports = themes;
