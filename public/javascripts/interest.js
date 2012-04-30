var chart;
var chartCursor;
var investments = [];
var chartData = [];

// default data
investments.push({p: 10000, i: 0.05});
investments.push({p: 5000, i: 0.09});
investments.push({p: 12750, i: 0.06});

AmCharts.ready(function () {

	// hide range input on firefox and ie
	var rangeIsSupported = (document.getElementById('r0').type === "range");
	alert (rangeIsSupported);

	// initialize
	for (var i = 0; i < investments.length; i ++) {
		document.getElementById('p' + i).addEventListener('change', pChanged, false);
		document.getElementById('r' + i).addEventListener('change', rChanged, false);
		document.getElementById('i' + i).addEventListener('change', iChanged, false);
		document.getElementById('p' + i).addEventListener('blur', pChanged, false);
		document.getElementById('r' + i).addEventListener('blur', rChanged, false);
		document.getElementById('i' + i).addEventListener('blur', iChanged, false);
		document.getElementById('p' + i).addEventListener('click', pChanged, false);
		document.getElementById('r' + i).addEventListener('click', rChanged, false);
		document.getElementById('i' + i).addEventListener('click', iChanged, false);
		document.getElementById('r' + i).addEventListener('mouseup', rChanged, false);
		document.getElementById('p' + i).value = investments[i].p;
		document.getElementById('r' + i).value = investments[i].i;
		document.getElementById('i' + i).value = document.getElementById('r' + i).value;
	}
	recalculate();

	// SERIAL CHART    
	chart = new AmCharts.AmSerialChart();
//	chart.pathToImages = "../images/";
//	chart.zoomOutButton = {
//		backgroundColor: '#000000',
//		backgroundAlpha: 0.15
//	};
	chart.dataProvider = chartData;
	chart.categoryField = "date";

	// listen for "dataUpdated" event (fired when chart is rendered) and call zoomChart method when it happens
	chart.addListener("dataUpdated", zoomChart);

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
	valueAxis.axisAlpha = 0.2;
	valueAxis.dashLength = 1;
	chart.addValueAxis(valueAxis);

	// GRAPHS
	var graph;

	// Investment A
	graph = new AmCharts.AmGraph();
	graph.title = "Investment A"
	graph.valueField = "valueA";
	graph.bullet = "round";
	graph.bulletBorderColor = "#FFFFFF";
	graph.bulletBorderThickness = 2;
	graph.lineThickness = 2;
	graph.lineColor = "#3B5323";
	graph.negativeLineColor = "#3B5323";
	graph.hideBulletsCount = 50; // this makes the chart to hide bullets when there are more than 50 series in selection
	graph.dashLength = "1";
	chart.addGraph(graph);

	// Investment B
	graph = new AmCharts.AmGraph();
	graph.title = "Investment B"
	graph.valueField = "valueB";
	graph.bullet = "round";
	graph.bulletBorderColor = "#FFFFFF";
	graph.bulletBorderThickness = 2;
	graph.lineThickness = 2;
	graph.lineColor = "#b5030d";
	graph.negativeLineColor = "#b5030d";
	graph.hideBulletsCount = 50; // this makes the chart to hide bullets when there are more than 50 series in selection
	graph.dashLength = "1";
	chart.addGraph(graph);

	// Investment A
	graph = new AmCharts.AmGraph();
	graph.title = "Investment C"
	graph.valueField = "valueC";
	graph.bullet = "round";
	graph.bulletBorderColor = "#FFFFFF";
	graph.bulletBorderThickness = 2;
	graph.lineThickness = 2;
	graph.lineColor = "#495E88";
	graph.negativeLineColor = "#495E88";
	graph.hideBulletsCount = 50; // this makes the chart to hide bullets when there are more than 50 series in selection
	graph.dashLength = "1";
	chart.addGraph(graph);

	// CURSOR
	chartCursor = new AmCharts.ChartCursor();
	chartCursor.cursorPosition = "mouse";
	chart.addChartCursor(chartCursor);

	// SCROLLBAR
/*	var chartScrollbar = new AmCharts.ChartScrollbar();
	chartScrollbar.graph = graph;
	chartScrollbar.scrollbarHeight = 40;
	chartScrollbar.color = "#FFFFFF";
	chartScrollbar.autoGridCount = true;
	chart.addChartScrollbar(chartScrollbar);
*/

	// WRITE
	chart.write("chartdiv");
});

// this method is called when chart is first inited as we listen for "dataUpdated" event
function zoomChart() {
	// different zoom methods can be used - zoomToIndexes, zoomToDates, zoomToCategoryValues
	//chart.zoomToIndexes(chartData.length - 40, chartData.length - 1);
	chart.zoomToIndexes(1, chartData.length - 1);
	chart.validateNow();
}

// changes cursor mode from pan to select
function setPanSelect() {
	if (document.getElementById("rb1").checked) {
		chartCursor.pan = false;
		chartCursor.zoomable = true;
	} else {
		chartCursor.pan = true;
	}
	chart.validateNow();
}

/*
function regenerateChartData() {
	chartData.length = 0;
	generateChartData();
	chart.validateData();
	chart.write("chartdiv");
}
*/

