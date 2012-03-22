// Module dependencies.
 
var express = require('express')
  , routes = require('./routes')
//	, PDFDocument = require('pdfkit')
	, pg = require('pg');

var port = process.env.PORT || 3000;

var dbConnectionString = "postgres://pbyaigfgdjgljt:Z4c6J5JtHK1OeXOMdFExlfJ-m6@pg60.sharedpg.heroku.com/blooming_lightning_28250" 
	, client
	, query;

console.log(dbConnectionString);

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

// Routes

app.get('/', routes.index);
//app.get('/pdf/:id', function(req, res){
//	res.send(req.params.id);
//});

// Database

client = new pg.Client(dbConnectionString);
//client.connect();
//query = client.query('CREATE TABLE chartdata (date date, value int)');
//query.on('end', function() { client.end(); });

// Start listening

app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
