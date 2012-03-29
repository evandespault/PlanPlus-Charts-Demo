var fs = require('fs');
var exec = require('child_process').exec;
//var PDFDocument = require('pdfkit');
//var AmCharts = require('./public/javascripts/AmCharts');
//var doc;
var id;
var htmlFileName, pdfFileName;

Reporter = function(id) {
	this.id = id;
}

Reporter.prototype.generateReport = function(html) {
//	dataProvider.findOne( 0, function(error, data){
//		doc = new PDFDocument;
//		doc.info['Title'] = 'PDF with amChart';
//		doc.info['Author'] = 'Evan Despault';
//		doc.text(doc.info['Title']);
//		for (datapoint in data) {
//			doc.text(data[datapoint].value);
//		}
//		doc.write('public/reports/test_report.pdf');
//	})

	htmlFileName = 'public/reports/test_report' + this.id + '.html';
	pdfFileName = 'public/reports/test_report' + this.id + '.pdf';
	fs.writeFile(htmlFileName, html, function(err) {
		if(err) { throw err; }
	});

	var child = exec("./bin/wkhtmltopdf " + htmlFileName + " " + pdfFileName, function(err) {
		if(err) { throw err; }
	});
}

exports.Reporter = Reporter;
