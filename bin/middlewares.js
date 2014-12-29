var fs = require('fs'),
	config = require('../config'),
	serveIndex = require('serve-index'),
	finalhandler = require('finalhandler')
	serveStatic = require('serve-static'),
	rosieFile = 'Rosiefile.js',
	pathToServe = null,
	staticServer = null,
	indexServe = null,
	user = null,
	Rosie = {};

// Native middlewares
module.exports = function(app) {

	// Set port to current env or default config
	app.set('port', process.env.PORT || config.port);

	Rosie.config = config;

	// Get the path to serve in the given route
	app.use(config.mainRoute, function(req, res, next) {
		user = req.params.user;
		pathToServe	= config.path.replace(/\{\{user\}\}/, user);
		Rosie.user = user;
		Rosie.pathToServe = pathToServe;
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
			Rosie.projectDir = projectDir;

			// Check if the path is a directory
			if (projectDir &&
				fs.lstatSync(projectDir).isDirectory() &&
				fs.existsSync(rosieFullPath)) {
				try {
					require(rosieFullPath)(Rosie);
				} catch(error) {
					console.log(error);
				}
			}
		}

		next();
	})	

	// Call and configure both serverStatic and indexStatic
	.use(config.mainRoute, function(req, res, next) {
		var done = finalhandler(req, res);
		staticServer = serveStatic(pathToServe, config.serverStatic.options);
		indexServe = serveIndex(pathToServe, config.serverIndex.options);
		staticServer(req, res, function onNext(err) {
			if (err) {
				return done(err);
			} else {
				indexServe(req, res, done);
			}
		});
	})
}
