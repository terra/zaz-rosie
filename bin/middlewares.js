var fs = require('fs'),
	config = require('../config'),
	serveIndex = require('serve-index'),
	finalhandler = require('finalhandler')
	serveStatic = require('serve-static'),
	rosieFile = 'Rosiefile.js',
	pathToServe = null,
	staticServer = null,
	indexServe = null,
	user = null;

// Native middlewares
module.exports = function(app) {

	// Set port to current env or default config
	app.set('port', process.env.PORT || config.port);

	// Get the path to serve in the given route 
	// and configure serverStatic and indexStatic
	app.use(config.mainRoute, function(req, res, next) {
		user = req.params.user;
		pathToServe	= config.path.replace(/\{\{user\}\}/, user);
		staticServer = serveStatic(pathToServe, config.serverStatic.options);
		indexServe = serveIndex(pathToServe, config.serverIndex.options);
		next();
	})

	// Dinamic run Rosifile's project
	.use(function(req, res, next) {
		var urlParts = req.path.match(/\/\~([a-z0-9\.\-_]+)(\/[a-z0-9\.\-_]+)+/i),
			lastPart = urlParts && urlParts.length ? urlParts.pop() : null,
			projectDir, rosieFullPath;
		if(lastPart) {
			projectDir = pathToServe + req.url.split('~')[1].split(user)[1];
			rosieFullPath = projectDir + '/' + rosieFile;

			// Check if the path is a directory
			if (projectDir &&
				fs.lstatSync(projectDir).isDirectory() &&
				fs.existsSync(rosieFullPath)) {
				try {
					require(rosieFullPath)();
				} catch(error) {
					console.log(error);
				}
			}
		}

		next();
	})

	// Call both serverStatic and indexStatic.
	// Each one in a separated middleware due to headers issue
	.use(config.mainRoute, function(req, res, next) {
		var done = finalhandler(req, res);
		staticServer(req, res, function onNext(err) {
			if (err) {
				return done(err);
			} else {
				indexServe(req, res, next);
			}
		});
	})
}
