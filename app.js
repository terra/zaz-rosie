var express    = require('express'),
	serveIndex = require('serve-index'),
	serveStatic = require('serve-static'),

	app = express(),
	pathToServe = null,
	staticServer = null,
	indexServe = null;

app.use('/~:user', function(req, res, next) {
	pathToServe = '/home/' + req.params.user + '/public_html';
	staticServer = serveStatic(pathToServe, {'icons': true, index: false });
	indexServe = serveIndex(pathToServe, {'icons': true, index: false });
	next();
});

app.use('/~:user', function(req, res, next) {
	staticServer(req, res, next);
}, function(req, res, next) {
	indexServe(req, res, next);
});

app.listen(8082);