
/*
 * GET home page.
 */

exports.pdf = function(req, res){
  res.render('pdf', { title: 'Rendering amCharts in PDF' })
};
