'use strict';

const bcrypt = require('bcrypt');
const Boom = require('boom');
const User = require('../model/User');
const createUserSchema = require('../schemas/createUser');
const verifyUniqueUser = require('../utils/userFunctions').verifyUniqueUser;
const createToken = require('../utils/token');

function hashPassword(password, cb) {
	// generate a salt at level 10 strength
	bcrypt.genSalt(10, (err, salt) => {
		bcrypt.hash(password, salt, (err, hash) => {
			return cb(err, hash);
		});
	});
}

module.exports = {
	method : 'POST',
	path   : '/api/users',
	config : {
		// Before the route handler runs, verify that the user is unique
		pre     : [
			{ method : verifyUniqueUser }
		],
		handler : (req, res) => {

			let user = new User();
			user.email =  req.payload.email;
			user.username =  req.payload.username;
			user.admin = false;
			hashPassword(req.payload.password, (err, hash) => {
				if (err) {
					throw Boom.badRequest(err);
				}
				user.password = hash;
				user.save((err, user) => {
					if (err) {
						throw Boom.badRequest(err);
					}
					// if the user is created and saved, issue a JWT
					res({id_token: createToken(user)}).code(201);
				});
			});

		},
		// Validate the payload against the Joi schema
		validate: {
			payload: createUserSchema
		}
	}
};