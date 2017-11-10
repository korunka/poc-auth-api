'use strict';


const Hapi = require('hapi'); // server framework
const Boom = require('boom'); // error handling
const mongoose = require('mongoose'); // ODM / object modeling
const glob = require('glob');
const path = require('path');
const config = require('./config');

// create a server with a given host and port number
const server = new Hapi.Server();
server.connection({
	host : 'localhost',
	port : 8000
});

// database setup
const dbUrl = `mongodb://${config.database.user}:${config.database.pass}@${config.database.server}:${config.database.port}/korunka-auth-api`;


server.register(require('hapi-auth-jwt'), (err) => {

	// give the authorization strategy a name and scheme
	server.auth.strategy('jwt', 'jwt', {
		key           : config.secret,
		verifyOptions : { algorithms : ['HS256'] }
	});

	// create new routes for all subdirs of the API
	glob.sync('api/**/routes/*.js', {
		root : __dirname
	}).forEach(file => {
		const route = require(path.join(__dirname, file));
		server.route(route);
	});

});



// add the first route - and keep it just for fun
server.route({
	method  : 'GET',
	path    : '/hello',
	handler : function (request, reply) {
		return reply('hello world');
	}
});


// start the server
server.start((err) => {
	if (err) {
		throw err;
	}

	// Once started, we connect to the MongoDB through Mongoose
	mongoose.connect(
		dbUrl,
		{
			useMongoClient : true,
			ssl            : true
		},
		err => {
			if (err) {
				throw err;
			}
		}
	);

	console.log('Auth server running at: ', server.info.uri);
});