'use strict';

const Boom = require('boom');
const bcrypt = require('bcrypt');
const User = require('../model/User');

function verifyUniqueUser(req, res) {
	// Try to find an entry in the datababe that matches either
	// the username or email
	User.findOne({
		$or : [
			{ email : req.payload.email },
			{ username : req.payload.username }
		]
	}, (err, user) => {
		// check if and which data field is taken and return an error
		if (user) {
			if (user.username === req.payload.username) {
				res(Boom.badRequest('Username is taken'));
			} else if (user.email === req.payload.email) {
				res(Boom.badRequest('Email is taken'));
			}
			return;
		}
		// If everything checks out, send the payload through
		// to the route handler
		res(req.payload);
	});
}


function verifyCredentials(req, res) {

	const password = req.payload.password;


	// Try to find an entry in the database, which matches either
	// the email or username
	User.findOne({
		$or : [
			{ email : req.payload.email },
			{ username : req.payload.username }
		]
	}, (err, user) => {
		if (user) {
			bcrypt.compare(password, user.password, (err, isValid) => {
				if (isValid) {
					res(User);
				} else {
					res(Boom.badRequest('Incorrect password!'));
				}
			});
		} else {
			res(Boom.badRequest('Incorrect username or email!'));
		}
	});

}


module.exports = {
	verifyUniqueUser  : verifyUniqueUser,
	verifyCredentials : verifyCredentials
};