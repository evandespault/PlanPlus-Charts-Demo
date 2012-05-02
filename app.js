// Load module dependencies
var express = require ('express')
  , routes = require ('./routes');

// Create and configure the server
var app = module.exports = express.createServer ();

global.settings = {};
if (app.settings.env === 'production') {
	settings.port = process.env.PORT;
	settings.db_host = 'staff.mongohq.com';
	settings.db_port = 10070;
	settings.db_app = 'app3373805';
	settings.wkhtmltopdf = './bin/wkhtmltopdf';
} else {
	settings.port = 5000;
	settings.db_host = 'localhost';
	settings.db_port = 27017;
	settings.db_app = 'test';
	settings.wkhtmltopdf = 'wkhtmltopdf';
}
global.tempPath = 'public/temp/';
global.reportDirPath = 'public/reports/';
global.docTemplatePath = 'public/docx_template/';
global.docXmlTemplatePath = 'document.xml';
global.htmlTemplatePath = 'htmlTemplate.xhtml';
global.svgPath = 'report.svg';
global.bmpPath = tempPath + 'image.bmp';
global.pngPath = docTemplatePath + 'word/media/image1.png';

global.docFiles = [
		{ name: '[Content_Types].xml', path: docTemplatePath + '[Content_Types].xml' },
		{ name: '_rels/.rels', path: docTemplatePath + '_rels/.rels' },
		{ name: 'docProps/app.xml', path: docTemplatePath + 'docProps/app.xml' },
		{ name: 'docProps/core.xml', path: docTemplatePath + 'docProps/core.xml' },
		{ name: 'word/document.xml', path: docTemplatePath + 'word/document.xml' },
		{ name: 'word/fontTable.xml', path: docTemplatePath + 'word/fontTable.xml' },
		{ name: 'word/settings.xml', path: docTemplatePath + 'word/settings.xml' },
		{ name: 'word/styles.xml', path: docTemplatePath + 'word/styles.xml' },
		{ name: 'word/stylesWithEffects.xml', path: docTemplatePath + 'word/stylesWithEffects.xml' },
		{ name: 'word/webSettings.xml', path: docTemplatePath + 'word/webSettings.xml' },
		{ name: 'word/_rels/document.xml.rels', path: docTemplatePath + 'word/_rels/document.xml.rels' },
		{ name: 'word/media/image1.png', path: pngPath },
		{ name: 'word/theme/theme1.xml', path: docTemplatePath + 'word/theme/theme1.xml' }
]

global.TR_OPEN = '<w:tr w:rsidR="0010280B" w:rsidTr="00880722">'; 
global.TR_CLOSE = '</w:tr>';
global.TR_PROPS = '<w:trPr><w:cnfStyle w:val="000000100000" w:firstRow="0" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:oddVBand="0" w:evenVBand="0" w:oddHBand="1" w:evenHBand="0" w:firstRowFirstColumn="0" w:firstRowLastColumn="0" w:lastRowFirstColumn="0" w:lastRowLastColumn="0"/></w:trPr>';
global.TC_OPEN = '<w:tc>';
global.TC_PROPS_0 = '<w:tcPr><w:cnfStyle w:val="001000000000" w:firstRow="0" w:lastRow="0" w:firstColumn="1" w:lastColumn="0" w:oddVBand="0" w:evenVBand="0" w:oddHBand="0" w:evenHBand="0" w:firstRowFirstColumn="0" w:firstRowLastColumn="0" w:lastRowFirstColumn="0" w:lastRowLastColumn="0"/><w:tcW w:w="2394" w:type="dxa"/></w:tcPr>' + '<w:p w:rsidR="0010280B" w:rsidRDefault="0010280B" w:rsidP="0010280B"><w:pPr><w:jc w:val="right"/></w:pPr><w:r><w:t>';
global.TC_PROPS_N = '<w:tcPr><w:tcW w:w="2394" w:type="dxa"/></w:tcPr><w:p w:rsidR="0010280B" w:rsidRDefault="0010280B" w:rsidP="0010280B"><w:pPr><w:jc w:val="right"/><w:cnfStyle w:val="000000100000" w:firstRow="0" w:lastRow="0" w:firstColumn="0" w:lastColumn="0" w:oddVBand="0" w:evenVBand="0" w:oddHBand="1" w:evenHBand="0" w:firstRowFirstColumn="0" w:firstRowLastColumn="0" w:lastRowFirstColumn="0" w:lastRowLastColumn="0"/></w:pPr><w:r><w:t>';
global.TC_CLOSE = '</w:t></w:r></w:p></w:tc>'; 

app.configure (function () {
  app.set ('views', __dirname + '/views');
  app.set ('view engine', 'jade');
  app.use (express.bodyParser ());
  app.use (express.methodOverride ());
  app.use (app.router);
  app.use (express.static (__dirname + '/public'));
});

app.configure('development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
  app.use(express.errorHandler());
});

// Establish routes
app.get('/', routes.index);
app.post('/report', routes.report);
app.post('/checkReport', routes.checkReport);
app.post('/returnReport', routes.returnReport);

// Start listening
app.listen(settings.port);
console.log('Server listening on port %d in %s mode', app.address().port, app.settings.env);
console.log('settings - port: ' + settings.port + ', db_port: ' + settings.db_port + ', db_host: ' + settings.db_host);
console.log('ENV: ' + process.env.ENVIRONMENT);
