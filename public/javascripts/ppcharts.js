var chart;
var chartData = [{date: new Date(2012, 3, 1),
    price: 20
}, {
    date: new Date(2012, 3, 2),
    price: 75
}, {
    date: new Date(2012, 3, 3),
    price: 15
}, {
    date: new Date(2012, 3, 4),
    price: 75
}, {
    date: new Date(2012, 3, 5),
    price: 158
}, {
    date: new Date(2012, 3, 6),
    price: 57
}, {
    date: new Date(2012, 3, 7),
    price: 107
}, {
    date: new Date(2012, 3, 8),
    price: 89
}, {
    date: new Date(2012, 3, 9),
    price: 75
}, {
    date: new Date(2012, 3, 10),
    price: 132
}, {
    date: new Date(2012, 3, 11),
    price: 158
}, {
    date: new Date(2012, 3, 12),
    price: 56
}, {
    date: new Date(2012, 3, 13),
    price: 169
}, {
    date: new Date(2012, 3, 14),
    price: 24
}, {
    date: new Date(2012, 3, 15),
    price: 147
}];

var average = 90.4;

AmCharts.ready(function () {

    // SERIAL CHART    
    chart = new AmCharts.AmSerialChart();
    chart.pathToImages = "../amcharts/images/";
    chart.zoomOutButton = {
        backgroundColor: '#000000',
        backgroundAlpha: 0.15
    };
    chart.dataProvider = chartData;
    chart.categoryField = "date";

    // AXES
    // category
    var categoryAxis = chart.categoryAxis;
    categoryAxis.parseDates = true; // as our data is date-based, we set parseDates to true
    categoryAxis.minPeriod = "DD"; // our data is daily, so we set minPeriod to DD
    categoryAxis.dashLength = 1;
    categoryAxis.gridAlpha = 0.15;
    categoryAxis.axisColor = "#DADADA";

    // value                
    var valueAxis = new AmCharts.ValueAxis();
    valueAxis.axisColor = "#DADADA";
    valueAxis.dashLength = 1;
    valueAxis.logarithmic = true; // this line makes axis logarithmic
    chart.addValueAxis(valueAxis);

    // GUIDE for average
    var guide = new AmCharts.Guide();
    guide.value = average;
    guide.lineColor = "#CC0000";
    guide.dashLength = 4;
    guide.label = "average";
    guide.inside = true;
    guide.lineAlpha = 1;
    valueAxis.addGuide(guide);


    // GRAPH
    var graph = new AmCharts.AmGraph();
    graph.type = "smoothedLine";
    graph.bullet = "round";
    graph.bulletColor = "#FFFFFF";
    graph.bulletBorderColor = "#00BBCC";
    graph.bulletBorderThickness = 2;
    graph.bulletSize = 7;
    graph.title = "Price";
    graph.valueField = "price";
    graph.lineThickness = 2;
    graph.lineColor = "#00BBCC";
    chart.addGraph(graph);

    // CURSOR
    var chartCursor = new AmCharts.ChartCursor();
    chartCursor.cursorPosition = "mouse";
    chart.addChartCursor(chartCursor);

    // SCROLLBAR
    var chartScrollbar = new AmCharts.ChartScrollbar();
    chart.addChartScrollbar(chartScrollbar);

    // WRITE
    chart.write("chartdiv");
}
