// Load module dependencies
var Reporter = require ('../reporter').Reporter;
var exec = require ('child_process').exec;

// Render the main page
exports.index = function (req, res) {
	res.render ('index', {
		locals : {
			title: 'Demo: Rendering Javascript charts in PDF and DOCX',
		}
	});
};

// Generate a report
exports.report = function (req, res) {
	var htmlContent, reportId = 0;
	var format = req.body.format;
	var svgContent = req.body.svg;
	var tableContent = req.body.table;

	global.reporter = new Reporter (reportId, format, svgContent, tableContent);
	reporter.generateReport (res);
};

function downloadReport (res, id, format) {
	res.download (reportDirPath + 'report' + id + '.' + format, deleteReport (id, format));
}

function deleteReport (id, format) {
	var child = exec('rm ' + reportDirPath + 'report' + id + '.' + format);
}

global.downloadReport = downloadReport;
