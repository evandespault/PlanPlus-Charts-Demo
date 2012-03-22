
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Rendering amCharts in HTML and PDF' })
};
