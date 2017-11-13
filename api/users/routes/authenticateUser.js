'use strict';

const Boom = require('boom');
const User = require('../model/User');
const authenticateUserSchema = require('../schemas/authenticateUser');
const verifyCredentials = require('../utils/userFunctions').verifyCredentials;
const createToken = require('../utils/token');


module.exports = {
	method : 'POST',
	path   : '/api/users/authenticate',
	config : {
		// check the user before processing the rest of the request
		pre      : [
			{ method : verifyCredentials, assign : 'user' }
		]
		,
		handler  : (req, res) => {
			// If the users password is correct, we can issue a token.
			// If the password is wrong, the Boom error will bubble up from pre
			res({ id_token : createToken(req.pre.user) }).code(201);
		},
		validate : {
			payload: authenticateUserSchema
		}
	}
};