// Load module dependencies
var fs = require ('fs');
var exec = require ('child_process').exec;
var spawn = require ('child_process').spawn;
var gm = require ('gm');
var im = require ('imagemagick');
var zip = require ('node-native-zip');

var id;

Reporter = function (id) {
	this.id = id;
}

Reporter.prototype.generateReport = function (svgElement, table, format, returnReport) {
	var svgPath = 'report' + this.id + '.svg';
	var htmlPath = settings.tempPath + 'report' + this.id + '.xhtml';
	var bmpPath = settings.tempPath + 'image1.bmp';
	var pngPath = settings.templateImagePath;
	var reportPath = settings.reportPath + 'report' + this.id + '.' + format;

	// Delete any leftover temporary files
	var tempFiles = [];
	tempFiles.push (svgPath);
	tempFiles.push (htmlPath);
	tempFiles.push (reportPath);
	tempFiles.push (bmpPath);
	tempFiles.push (pngPath);
	deleteTempFiles (tempFiles, 0, function callback (err) {
		if (err) throw err;

		// If sucessful, create the SVG file
		createSvg (svgPath, svgElement, pngPath, htmlPath, reportPath, bmpPath, pngPath, table, format, returnReport);
	});
}

// Step 0: Delete any leftover temporary files
function deleteTempFiles (tempFiles, index, callback) {
	deleteIfExists (tempFiles[index], function () {
		if (++index === tempFiles.length) {
			callback ();
			return;
		}
		deleteTempFiles (tempFiles, index, callback);
	});
}

// Step 1: Create the SVG File
function createSvg (svgPath, svgElement, pngPath, htmlPath, reportPath, bmpPath, pngPath, table, format, returnReport) {
	fs.writeFile (svgPath, svgElement, function callback (err) {
		if (err) throw err;

		// If successful, create the XHTML file
		if (exists (svgPath)) {
			console.log (svgPath + ' exists');
			createHtml (svgPath, pngPath, htmlPath, reportPath, bmpPath, pngPath, table, format, returnReport);
		}
		else {
			console.log (svgPath + ' does not exist');
		}
	});
}

// Step 2: Create the XHTML file
function createHtml (svgPath, pngPath, htmlPath, reportPath, bmpPath, pngPath, table, format, returnReport) {

	var html =
			'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">'
		+ '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:svg="http://www.w3.org/2000/svg" lang="en">'
		+ '<head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'
		+ '<title>Rendering amCharts in HTML and PDF</title>'
		+ '<link rel="stylesheet" href="../stylesheets/pdfstyle.css" /></head>'
		+ '<body><div id="report">'
		+ '<h3>Projected Income</h3>'
		+ '<div id="chartDiv">'
		+ '<object data="' + svgPath + '" type="image/svg+xml" width="620px" height="420px"></object>'
		+ '</div>'
		+ table
		+ '</div></body></html>';

	fs.writeFile (htmlPath, html, function callback (err) {
		if (err) throw err;

		// If successful, create the PDF or DOCX
		if (exists (htmlPath)) {
			if (format == "pdf") createPdf (htmlPath, reportPath, returnReport);
			else if (format == "docx") createDoc (svgPath, bmpPath, pngPath, reportPath, returnReport);
		}
		else {
			console.log (htmlPath + ' was not created');
		}
	});
}

// Step 3: Create the PDF
function createPdf (htmlPath, reportPath, returnReport) {
	// Convert the XHTML to PDF using wkhtmltopdf
	var command =	settings.wkhtmltopdf + " " + htmlPath + " "	+ reportPath;
	exec (command, function callback (err) {
		if (err) throw err;

		// If successful, return
		if (exists (reportPath)) {
			returnReport ();
		}
		else {
			console.log (reportPath + ' was not created');
		}
	});
}

