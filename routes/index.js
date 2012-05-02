// Load module dependencies
var Reporter = require ('../reporter').Reporter;
var exec = require ('child_process').exec;

var nextReportId = 0;
var reportReady = false;

// Render the main page
exports.index = function (req, res) {
	res.render ('index', {
		locals : {
			title: 'PlanPlus Chart Reporting Demo',
		}
	});
};

// Generate a report
exports.report = function (req, res) {
	var htmlContent;
	var format = req.body.format;
	var svgContent = req.body.svg;
	var tableContent = req.body.table;
	nextReportId ++;
	reportReady = false;

	global.reporter = new Reporter (nextReportId, format, svgContent, tableContent);
	reporter.generateReport (res);
	res.send ('' + nextReportId);
};

// Check if report is ready
exports.checkReport = function (req, res) {
	if (reportReady) {
		res.send (reportDirPath + 'report' + req.body.id + '.' + req.body.format);
	} else {
		res.send ("pending");
	}
}

exports.returnReport = function (req, res) {
	var reportPath = req.body.reportPath;
	res.download (reportPath);
}

function notifyReportReady (reportId) {
	reportReady = true;
}

function downloadReport (res, id, format) {
	//res.download (reportDirPath + 'report' + id + '.' + format, deleteReport (id, format));
}

function deleteReport (id, format) {
	var child = exec('rm ' + reportDirPath + 'report' + id + '.' + format);
}

global.downloadReport = downloadReport;
global.notifyReportReady = notifyReportReady;
