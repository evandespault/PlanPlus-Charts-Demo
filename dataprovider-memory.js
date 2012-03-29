// Load module dependencies
var Db = require('mongodb').Db
	, Connection = require('mongodb').Connection
	, Server = require('mongodb').Server
	, BSON = require('mongodb').BSON
	, ObjectID = require('mongodb').ObjectID
	, url = require('url')
	, mongodb = require('mongodb');

// Construct data provider
DataProvider = function(host, port, app) {
	console.log("app: " + app + ", host: " + host + ", port: " + port);
//	this.db = new Db(app, new Server(host, port, {auto_reconnect: true}, {}));
//	this.db.open(function(){});
//	this.db.authenticate("evan", "evan", {});

	var dbUrl = process.env.MONGOHQ_URL || "mongodb://" + host + ":" + port + "/" + app;
	var connectionUrl = url.parse(dbUrl);
	var dbName = connectionUrl.pathname.replace(/^\//, '');

	Db.connect(dbUrl, function(error, client) {
		if (error) throw error;

		client.collectionNames(function(error, names) {
			if (error) throw error;

			var lastCollection = null;
			names.forEach(function(colData) {
				var colName = colData.name.replace(dbName + ".", '')
				lastCollection = colName;
			});

			var collection = new mongodb.Collection(client, lastCollection);
			var documents = collection.find({}, {limit:5});

			documents.count(function(error, count) {
				documents.toArray(function(error, docs) {
					if (error) throw error;

					docs.forEach(function(doc) {
						console.log(doc);
					});

					client.close();

					console.log("connected to " + dbUrl + " " + connectionUrl + " " + dbName + " " + client); 
				});
			});
		});
	});

};

DataProvider.prototype.getCollection = function(callback) {
	this.db.collection('datapoints', function(error, datapoint_collection) {
		generateChartData(datapoint_collection);
		if(error) callback(error);
		else callback(null, datapoint_collection);
	});
};

DataProvider.prototype.findAll = function(callback) {
	this.getCollection(function(error, datapoint_collection) {
		if( error ) callback(error)
		else {
			datapoint_collection.find().toArray(function(error, results) {
				if( error ) callback(error)
				else callback(null, results)
			});
		}
	});
};

DataProvider.prototype.findOne = function(id, callback) {
	this.getCollection(function(error, datapoint_collection) {
		if( error ) callback(error)
		else {
			datapoint_collection.findOne({id: id}, function(error, result) {
				if( error ) callback(error)
				else {
					callback(null, result.data)
				}
			});
		}
	});
};

DataProvider.prototype.findById = function(id, callback) {
	this.getCollection(function(error, datapoint_collection) {
		if( error ) callback(error)
		else {
			datapoint_collection.findOne({_id: datapoint_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
				if( error ) callback(error)
				else callback(null, result)
			});
		}
	});
};

DataProvider.prototype.save = function(datapoints, callback) {
	this.getCollection(function(error, article_collection) {
		if( error ) callback(error)
		else {
			if( typeof(articles.length)=="undefined")
				articles = [articles];

			for( var i =0;i< articles.length;i++ ) {
				article = articles[i];
				article.created_at = new Date();
				if( article.comments === undefined ) article.comments = [];
				for(var j =0;j< article.comments.length; j++) {
					article.comments[j].created_at = new Date();
				}
			}

			article_collection.insert(articles, function() {
				callback(null, articles);
			});
		}
	});
};

// Generate random data
function generateChartData(collection) {
	var data = new Array();
	var chartdata, datapoint, newDate, value;
	var firstDate = new Date();
	firstDate.setDate(firstDate.getDate() - 500);

	for (var i 	= 0; i < 200; i++) {
		newDate = new Date(firstDate);
		newDate.setDate(newDate.getDate() + i);

		value = Math.round(Math.random() * 40) - 20;

		datapoint = {
			date: newDate,
			value: value
		};
		data.push(datapoint);
	}

	chartdata = {
		id: 0,
		data: data
	};

	collection.remove({});
	collection.insert(chartdata, function() {
	});
}

exports.DataProvider = DataProvider;
