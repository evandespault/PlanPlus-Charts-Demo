var fs = require('fs');
var exec = require('child_process').exec;
var id;
var htmlFileName, pdfFileName;

Reporter = function(id) {
	this.id = id;
}

Reporter.prototype.generateReport = function(html) {
	htmlFileName = 'public/reports/test_report' + this.id + '.html';
	pdfFileName = 'public/reports/test_report' + this.id + '.pdf';
	fs.writeFile(htmlFileName, html, function(err) {
		if(err) { throw err; }
	});

	var child = exec(settings.wkhtmltopdf + " " + htmlFileName + " " + pdfFileName, function(err) {
		if(err) { throw err; }
	});
}

exports.Reporter = Reporter;
