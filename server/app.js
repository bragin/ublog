"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var nconf = require('nconf');
var handlebars = require('handlebars');
var relativePath = require("./relativepath");
var themes = require('./themes');
var blogApi = require('./blogapi');

var app = express();

// For development: Serve build js/css and static files
app.use('/themes', express.static(relativePath('../themes')));
app.use('/assets', express.static(relativePath('../build')));
app.use('/', express.static(relativePath('../static')));

// Attach Express middleware
app.use(cookieSession({ keys: ['blah'] }));
app.use(bodyParser.json());
app.use(cookieParser());

// Initialize blogApi
blogApi.init();

// Theming
themes.init(handlebars);
themes.setTheme('casper');
var themeDefault = handlebars.compile(themes.default);

// Routing

// API requests
app.post('/api/posts', function (req, res) {

	var params = req.body;
	try {
		params.limit = parseInt(params.limit, 10);
		if (params.limit < 1) params.limit = 1;
		if (params.limit > 10) params.limit = 10;
	} catch (e) {
		return res.status(500).send('Bad API request');
	}

	var obj = blogApi.getPosts(req.body);
	res.set('Content-Type', 'application/json');
	res.send(JSON.stringify(obj));
});

app.get('/api/*', function (req, res) {
	res.status(500).send('Bad API request');
});

// Admin / setup area
app.get('/ublog', function (req, res, next) {
	res.send('Unimplemented');
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
		body: content,
		title: title,
		ublog_foot: footer
	});


	res.send(result);
});


module.exports = app;