// Step 3: Create the DOCX
function createDoc (svgPath, bmpPath, pngPath, reportPath, returnReport) {
		if (exists (svgPath)) {
			console.log (svgPath + ' exists (createDoc)');
		} else {
			console.log (svgPath + ' does not exist (createDoc)');
		}
		if (exists (bmpPath)) {
			console.log (bmpPath + ' exists (createDoc)');
		} else {
			console.log (bmpPath + ' does not exist (createDoc)');
		}
	// Convert the SVG to BMP
	var command = 'convert -size 600x400 ' + svgPath + ' ' + bmpPath;
	exec (command, function callback (err) {
		if (err) throw err;

		// If successful, load the DOCX template
		if (exists (bmpPath)) {
			readDocTemplate (bmpPath, pngPath, reportPath, returnReport);
		}
		else {
			console.log (bmpPath + ' was not created');
		}
	});
}

// Step 4: Read the document template
function readDocTemplate (bmpPath, pngPath, reportPath, returnReport) {
	var data;
	fs.readFile ('document.xml', function (err, data) {
		updateDocTable (err, data, bmpPath, pngPath, reportPath, returnReport);
	});
}

// Update the document table	
function updateDocTable (err, data, bmpPath, pngPath, reportPath, returnReport) {
	var updatedData = data.toString ().replace ("[TABLEDATA]", ""); //table);
	fs.writeFile (settings.docTemplatePath + 'word/document.xml', data, function callback () {
		convertBmpPng (bmpPath, pngPath, reportPath, returnReport)
	});
}

// Convert bmp to png
function convertBmpPng (bmpPath, pngPath, reportPath, returnReport) {
	var command = 'mv ' + bmpPath + '	' + pngPath;
	exec (command, function callback (err) {
		if (err) throw err;

		// If successful, zip the DOCX file
		zipDoc (reportPath, returnReport);
	});
}

// Zip the document directory as a docx file
function zipDoc (reportPath, returnReport) {
	var archive = new zip ();
	archive.addFiles ([
		{ name: '[Content_Types].xml', path: settings.docTemplatePath + '[Content_Types].xml' },
		{ name: '_rels/.rels', path: settings.docTemplatePath + '_rels/.rels' },
		{ name: 'docProps/app.xml', path: settings.docTemplatePath + 'docProps/app.xml' },
		{ name: 'docProps/core.xml', path: settings.docTemplatePath + 'docProps/core.xml' },
		{ name: 'word/document.xml', path: settings.docTemplatePath + 'word/document.xml' },
		{ name: 'word/fontTable.xml', path: settings.docTemplatePath + 'word/fontTable.xml' },
		{ name: 'word/settings.xml', path: settings.docTemplatePath + 'word/settings.xml' },
		{ name: 'word/styles.xml', path: settings.docTemplatePath + 'word/styles.xml' },
		{ name: 'word/stylesWithEffects.xml', path: settings.docTemplatePath + 'word/stylesWithEffects.xml' },
		{ name: 'word/webSettings.xml', path: settings.docTemplatePath + 'word/webSettings.xml' },
		{ name: 'word/_rels/document.xml.rels', path: settings.docTemplatePath + 'word/_rels/document.xml.rels' },
		{ name: 'word/media/image1.png', path: settings.templateImagePath },
		{ name: 'word/theme/theme1.xml', path: settings.docTemplatePath + 'word/theme/theme1.xml' }
	], function (err) {
			if (err) throw err;

			// If successful, write the zip file
			writeZip (archive, reportPath, returnReport);
	});
}
	
// Write the zipped docx
function writeZip (archive, reportPath, returnReport) {
	var buff = archive.toBuffer ();
	fs.writeFile (reportPath, buff, function callback (err) {
		if (err) throw err;

		// If successful, return the report
		returnReport ();
	});
}

function deleteIfExists (file, callback) {
	var command;
	console.log ('deleting ' + file);
	if (exists (file)) {
		command = 'rm ' + file + '; ';
		exec (command, function report (err) {
			if (err) {
				console.log ('could not delete ' + file);
				throw err;
			} else {
				console.log (file + ' deleted');
			}
			callback ();
		});
	}
	else {
		console.log (file + ' does not exist');
		callback ();
	}
}

function exists (file) {
	try {
		if (fs.lstatSync (file).isFile ()) return true;
	}
 	catch (err) {
		return false;
	}
}

exports.Reporter = Reporter;
