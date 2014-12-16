var express    = require('express'),
	serveIndex = require('serve-index'),
	serveStatic = require('serve-static'),
	config = require('./config'),

	app = express(),
	pathToServe = null,
	staticServer = null,
	indexServe = null;

// Set port to current env or default config
app.set('port', process.env.PORT || config.port);

// Get the path to serve in the given route 
// and configure serverStatic and indexStatic
app.use(config.mainRoute, function(req, res, next) {
	pathToServe	= config.path.replace(/\{\{user\}\}/, req.params.user);
	staticServer = serveStatic(pathToServe, config.serverStatic.options);
	indexServe = serveIndex(pathToServe, config.serverIndex.options);
	next();
})

// Call both serverStatic and indexStatic.
// Each one in a separated middleware due to headers issue
.use(config.mainRoute, function(req, res, next) {
	staticServer(req, res, next);
}, function(req, res, next) {
	indexServe(req, res, next);
})

.listen(app.get('port'), function() {
	console.log('Rosie is running on ' + config.host + ':' + app.get('port'));
});