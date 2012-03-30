var fs = require('fs');
var exec = require('child_process').exec;
var id;
var svgFileName, htmlFileName, pdfFileName;
var publicPath = 'public/reports/';

Reporter = function(id) {
	this.id = id;
}

Reporter.prototype.generateReport = function(svgElement) {
	svgFileName = 'test_report' + this.id + '.svg';
	htmlFileName = 'test_report' + this.id + '.xhtml';
	pdfFileName = 'test_report' + this.id + '.pdf';

	fs.writeFile(publicPath + svgFileName, svgElement, function(err) {
		if(err) { throw err; }
	});

	var html =
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
			+ '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:svg="http://www.w3.org/2000/svg" lang="en">'
			+ '<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
			+ '<title>Rendering amCharts in HTML and PDF</title>'
			+ '<link rel="stylesheet" href="http://localhost:5000/stylesheets/style.css" /></head><body>'
			+ '<object data="' + svgFileName + '" type="image/svg+xml" width="700px" height="500px"></object>'
			+ "</body></html>";

	fs.writeFile(publicPath + htmlFileName, html, function(err) {
		if(err) { throw err; }
	});

	var child = exec(settings.wkhtmltopdf + " "
									+ publicPath + htmlFileName + " "
									+ publicPath + pdfFileName, function(err) {
		if(err) { throw err; }
	});
}

exports.Reporter = Reporter;
