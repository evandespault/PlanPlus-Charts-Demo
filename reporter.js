// Load module dependencies
var fs = require ('fs');
var exec = require ('child_process').exec;
var spawn = require ('child_process').spawn;
var gm = require ('gm');
var im = require ('imagemagick');
var zip = require ('node-native-zip');
var xml = require ('libxmljs');

var id, format, svg, table, htmlPath, reportPath, response;
// var svgPath, bmpPath, pngPath, htmlPath, reportPath;

// Constructor
function Reporter (id, format, svg, table) { 
	this.id = id;
	this.format = format;
	this.svg = svg;
	this.table = table;
	this.htmlPath = tempPath + 'report' + id + '.xhtml';
	this.reportPath = reportDirPath + 'report' + id + '.' + format;
	this.response = '';
}

// Generate a report
Reporter.prototype.generateReport = function (res) {
	this.response = res;
	reporter.createSvg ();
}

// PDF/DOCX step 1: Create the SVG File
Reporter.prototype.createSvg = function () {
	fs.writeFile (svgPath, this.svg, function cbCreateHtml (err) {
		if (err) throw err;

		// If successful, create the PDF or DOCX report
		if (reporter.exists (svgPath)) {
			if (reporter.format == "pdf") reporter.loadHtmlTemplate ();
			else if (reporter.format == "docx") reporter.convertSvgBmp ();
		}
		else {
			throw ('Error: Could not create ' + svgPath + ' (createSvg)');
		}
	});
}

// PDF step 2: Load the XHTML template
Reporter.prototype.loadHtmlTemplate = function () {
	var htmlContent;
	fs.readFile (htmlTemplatePath, function cbCreateHtml (err, htmlContent) {
		if (err) throw err;

		// If successful, create the XHTML report
		reporter.createHtml (htmlContent);
	});
}

// PDF step 3: Create the XHTML file
Reporter.prototype.createHtml = function (htmlContent) {
	var htmlPath = this.htmlPath;
	htmlContent = htmlContent.toString ().replace ("[SVGDATA]", "../../" + svgPath);
	htmlContent = htmlContent.replace ("[TABLEDATA]", this.table);
	fs.writeFile (htmlPath, htmlContent, function cbCreateReport (err) {
		if (err) throw err;

		// If successful, create the PDF
		if (reporter.exists (htmlPath)) reporter.createPdf ();
		else console.log ('Error: Could not create ' + htmlPath + ' (createHtml)');
	});
}

// PDF step 4: Convert the XHTML to PDF using wkhtmltopdf
Reporter.prototype.createPdf = function () {
	var response = this.response;
	var id = this.id;
	var format = this.format;
	var htmlPath = this.htmlPath;
	var reportPath = this.reportPath;
	var command =	settings.wkhtmltopdf + " " + htmlPath + " "	+ reportPath;
	exec (command, function cbReturnReport (err) {
		if (err) throw err;

		// If successful, return the report
		if (reporter.exists (reportPath)) downloadReport (response, id, format);
		else console.log ('Error: Could not create ' + reportPath + ' (createPdf)');
	});
}

// DOCX step 2: Convert the SVG chart to a BMP image
Reporter.prototype.convertSvgBmp = function () {
	var command = 'convert -size 600x400 ' + svgPath + ' ' + bmpPath;
	exec (command, function cbConvertBmpPng (err) {
		if (err) throw err;

		// If successful, convert the BMP image to a PNG image
		if (reporter.exists (bmpPath)) reporter.convertBmpPng ();
		else console.log ('Error: Could not create ' + bmpPath);
	});
}

// DOCX step 3: Convert the BMP image to a PNG image
Reporter.prototype.convertBmpPng = function () {
	var command = 'mv ' + bmpPath + ' ' + pngPath;
	exec (command, function cbReadDocTemplate (err) {
		if (err) throw err;

		// If successful, load the DOCX template
		if (reporter.exists (pngPath)) reporter.readDocTemplate ();
		else console.log ('Error: Could not create ' + pngPath);
	});
}

