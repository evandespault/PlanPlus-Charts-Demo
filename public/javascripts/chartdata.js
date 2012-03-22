// Module dependencies
var pg = require ('pg');

var datapoints = [];
var dbConnectionString = "postgres://woprfbtxsw:RyOVfWwm6Grt6nJ2FJ1w@ec2-23-21-144-157.compute-1.amazonaws.com/woprfbtxsw"
var query;

function get (date, fn) {
	pg.connect (dbConnectionString, function (err, client) {
		query = client.query ('SELECT * FROM chartdata WHERE date=' + date);

		query.on ('row', function (row) {
			console.log (JSON.stringify(row));
		});
	});

	if (datapoints[date]) {
		fn (null, datapoints[date]);
	} else {
		fn (new Error ("Invalid date"));
	}
}
