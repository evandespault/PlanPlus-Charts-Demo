// Module dependencies.
 
var express = require('express')
  , routes = require('./routes')
	, mongo = require('mongoskin');
//	, PDFDocument = require('pdfkit')
//	, pg = require('pg');

var port = process.env.PORT || 3000;
mongodb://<user>:<password>@staff.mongohq.com:10070/app3373805
var dbConnectionString = 'staff.mongohq.com:10070/app3373805';
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
var conn = mongo.db(dbConnectionString);
conn.collection('chartdata').find().toArray(function(err, items) {
	if (err) throw err;
	console.log(JSON.stringify(items));
});

// Routes

app.get('/', routes.index);

//app.get('/pdf/:id', function(req, res){
//	res.send(req.params.id);
//});


// Start listening

app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
