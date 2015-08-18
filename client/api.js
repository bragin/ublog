"use strict";

// This API layer is multiprotocol. XHR at the moment, with possibility of socket.io enhancement

var xhr = require('xhr');

var prot = 'xhr';

// Object containing protocol-specific implementations
var api = [];

api.xhr = {
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
function getPosts(query, cb) {
	api[prot].getPosts(query, cb);
}

var blogApi = {
	getPosts: getPosts
}

module.exports = blogApi