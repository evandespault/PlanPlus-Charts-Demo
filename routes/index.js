var Reporter = require ('../reporter').Reporter;
var reporter;
var htmlContent;
var reportId = 0;

exports.index = function (req, res) {
	dataProvider.findOne (0, function (error, data) {
		res.render ('index', {
			locals : {
				title: 'Demo: Rendering Javascript charts in PDF',
				datapoints:data
			}
		});
	});
};

exports.report = function (req, res) {
	dataProvider.findOne ( reportId, function (error, data) {
		svgContent = req.body.svg;
		tableContent = req.body.table;
		reporter = new Reporter (reportId);
		reporter.generateReport (svgContent, tableContent, function () {
			res.download ('public/reports/test_report' + reportId + '.pdf', function(err) {
				if (err) next(err);
			});
		});
	})
};
