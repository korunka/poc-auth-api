'use strict';


const Hapi = require('hapi');

// create a server with a given host and port number
const server = new Hapi.Server();
server.connection({
	host : 'localhost',
	port : 8000
});

// add the first route
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

	console.log('Auth server running at: ', server.info.uri);
});