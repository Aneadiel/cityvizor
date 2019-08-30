import http from "http";
import express from "express";

import config from "./config";

export async function startServer() {

	/* SET UP ROUTING */
	var app = express();

	/* CORS FOR DEVELOPMENT */
	if (config.cors.enabled) {
		const cors = (await import("cors")).default;
		app.use(cors(config.cors));
		console.log("[SERVER] CORS enabled" + (config.cors.origin ? " for origin " + config.cors.origin : ""));
	}

	// polyfill before express allows for async middleware
	await import('express-async-errors');

	if (config.server.compression) {
		var compression = await import('compression');
		app.use(compression());
	}

	// parse body
	const bodyParser = await import("body-parser");
	app.use(bodyParser.json({})); // support json encoded bodies
	app.use(bodyParser.urlencoded({
		extended: true,
		limit: "10000kb"
	})); // support urlencoded bodies

	/* AUTHENTICATION */
	const jwt = (await import('express-jwt')).default;
	app.use(jwt(config.jwt), (err, req, res, next) => (err.code === 'invalid_token') ? next() : next(err));

	/* ACCESS CONTROL */
	var acl = await import("express-dynacl");
	var aclOptions = {
		roles: config.acl.roles,
		defaultRoles: ["guest"],
		userRoles: ["user"],
		logConsole: true
	}
	acl.config(aclOptions);

	/* ROUTING */
	app.use((await import("./routers")).router);

	// error handling
	app.use((await import("./middleware/error-handler")).errorHandler);


	/* SET UP SERVER */
	let host = config.server.host || "127.0.0.1";
	let port = config.server.port || 80;

	http.createServer(app).listen(port, host, function () {
		console.log('[SERVER] Listening on ' + host + ':' + port + '!');
	});
}