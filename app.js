// Load module dependencies
var express = require('express')
  , routes = require('./routes')
	, DataProvider = require('./dataprovider-memory').DataProvider
	, mongo = require('mongodb');

// Create and configure the server
var app = module.exports = express.createServer();

var settings = {};
if (app.settings.env === "production") {
	settings.port = process.env.PORT;
	settings.db_host = "staff.mongohq.com";
	settings.db_port = 10070;
	settings.db_app = "app3373805";
} else {
	settings.port = 5000;
	settings.db_host = "localhost";
	settings.db_port = 27017;
	settings.db_app = "test";
}

app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Connect to database
var dataProvider = new DataProvider(settings.db_host, settings.db_port, settings.db_app);
global.dataProvider = dataProvider; // naughty

// Establish routes
app.get('/', routes.index);
app.post('/report', routes.report);

// Start listening
app.listen(settings.port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
console.log("settings - port: " + settings.port + ", db_port: " + settings.db_port + ", db_host: " + settings.db_host);
console.log("ENV: " + process.env.ENVIRONMENT);
