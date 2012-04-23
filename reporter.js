// Load module dependencies
var fs = require ('fs');
var exec = require ('child_process').exec;
var spawn = require ('child_process').spawn;
var gm = require ('gm');
var im = require ('imagemagick');
var zip = require ('node-native-zip');

var id, format, svg, table;

function Reporter (id, format, svg, table) { 
				
	this.id = id;
	this.format = format;
	this.svg = svg;
	this.table = table;
}

Reporter.prototype.generateReport = function (returnReport) {

	console.log ('generateReport');
	console.log ('this.id = ' + this.id);
	console.log ('this.format = ' + this.format);
	
	// Step 0: Delete any leftover temporary files
	this.deleteTempFiles (function cbCreateSvg () {

		// If sucessful, create the SVG file
		reporter.createSvg (returnReport);
	});
}

// Step 0: Delete any leftover temporary files
Reporter.prototype.deleteTempFiles = function (cbCreateSvg) {

	console.log ('deleteTempFiles');
	console.log ('this.id = ' + this.id);
	console.log ('this.format = ' + this.format);	
	var command = 'rm report*.svg*; '
		+ 'rm ' + settings.tempPath + '*; '
		+ 'rm ' + settings.templateImagePath + '*; '
		+ 'rm ' + settings.reportPath + 'report*.*;';

//	exec (command);
	cbCreateSvg ();
}

// Step 1: Create the SVG File
Reporter.prototype.createSvg = function (returnReport) {

	console.log ('createSvg');
	console.log ('this.id = ' + this.id);
	console.log ('this.format = ' + this.format);

	var svgPath = 'report' + this.id + '.svg';
	console.log ('svgPath = ' + svgPath);

	fs.writeFile (svgPath, this.svg, function cbCreateHtml (err) {
		if (err) throw err;

		console.log ('svg is created');

		// If successful, create the XHTML file
		if (reporter.exists (svgPath)) {
			console.log (svgPath + ' exists');
			reporter.createHtml (svgPath, returnReport);
		}
		else {
			console.log (svgPath + ' does not exist');
			throw ('could not create ' + svgPath);
		}
	});
}

/*
function deleteTempFiles (tempFiles, index, callback) {
	deleteIfExists (tempFiles[index], function () {
		if (++index === tempFiles.length) {
			callback ();
			return;
		}
		deleteTempFiles (tempFiles, index, callback);
	});
}
*/

// Step 2: Create the XHTML file
Reporter.prototype.createHtml = function (svgPath, returnReport) {

	var htmlPath = 'report' + this.id + '.html';
	console.log ('htmlPath = ' + htmlPath);

	/* READ THE HTML TEMPLATE settings.htmlTemplatePath */

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
		+ this.table
		+ '</div></body></html>';

	fs.writeFile (htmlPath, html, function cbCreateReport (err) {
		if (err) throw err;

		console.log ('reporter.format = ' + reporter.format);

		// If successful, create the PDF or DOCX
		if (reporter.exists (htmlPath)) {
			if (reporter.format == "pdf") reporter.createPdf (htmlPath, returnReport);
			else if (reporter.format == "docx") reporter.createDoc (svgPath, returnReport);
		}
		else {
			console.log (htmlPath + ' was not created');
		}
	});
}

// Step 3: Create the PDF
Reporter.prototype.createPdf = function (htmlPath, returnReport) {

	var reportPath = settings.reportPath + 'report' + this.id + '.pdf';

	// Convert the XHTML to PDF using wkhtmltopdf
	var command =	settings.wkhtmltopdf + " " + htmlPath + " "	+ reportPath;
	exec (command, function cbReturnReport (err) {
		if (err) throw err;

		// If successful, return the report
		if (reporter.exists (reportPath)) {
			returnReport ();
		}
		else {
			console.log (reportPath + ' was not created');
		}
	});
}

// Step 3: Create the DOCX
Reporter.prototype.createDoc = function (svgPath, returnReport) {

	var bmpPath = settings.tempPath + 'image' + this.id + '.bmp';

	if (reporter.exists (svgPath)) {
		console.log (svgPath + ' exists (createDoc)');
	} else {
		console.log (svgPath + ' does not exist (createDoc)');
	}
	if (reporter.exists (bmpPath)) {
		console.log (bmpPath + ' exists (createDoc)');
	} else {
		console.log (bmpPath + ' does not exist (createDoc)');
	}

	// Convert the SVG to BMP
	var command = 'convert -size 600x400 ' + svgPath + ' ' + bmpPath;

	console.log (command);
	exec (command, function cbReadDocTemplate (err) {
		if (err) throw err;

		// If successful, load the DOCX template
		if (reporter.exists (bmpPath)) {
			reporter.readDocTemplate (bmpPath, returnReport);
		}
		else {
			console.log (bmpPath + ' was not created');
		}
	});
}

// Step 4: Read the document template
Reporter.prototype.readDocTemplate = function (bmpPath, returnReport) {

	var data;
	fs.readFile (settings.docXmlTemplatePath, function cbUpdateDocTable (err, data) {
		if (err) throw err;

		// If successful, insert the table data into
		reporter.updateDocTable (data, bmpPath, returnReport);
	});
}

// Update the document table	
Reporter.prototype.updateDocTable = function (data, bmpPath, returnReport) {

	var updatedData = data.toString ().replace ("[TABLEDATA]", ""); //table);
	fs.writeFile (settings.docTemplatePath + 'word/document.xml', data, function cbConvertBmpPng () {

		reporter.convertBmpPng (bmpPath, returnReport)
	});
}

// Convert bmp to png
Reporter.prototype.convertBmpPng = function (bmpPath, returnReport) {

	var pngPath = settings.templateImagePath;
	var command = 'mv ' + bmpPath + '	' + pngPath;
	exec (command, function cbZipDoc (err) {
		if (err) throw err;

		// If successful, zip the DOCX file
		reporter.zipDoc (returnReport);
	});
}

// Zip the document directory as a docx file
Reporter.prototype.zipDoc = function (returnReport) {

	var reportPath = settings.reportPath + 'report' + this.id + '.docx';
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
	], function cbWriteZip (err) {
			if (err) throw err;

			// If successful, write the zip file
			reporter.writeZip (archive, reportPath, returnReport);
	});
}
	
// Write the zipped docx
Reporter.prototype.writeZip = function (archive, reportPath, returnReport) {

	var buff = archive.toBuffer ();
	fs.writeFile (reportPath, buff, function cbReturnReport (err) {
		if (err) throw err;

		// If successful, return the report
		returnReport ();
	});
}

/*
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
*/

Reporter.prototype.exists = function (file) {
	try {
		if (fs.lstatSync (file).isFile ()) return true;
	}
 	catch (err) {
		return false;
	}
}

exports.Reporter = Reporter;
