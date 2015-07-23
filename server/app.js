"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var nconf = require('nconf');
var handlebars = require('handlebars');
var relativePath = require("./relativepath");
var themes = require('./themes');

var app = express();

// For development: Serve build js/css and static files
app.use('/themes', express.static(relativePath('../themes')));
app.use('/assets', express.static(relativePath('../build')));
app.use('/', express.static(relativePath('../static')));

// Attach Express middleware
app.use(cookieSession({ keys: ['blah'] }));
app.use(bodyParser.json());
app.use(cookieParser());

// Theming
themes.init(handlebars);
themes.setTheme('casper');
var themeDefault = handlebars.compile(themes.default);

// Routing

// API requests
app.get('/api/*', function (req, res) {
	res.send('Bad API request');
});


// Login
app.get('/login', function (req, res, next) {
	res.send('Unimplemented');
});

// Show specific post
app.get('/:post', function (req, res, next) {
	res.send('Unimplemented');
});

// Catch-all handler
app.get('*', function (req, res, next) {
	var payload = {
		user: {
			name: 'placeholder' //req.session.username
		},
		config: {
			url: nconf.get('url')
		}
	};
	var title = 'UBlog';
	var footer = '<script id="payload" type="application/payload">' + JSON.stringify(payload) + '</script>' +
				'<script src="/assets/js/app.js"></script>';

	var content = 'Loading...';
	//content = React.renderToString(React.createElement(handler, props));

	var result = themeDefault({
		navigation: 'Nav',
		body: content,
		title: title,
		ublog_foot: footer
	});


	res.send(result);
});


module.exports = app;