function pChanged() {
	recalculate();
}

function rChanged() {
	recalculate();
	for (var i = 0; i < investments.length; i ++) {
		document.getElementById('i' + i).value = document.getElementById('r' + i).value;
	}
}

function iChanged() {
	for (var i = 0; i < investments.length; i ++) {
		document.getElementById('r' + i).value = document.getElementById('i' + i).value;
	}
	recalculate();
}

function recalculate() {
	var data = new Array();
	var principal, interest, firstDate, newDate, datapoints, valid;
	var value = new Array();

	valid = validateAllFields();
	if (valid == 0) return;

	firstDate = new Date();
	firstDate.setDate(firstDate.getDate() - 500);

	chartData.length = 0;
	for (var j = 0; j < 20; j++) {
		newDate = new Date(firstDate);
		newDate.setDate(newDate.getDate() + j);

		for (var i = 0; i < investments.length; i ++) {
			principal = parseFloat(investments[i].p);
			interest = parseFloat(investments[i].i);
			value[i] = principal * Math.pow(1 + interest, j);
			value[i] = Math.round(100 * value[i])/100;
		}

		chartData.push({
			date: newDate,
			valueA: value[0],
			valueB: value[1],
			valueC: value[2]
		});
	}

	if(chart) {
		chart.validateData();
	}
	generateTable();
}

function validateAllFields() {
	var field, value, valid;
	var allValid = 1;
	for (var i = 0; i < investments.length; i ++) {
		// validate principal
		field = document.getElementById('p' + i);
		value = field.value.replace(/,/, '');
		valid = isFloat(value);
		if(!valid) {
			// revert
			field.style.background = "#EDBD3E";
			allValid = 0;
		} else {
			//save
			field.value = parseFloat(value);
			investments[i].p = field.value
			field.style.background = "#FFFFFF";
		}

		// validate interest
		field = document.getElementById('i' + i);
		value = field.value.replace(/,/, '');
		valid = isFloat(value);
		if(!valid) {
			// revert
			field.style.background = "#EDBD3E";
			allValid = 0;
		} else {
			//save
			field.value = parseFloat(value);
			investments[i].i = field.value
			field.style.background = "#FFFFFF";
		}
	}

	return allValid;
}

function isFloat(value) {
	if (value == null || value == "" || isNaN(parseFloat(value)) || parseFloat(value) != value) {
		valid = 0;
	} else {
		valid = 1;
	}
	return valid;
}

function submitForm(format) {
	var svgElement, tableElement;
	svgElement = document.getElementById("chartdiv").firstChild.firstChild;
	tableElement = document.getElementById("datatable");
	document.getElementById("svg").value = new XMLSerializer().serializeToString(svgElement);
	document.getElementById("table").value = new XMLSerializer().serializeToString(tableElement);
	document.getElementById("format").value = format;
	document.forms["reportForm"].submit();
}

function generateTable() {
	var table, date;
	var value = new Array();
	var tr = new Array();
	var td = new Array();
 	table = document.getElementById("datatable");

	while(table.hasChildNodes()) {
		table.removeChild(table.firstChild);
	}

	tr[0] = document.createElement('TR');
	td[0] = document.createElement('TD');
	td[1] = document.createElement('TD');
	td[2] = document.createElement('TD');
	td[3] = document.createElement('TD');
	td[1].setAttribute("class", "inv_name_a");
	td[2].setAttribute("class", "inv_name_b");
	td[3].setAttribute("class", "inv_name_c");
	td[0].appendChild(document.createTextNode(""));
	td[1].appendChild(document.createTextNode("Investment A"));
	td[2].appendChild(document.createTextNode("Investment B"));
	td[3].appendChild(document.createTextNode("Investment C"));
	tr[0].appendChild(td[0]);
	tr[0].appendChild(td[1]);
	tr[0].appendChild(td[2]);
	tr[0].appendChild(td[3]);
	tr[0].setAttribute("class", "header");
	table.appendChild(tr[0]);

	for (var i = 0; i < chartData.length; i ++) {
		date = new Date(chartData[i].date);
		value[0] = new Number(chartData[i].valueA);
		value[1] = new Number(chartData[i].valueB);
		value[2] = new Number(chartData[i].valueC);
		value[0] = value[0].toFixed(2);
		value[1] = value[1].toFixed(2);
		value[2] = value[2].toFixed(2);

		tr[i+1] = document.createElement('TR');

		td[0] = document.createElement('TD');
		td[1] = document.createElement('TD');
		td[2] = document.createElement('TD');
		td[3] = document.createElement('TD');

		td[0].appendChild(document.createTextNode(date.toDateString()));
		td[1].appendChild(document.createTextNode(value[0]));
		td[2].appendChild(document.createTextNode(value[1]));
		td[3].appendChild(document.createTextNode(value[2]));

		tr[i+1].appendChild(td[0]);
		tr[i+1].appendChild(td[1]);
		tr[i+1].appendChild(td[2]);
		tr[i+1].appendChild(td[3]);

		if (i % 2)
			tr[i+1].setAttribute("class", "even_row");
		else
			tr[i+1].setAttribute("class", "odd_row");

		table.appendChild(tr[i+1]);
	}
}
