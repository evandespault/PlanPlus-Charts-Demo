// Module dependencies.
var express = require('express')
  , routes = require('./routes')
	, DataProvider = require('./dataprovider-memory').DataProvider
	, mongo = require('mongodb');
//	, PDFDocument = require('pdfkit');

var port = process.env.PORT || 3000;
//var dbConnectionString = 'mongodb://heroku:75912ba0d1319f1a04622f9837a6604b@staff.mongohq.com:10070/app3373805';
var dbConnectionString = 'mongodb://staff.mongohq.com:10070/app3373805';
//var dbConnectionString = 'mongodb://<user>:<password>@staff.mongohq.com:10070/app3373805';
//var dbConnectionString = 'localhost:27017/test';
var app = module.exports = express.createServer();

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

var dataProvider = new DataProvider('localhost', 27017);
global.dataProvider = dataProvider; // naughty

// Routes
app.get('/', routes.index);
app.get('/report', routes.report);
app.post('/report', routes.report);

// Start listening
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

