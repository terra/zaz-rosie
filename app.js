var express    = require('express'),
	config = require('./config'),
	app = express();

require('./bin/middlewares')(app);

app.listen(app.get('port'), function() {
	console.log('Rosie is running on ' + config.host + ':' + app.get('port'));
});