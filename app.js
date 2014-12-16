var express    = require('express'),
	serveIndex = require('serve-index'),
	serveStatic = require('serve-static'),
	config = require('./config'),

	app = express(),
	pathToServe = null,
	staticServer = null,
	indexServe = null;

app.use(config.mainRoute, function(req, res, next) {
	pathToServe	= config.path.replace(/\{\{user\}\}/, req.params.user);
	staticServer = serveStatic(pathToServe, config.serverStatic.options);
	indexServe = serveIndex(pathToServe, config.serverIndex.options);
	next();
})

.use(config.mainRoute, function(req, res, next) {
	staticServer(req, res, next);
}, function(req, res, next) {
	indexServe(req, res, next);
})

.listen(8082);