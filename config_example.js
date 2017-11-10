// This is just a template for your own config, man.
// Fill it in and call it config.js


// signing key
const key = 'secretandunguessablekeyfortestingpurposes';

// database stuff
const dbUser = 'xxx';
const dbPass = 'xxx';
const dbServer = 'xxx';
const dbPort = 12345;

module.exports = {
	secret: key,
	database: {
		user: dbUser,
		pass: dbPass,
		server: dbServer,
		port: dbPort
	}
};