// DOCX step 4: Read the document template
Reporter.prototype.readDocTemplate = function () {
	var data;
	fs.readFile (docXmlTemplatePath, function cbUpdateDocTable (err, data) {
		if (err) throw err;

		// If successful, insert the table data into
		reporter.updateDocTable (data);
	});
}

// DOCX step 5: Update the document table	
Reporter.prototype.updateDocTable = function (data) {
	var xmlOutput = '';
	var xmlTable = xml.parseXmlString (this.table);
	var rows = xmlTable.root ().childNodes ();
	var rowIndex = 0;
	rows.forEach (function (row) {
		if (row.attr ('class').value () != 'header') {
			var cols = row.childNodes ();
			xmlOutput += '<w:tr w:rsidR="0010280B" w:rsidTr="00880722">';
			if (rowIndex == 0) {
				xmlOutput += '<w:trPr><w:cnfStyle w:val="000000100000" w:firstRow="0" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:oddVBand="0" w:evenVBand="0" w:oddHBand="1" w:evenHBand="0" w:firstRowFirstColumn="0" w:firstRowLastColumn="0" w:lastRowFirstColumn="0" w:lastRowLastColumn="0"/></w:trPr>';
			}
			xmlOutput += '<w:tc><w:tcPr><w:cnfStyle w:val="001000000000" w:firstRow="0" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:oddVBand="0" w:evenVBand="0" w:oddHBand="0" w:evenHBand="0" w:firstRowFirstColumn="0" w:firstRowLastColumn="0" w:lastRowFirstColumn="0" w:lastRowLastColumn="0"/><w:tcW w:w="2394" w:type="dxa"/></w:tcPr><w:p w:rsidR="0010280B" w:rsidRDefault="0010280B" w:rsidP="0010280B"><w:pPr><w:jc w:val="right"/></w:pPr><w:r><w:t>' + cols[0].text () + '</w:t></w:r></w:p></w:tc>';
			cols.shift ();
			cols.forEach (function (col) {
				xmlOutput += '<w:tc><w:tcPr><w:tcW w:w="2394" w:type="dxa"/></w:tcPr><w:p w:rsidR="0010280B" w:rsidRDefault="0010280B" w:rsidP="0010280B"><w:pPr><w:jc w:val="right"/><w:cnfStyle w:val="000000100000" w:firstRow="0" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:oddVBand="0" w:evenVBand="0" w:oddHBand="1" w:evenHBand="0" w:firstRowFirstColumn="0" w:firstRowLastColumn="0" w:lastRowFirstColumn="0" w:lastRowLastColumn="0"/></w:pPr><w:r><w:t>' + col.text () + '</w:t></w:r></w:p></w:tc>';
			rowIndex ++;
			});
			xmlOutput += '</w:tr>';
		}
	});
	var updatedData = data.toString ().replace ("[TABLEDATA]", xmlOutput); //table);

	fs.writeFile (docTemplatePath + 'word/document.xml', updatedData, function cbZipDoc () {
		reporter.zipDoc ()
	});
}

// DOCX step 6: Zip the document directory as a docx file
Reporter.prototype.zipDoc = function () {
	var archive = new zip ();
	archive.addFiles (docFiles, function cbWriteZip (err) {
			if (err) throw err;

			// If successful, write the zip file
			reporter.writeZip (archive);
	});
}
	
// DOCX step 7: Write the zipped docx
Reporter.prototype.writeZip = function (archive) {
	var response = this.response;
	var id = this.id;
	var format = this.format;
	var reportPath = this.reportPath;
	var buff = archive.toBuffer ();
	fs.writeFile (reportPath, buff, function cbReturnReport (err) {
		if (err) throw err;

		// If successful, return the report
		if (reporter.exists (reportPath)) downloadReport (response, id, format);
		else console.log ('Error: Could not create ' + reportPath);
	});
}

// Check if the given file exists
Reporter.prototype.exists = function (file) {
	try {
		if (fs.lstatSync (file).isFile ()) return true;
	}
 	catch (err) {
		return false;
	}
}

exports.Reporter = Reporter;
