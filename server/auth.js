"use strict";

var crypto = require('crypto'),
	async = require('async');

// Authentication related API. Coincidentally password hashes are Drupal compatible

var base64 = './0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function passwordBase64Encode(input) {
		var output = '';
		var i = 0, count = input.length;
		do {
			var value = input[i++];
			output += base64[value & 0x3f];
			if (i < count)
				value |= input[i] << 8;

			output += base64[(value >> 6) & 0x3f];
			if (i++ >= count)
				break;

			if (i < count)
				value |= input[i] << 16;

			output += base64[(value >> 12) & 0x3f];
			if (i++ >= count)
				break;
			output += base64[(value >> 18) & 0x3f];
		} while (i < count);

		return output;
	};

// Default value of count_log2 = 15
function passwordGenerateSalt(count_log2) {
	var salt = '$S$';

	// FIXME: Check count_log2 value

	// Encode count_log2 into base64
	salt += base64[count_log2];

	// 6 random bytes of salt
	salt += crypto.randomBytes(6).toString('base64');

	return salt;
};

function cryptPassword(password, storedHash) {
	// Extract the "settings" part of the string
	var settings = storedHash.substring(0, 12);
	if (settings[0] != '$' || settings[2] != '$') return;

	// Get count of log2 operations from the settings
	var log2Count = base64.indexOf(settings[3]);

	// Extract salt
	var salt = settings.substring(4, 8 + 4);

	// Calculate all these hashes
	var snp = salt + password;
	var hash = crypto.createHash('sha512').update(snp).digest('hex');
	var count = 1 << log2Count;
	var passwordHex = new Buffer(password).toString('hex');
	var newBuf;
	do {
		newBuf = new Buffer(hash + passwordHex, "hex");
		hash = crypto.createHash('sha512').update(newBuf).digest('hex');
	} while (--count > 0);

	// Convert it back to Base64 encoding
	var passHash = passwordBase64Encode(new Buffer(hash, 'hex'));

	// Prepend settings
	passHash = settings + passHash

	// Crop to 55 chars max
	if (passHash.length > 55)
		passHash = passHash.substring(0, 55);

	return passHash;
};

var auth = {
	getNewUserId: function (r, cb) {
		r.incr("globals:nextUserId", function (err, uid) {
			if (err == null)
				cb(uid);
			else
				cb(null);
		});
	},

	registerNewUser: function (r, user, rf, cb) {
		var email = user.email;
		var password = user.password;

		// Limit email to 254 chars, username to 20 chars, password to 64 chars
		password = password.trim().substring(0, 64);
		email = email.trim().substring(0, 254);
		//username = username.trim().substring(0, 20);

		// Check if user with such email exists already
		this.getUserIdByEmail(r, email, function (err, uid) {
			// Return null if user already exists
			if (uid) return cb();

			// Calculate salted password hash for this user
			var salt = passwordGenerateSalt(15);
			var passHash = cryptPassword(password, salt);

			// Register him
			this.getNewUserId(r, function (uid) {
				if (uid == null) return cb();

				if (!rf || rf == '') rf = 'direct';

				console.log('Registering new user ' + uid);

				// We've got new uid. Now try to insert. If that fails, we need to get the new uid again.
				var newUser = {
					pass: passHash,
					email: email,
					created: Math.round(+new Date() / 1000),
					rf: rf
				};

				var tx = r.multi();

				tx.hmset('user:' + uid, newUser);
				tx.hset('lookups:user.email', email, uid);

				tx.exec(function (err, res) {
					if (err)
						cb(null);
					else
						cb(uid);
				});
			});
		}.bind(this));
	},

	setUserPassword: function (r, uid, password, cb) {
		// Sanitize user-supplied password
		password = password.toString().trim().substring(0, 64);

		// Create a password hash from user-supplied password
		var settings = passwordGenerateSalt(15);
		var passHash = cryptPassword(password, settings);

		r.hset('user:' + uid, 'pass', passHash, function (err) {
			// Success, password updated!
			cb(err);
		});
	},

	getUser: function(r, uid, cb) {
		uid = parseInt(uid, 10);

		r.hgetall('user:' + uid, function (err, res) {
			if (err) {
				res.error = 'Database access error';
			}

			cb(res);
		});
	},

	getUserIdByEmail: function (r, email, cb) {
		email = email.trim().substring(0, 254);

		r.hget('lookups:user.email', email, function (err, uid) {
			cb(err, uid);
		});
	},

	/* Errors:
	   1 - Invalid data
	   2 - User not found
	   3 - Wrong password
	*/
	checkUserPassword: function (r, email, password, cb) {

		if (!email || !password) return cb(1);

		// Sanitize user-supplied data
		email = email.trim().substring(0, 254);
		password = password.toString().trim().substring(0, 64);

		auth.getUserIdByEmail(r, email, function (err, uid) {
			if (!uid) return cb(2);

			auth.getUser(r, uid, function (userObj) {
				var passHash = cryptPassword(password, userObj.pass);

				if (passHash != userObj.pass) return cb(3);

				cb(null, {
					email: userObj.email,
					created: userObj.created
				});
			});
		});
	},

	createOneTimeToken: function (redis, uid, type, data, ip, cb) {
		var token = crypto.randomBytes(32).toString('hex');

		var key = 'ott:' + token;

		var ott = {
			type: type,
			uid: uid,
			ip: ip,
			data: JSON.stringify(data)
		};

		var multi = redis.multi();
		multi.hmset(key, ott);
		multi.expire(key, 3600);

		multi.exec(function (err, res) {
			cb(token);
		});
	},

	openOneTimeToken: function (redis, token, cb) {
		// Check token length
		if (token.length != 64) {
			cb(1);
			return;
		}

		// Open it
		var key = 'ott:' + token;
		redis.hgetall(key, function (err, val) {
			if (err || !val) return cb(1);
			var data = val.data;
			if (data != null) data = JSON.parse(data);
			cb(null, val.type, val.uid, data, val.ip);
		});
	},

	destroyOneTimeToken: function (redis, token) {
		// Check token length
		if (token.length != 64) return;

		// Delete it
		var key = 'ott:' + token;
		redis.del(key);
	},

	/* err
	   0 - success
	   1 - token expired
	*/
	doConfirmation: function (token, redis, cb) {

		// Open the token
		auth.openOneTimeToken(redis, token, function (res, type, uid, data, ip) {
			if (res != null) return cb(res);

			// Perform the actual confirmation action
			var tasks = [];

			switch (type) {
				case 'XXX':
					break;
				default:
					break;
			}

			// Delete the token
			tasks.push(function (cb2) {
				auth.destroyOneTimeToken(redis, token);
				cb2(null, null);
			});

			async.series(tasks, function (err2, results) {
				// Let the caller know all is good
				cb(res);
			});
		});
	},

	generateSessionId: function () {
		var id = crypto.randomBytes(32).toString('hex');
		return id;
	}
}

module.exports = auth;
