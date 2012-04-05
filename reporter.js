var fs = require('fs');
var exec = require('child_process').exec;
//var gm = require('gm');
//var im = gm.subClass({ imageMagick: true});
var im = require('imagemagick');
var id;
var svgFileName, htmlFileName, pdfFileName;
var publicPath = 'public/reports/';
var child;

Reporter = function(id) {
	this.id = id;
}

Reporter.prototype.generateReport = function(svgElement, table, format, callback) {
	svgFileName = 'test_report' + this.id + '.svg';
	//pngFileName = 'test_report' + this.id + '.bmp';
	pngFileName = 'test_report' + this.id + '.png';
	htmlFileName = 'test_report' + this.id + '.xhtml';
	docFileName = 'test_report' + this.id + '.docx';
	reportFileName = 'test_report' + this.id + '.' + format;

	fs.writeFile(publicPath + svgFileName, svgElement, function(err) {
		if(err) { throw err; }
	});

	var html =
				'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
			+ '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:svg="http://www.w3.org/2000/svg" lang="en">'
			+ '<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
			+ '<title>Rendering amCharts in HTML and PDF</title>'
			+ '<link rel="stylesheet" href="../stylesheets/pdfstyle.css" /></head>'
			+ '<body><div id="report">'
			+ '<h3>Projected Income</h3>'
			+ '<div id="chartDiv">'
			+ '<object data="' + svgFileName + '" type="image/svg+xml" width="620px" height="420px"></object>'
			+ '</div>'
			+ table
			+ '</div></body></html>';

	fs.writeFile(publicPath + htmlFileName, html, function(err) {
		if(err) { throw err; }
	});

	if(format == "pdf") {
		child = exec(settings.wkhtmltopdf + " "
										+ publicPath + htmlFileName + " "
										+ publicPath + reportFileName, function(err) {
			if(err) { throw err; }
			// Delete the temporary files
			child = exec('rm ' + publicPath + 'template/word/media/image1.png; '
							+ 'rm ' + publicPath + htmlFileName + '; '
							+ 'rm ' + publicPath + svgFileName, function(err) {
			if(err) throw err;
				callback();
			});
		});

	} else if(format == "docx") {

		console.log("let's get started");

		// Convert svg to png
		im.convert(['-size', '600x400', publicPath + svgFileName, publicPath + 'template/word/media/image1.png'], function(err) {
			console.log("converted svg to png");
			if (err) console.log(err);

			// Insert png into docx template directory
//			child = exec('mv ' + publicPath + pngFileName + " " + publicPath + "template/word/media/image1.png", function(err) {
	//			if (err) throw err;
				
				// Zip the document direcotry as docx
				child = exec('cd ' + publicPath + 'template; zip -r ../' + reportFileName + ' *; cd ../../..', function(err) {
					console.log("converted svg to png");
					console.log('cd ' + publicPath + 'template; zip -r ../' + reportFileName + ' *; cd ../../..');
					if (err) console.log(err);

					// Delete the temporary files
					child = exec('rm ' + publicPath + 'template/word/media/image1.png; '
									+ 'rm ' + publicPath + htmlFileName + '; '
									+ 'rm ' + publicPath + svgFileName, function(err) {
						console.log("temp files deleted");
					if(err) console.log(err);
						callback();
					});
				});
			//});
		});
	}
}

exports.Reporter = Reporter;
