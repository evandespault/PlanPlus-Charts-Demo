var fs = require('fs');
var exec = require('child_process').exec;
var id;
var htmlFileName, pdfFileName;

Reporter = function(id) {
	this.id = id;
}

Reporter.prototype.generateReport = function(div) {
	htmlFileName = 'public/reports/test_report' + this.id + '.xhtml';
	pdfFileName = 'public/reports/test_report' + this.id + '.pdf';

	var html =
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
			+ '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:svg="http://www.w3.org/2000/svg" lang="en">'
			+ '<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
			+ '<title>Rendering amCharts in HTML and PDF</title>'
			+ '<link rel="stylesheet" href="http://localhost:5000/stylesheets/style.css" /></head><body>'
			+ div
			+ "</body></html>";

	fs.writeFile(htmlFileName, html, function(err) {
		if(err) { throw err; }
	});

	var child = exec(settings.wkhtmltopdf + " " + htmlFileName + " " + pdfFileName, function(err) {
		if(err) { throw err; }
	});
}

exports.Reporter = Reporter;
