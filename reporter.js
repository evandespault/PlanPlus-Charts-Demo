var fs = require('fs');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;
var gm = require('gm');
//var im = gm.subClass({ imageMagick: true});
var im = require('imagemagick');
var easyimg = require('easyimage');
//var zipfile = require('zipfile');
var zip = require('node-native-zip');
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

	console.log("let's get started");

	// Create svg file
	fs.writeFile(publicPath + svgFileName, svgElement, function(err) {
		if (err) throw err;
		console.log('svg file created');

		// Create xhtml file
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
			if (err) throw err;
			console.log('xhtml created');

			if(format == "pdf") {

				// Create pdf
				var child1 = exec(settings.wkhtmltopdf + " " + publicPath + htmlFileName + " "	+ publicPath + reportFileName, function(err) {
					if (err) throw err;
					console.log('pdf created');

					// Delete the temporary files
					var child2 = exec('rm ' + 'template/word/media/image1.png; ' + 'rm ' + publicPath + htmlFileName + '; ' + 'rm ' + publicPath + svgFileName, function(err) {
						if(err) throw err;
						callback();
					});
				});

			} else if(format == "docx") {

				// Convert svg to png
				//im.convert(['-size', '60x40', publicPath + svgFileName, 'template/word/media/image1.png'], function(err) {
				//convert = spawn('convert', ['-size', '600x400', publicPath + svgFileName, 'template/word/media/image1.png'], function (err) {
				 //var child9 = exec('convert -size 600x400 ' + publicPath + svgFileName + ' template/word/media/image1.bmp', function (err) {
				 var child9 = exec('convert -size 600x400 ' + publicPath + svgFileName + ' ' + publicPath + 'image1.bmp', function (err) {
//				convert.stdin.write(publicPath + svgFileName);
//				convert.stdin.end();
//				var writeStream = fs.createWriteStream('template/word/media/image1.png');
//				convert.stdout.on('data', function(data) {
//					writeStream.write(data);
//				});
//				convert.on('exit', function(code) {
//					writeStream.end();
				//});
				//child = exec('convert -size 600x400 ' + publicPath + svgFileName + ' template/word/media/image1.bmp', function(err) {
		//		gm(publicPath + svgFileName).size(function (err, size) {
												//write('template/word/media/image1.png', function (err) {
					if (err) { console.log(err); throw err;}
					console.log("converted svg to bmp " + fs.lstatSync(publicPath + 'image1.bmp').isFile());

					// Zip the document direcotry as docx
//					child = exec('cd ' + publicPath + 'template', function(err) {
//						if (err) { console.log(err); throw err; }
//						console.log("cd " + publicPath + "template");
					var child3 = exec('mv ' + publicPath + 'image1.bmp ' + publicPath + 'image1.png', function(err) {
						if (err) { console.log (err); throw err; }
						console.log("saved bmp as png " + fs.lstatSync(publicPath + 'image1.png').isFile());

						//var child4 = exec('cd template; zip -r ../' + publicPath + reportFileName + ' ' + '*; cd ..', function(err) {
//						console.log("trying " +  '(zip -r ../' + publicPath + reportFileName + ' * && cd ..)');
	//					var child4 = exec('(zip -r ../' + publicPath + reportFileName + ' *)', function(err) {
							var archive = new zip();
							archive.addFiles([
								{ name: "[Content_Types].xml", path: "template/[Content_Types].xml" },
								{ name: "_rels/.rels", path: "template/_rels/.rels" },
								{ name: "docProps/app.xml", path: "template/docProps/app.xml" },
								{ name: "docProps/core.xml", path: "template/docProps/core.xml" },
								{ name: "word/document.xml", path: "template/word/document.xml" },
								{ name: "word/fontTable.xml", path: "template/word/fontTable.xml" },
								{ name: "word/settings.xml", path: "template/word/settings.xml" },
								{ name: "word/styles.xml", path: "template/word/styles.xml" },
								{ name: "word/stylesWithEffects.xml", path: "template/word/stylesWithEffects.xml" },
								{ name: "word/webSettings.xml", path: "template/word/webSettings.xml" },
								{ name: "word/_rels/document.xml.rels", path: "template/word/_rels/document.xml.rels" },
								{ name: "word/media/image1.png", path: "public/reports/image1.png" },
								{ name: "word/theme/theme1.xml", path: "template/word/theme/theme1.xml" }
							], function (err) {

							if (err) { console.log(err); throw err; }
							//console.log("zip -r " + publicPath + reportFileName + " * " + fs.lstatSync(publicPath + reportFileName).isFile());
							var buff = archive.toBuffer();
							fs.writeFile(publicPath + reportFileName, buff, function (err) {
								if (err) { console.log (err); throw err; }
								console.log ("zipped " + fs.lstatSync(publicPath + reportFileName).isFile());
					
//							child = exec('cd ../../..', function(err) {
//								if (err) { console.log(err); throw err; }
//								console.log("cd ../../..");

								// Delete the temporary files
								var child5 = exec('rm ' + publicPath + 'image1.png; ' + 'rm ' + publicPath + htmlFileName + '; '	+ 'rm ' + publicPath + svgFileName, function(err) {
								//child = exec('rm ' + publicPath + htmlFileName + '; '	+ 'rm ' + publicPath + svgFileName, function(err) {
									if (err) { console.log(err); throw err; };
									console.log("temp files deleted");
									callback();
								});
							});
						});
					});
				});
			}
		});
	});
}

exports.Reporter = Reporter;
