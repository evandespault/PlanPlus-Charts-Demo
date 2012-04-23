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
	reporter.generateReport (downloadReport);

	function downloadReport () {
		res.download (settings.reportPath + 'report' + reportId + '.' + format, deleteReport);
	}

	function deleteReport () {
		var child = exec('rm ' + settings.reportPath + 'report' + reportId + '.' + format);
	}
};
