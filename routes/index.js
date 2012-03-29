var Reporter = require('../reporter').Reporter;
var reporter;
var htmlContent;

exports.index = function(req, res){
	dataProvider.findOne( 0, function(error, data){
		res.render('index', { locals : {
				title: 'Rendering amCharts in HTML and PDF',
				datapoints:data
			}
		});
	});
};

exports.report = function(req, res){
	dataProvider.findOne( 0, function(error, data){
		reporter = new Reporter(0);
		htmlContent = req.body.html;
		reporter.generateReport(htmlContent);
		res.sendfile('public/reports/test_report.pdf');
	})
};
