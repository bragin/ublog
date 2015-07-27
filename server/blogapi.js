"use strict";

// This API eventually will become DB-agnostic, however right now it's tied to Redis DB
var nconf = require('nconf');
var redis = require('redis');

var rclient;


// Establish connection to the db
function init() {
	close();

	var host = nconf.get('redis:host');
	var port = nconf.get('redis:port');
	var db = nconf.get('redis:db');
	if (!port) port = 6379;

	rclient = redis.createClient(port, host);

	if (db) {
		console.log('ERROR: Using Redis db number other than 0 is not supported yet!');
		redis.select(db, function () {
		});
	}

	rclient.on('error', function (err) {
		console.log('Db error: ' + err);
	});
}

// Unused atm
function close() {
	if (rclient) rclient.quit();
}

// Blog api
function getBlogInfo() {

}

// Posts api
function getPosts() {
}

function createPost() {
}

function updatePost() {
}

function deletePost() {
}

// Exported object
var blogApi = {
	init: init,
	close: close,
	getBlogInfo: getBlogInfo,
	getPosts: getPosts,
	createPost: createPost,
	updatePost: updatePost,
	deletePost: deletePost
}
module.exports = blogApi;
