// Module dependencies.
var express = require('express')
  , routes = require('./routes')
	, mongo = require('mongodb');
//	, PDFDocument = require('pdfkit')
//	, pg = require('pg');

var port = process.env.PORT || 3000;
//var dbConnectionString = 'mongodb://heroku:75912ba0d1319f1a04622f9837a6604b@staff.mongohq.com:10070/app3373805';
var dbConnectionString = 'localhost:27017/test';
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

console.log("Connecting to " + dbConnectionString);
var db = mongo.Db('test', new mongo.Server('localhost', 27017, {}), {});

db.open(function() {

	db.collection('chartdata', function(err, collection) {
		if (err) throw err;

		generateChartData(collection);

	});
});

// Routes

app.get('/', routes.index);

//app.get('/pdf/:id', function(req, res){
//	res.send(req.params.id);
//});


// Start listening

app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

// generate some random data, quite different range
function generateChartData(collection) {
	var firstDate = new Date();
	firstDate.setDate(firstDate.getDate() - 500);

	for (var i 	= 0; i < 500; i++) {
		var newDate = new Date(firstDate);
		newDate.setDate(newDate.getDate() + i);

		var visits = Math.round(Math.random() * 40) - 20;

		var data = {
			date: newDate,
			visits: visits
		};

		collection.insert(data, function() {
		});
	}
}
