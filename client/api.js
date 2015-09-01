"use strict";

// This API layer is multiprotocol. XHR at the moment, with possibility of socket.io enhancement

var xhr = require('xhr');

var prot = 'xhr';

// Object containing protocol-specific implementations
var api = [];

api.xhr = {
	login: function(info, cb) {
		xhr({
			json: {
				op: 'login',
				info: info
			},
			method: 'POST',
			uri: '/api/user'
		}, function (err, resp, body) {
			if (resp.statusCode != 200)
				cb(null);
			else
				cb(body);
		})
	},
	createUser: function(info, cb) {
		xhr({
			json: {
				op: 'createUser',
				info: info
			},
			method: 'POST',
			uri: '/api/user'
		}, function (err, resp, body) {
			if (resp.statusCode != 200)
				cb(null);
			else
				cb(body);
		})
	},
	setSiteInfo: function (info, cb) {
		xhr({
			json: {
				op: 'saveInfo',
				info: info
			},
			method: 'POST',
			uri: '/api/site'
		}, function (err, resp, body) {
			if (resp.statusCode != 200)
				cb(null);
			else
				cb(body);
		})
	},
	getPosts: function (query, cb) {
		xhr({
			json: query,
			method: 'POST',
			uri: '/api/posts'
		}, function (err, resp, body) {
			if (resp.statusCode != 200)
				cb(null);
			else
				cb(body);
		})
	}
}

// Protocol independent interface
function login(info, cb) {
	api[prot].login(info, cb);
}

function createUser(user, cb) {
	api[prot].createUser(user, cb);
}

function getPosts(query, cb) {
	api[prot].getPosts(query, cb);
}

function setSiteInfo(info, cb) {
	api[prot].setSiteInfo(info, cb);
}

var blogApi = {
	login: login,
	createUser: createUser,
	getPosts: getPosts,
	setSiteInfo: setSiteInfo
}

module.exports = blogApi