'use strict';

const jwt = require('jsonwebtoken');
const secret = require('../../../config').secret;

function createToken(user) {
	let scopes;
	// check if the user object passed in has admin set to true,
	// and if it has, set scopes to admin
	if (user.admin) {
		scopes = 'admin';
	}

	// sign the JWT
	return jwt.sign(
		{
			id       : user._id,
			username : user._username,
			scope    : scopes
		},
		secret,
		{
			algorithm : 'HS256',
			expiresIn : '1h'
		}
	);
}


module.exports = createToken;