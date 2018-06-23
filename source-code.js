const NORTH = "North";
const WEST = "West";
const EAST = "East";
const SOUTH = "South";
const NO_WIND = "No wind";

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];

var windDirChart = dc.pieChart("#wind-direction-chart");
var yearChart = dc.barChart("#year-chart");
var monthChart = dc.rowChart("#month-chart");

var waveHeightChart = dc.lineChart("#wave-height-chart");
var wavePeakChart = dc.lineChart("#wave-peak-chart");
var meanWaveLenghtChart = dc.lineChart("#wave-lenght-chart");

function getWindDirection(d) {

    var result = [];

    var westEast = d.uw;
    var southNorth = d.vw;

    if (southNorth > 0) {
        result.push(SOUTH);
    }
    else if (southNorth < 0) {
        result.push(NORTH);
    }

    if (westEast > 0) {
        result.push(WEST);
    }
    else if (westEast < 0) {
        result.push(EAST);
    }

    if (result.length === 0) {
        result.push(NO_WIND);
    }

    return result.join("-");

}

d3.csv("dati.csv").then(function (data) {

    data.forEach(function (d) {

        // data coercion
        d.Hs = +d.Hs;
        d.Tm = +d.Tm;
        d.Tp = +d.Tp;
        d.Dirm = +d.Dirm;
        d.Dirp = +d.Dirp;
        d.Sprd = +d.Sprd;
        d.Lm = +d.Lm;
        d.Lp = +d.Lp;
        d.uw = +d.uw;
        d.vw = +d.vw;
        d.dd = +d.dd;
        d.mm = +d.mm;
        d.yyyy = +d.yyyy;

        // data enrichment
        //d.date = new Date(d.yyyy, d.mm - 1, d.dd);
        d.windDirection = getWindDirection(d);

    });

    var ndx = crossfilter(data);
    //var all = ndx.groupAll();

    var windDim = ndx.dimension(d => d.windDirection);
    var groupWind = windDim.group();

    const windLegend = dc.htmlLegend().container("#wind-direction-chart-legend").horizontal(false).highlightSelected(true);

    windDirChart.dimension(windDim)
        .group(groupWind)
        .height(350)
        .width(350)
        .legend(windLegend);

    var yearDim = ndx.dimension(d => d.yyyy);
    var groupYear = yearDim.group();

    yearChart.dimension(yearDim)
        .group(groupYear)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .margins({top: 10, right: 10, bottom: 30, left: 60})
        .height(400)
        .width(550);

    //yearChart.xAxis().ticks([1979, 1989, 2013, 2017]);

    var monthDim = ndx.dimension(d => d.mm);
    var groupMonth = monthDim.group();

    monthChart.dimension(monthDim)
        .group(groupMonth)
        .ordering(d => d.key)
        .label(d => MONTHS[d.key - 1])
        .elasticX(true)
        .height(400)
        .width(550);

    var init = function (p, v) {
        return {
            count: 0,
            total: 0,
            average: 0,
            max: 0
        }
    };
    var fieldAdd = function (field) {
        return function (p, v) {
            ++p.count;
            p.total += v[field];
            p.max = v[field] > p.max ? v[field] : p.max
            p.average = p.total / p.count;
            return p;
        }
    };
    var fieldRemove = function (field) {
        return function (p, v) {
            --p.count;
            p.total -= v[field];
            p.max = v[field] > p.max ? v[field] : p.max;
            p.average = p.total / p.count;
            return p;
        }
    };

    var dayDim = ndx.dimension(d => d.dd);
    var whGroup = dayDim.group().reduce(fieldAdd('Hs'), fieldRemove('Hs'), init);

    waveHeightChart
        .dimension(dayDim)
        .group(whGroup)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        //.x(d3.scaleLinear().domain([0,32]))
        .elasticY(true)
        .elasticX(true)
        .height(400)
        .width(1200)
        .valueAccessor(p => p.value.average);

    var wpGroup = yearDim.group().reduce(fieldAdd('Lp'), fieldRemove('Lp'), init);

    wavePeakChart
        .dimension(yearDim)
        .group(wpGroup)

        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)

        .elasticY(true)
        .elasticX(true)
        .height(400)
        .width(1200)
        .valueAccessor(p => p.value.max);

    var lmGroup = dayDim.group().reduce(fieldAdd('Lm'), fieldRemove('Lm'), init);

    meanWaveLenghtChart
        .dimension(dayDim)
        .group(lmGroup)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .elasticX(true)
        .elasticY(true)
        .height(400)
        .width(1200)
        .valueAccessor(p => p.value.average);


    dc.renderAll();

});

// commento
function resetFilter(filter) {
    let chart = null;
    switch (filter) {
        case "wind":
            chart = windDirChart;
            break;
        case "year":
            chart = yearChart;
            break;
        case "month":
            chart = monthChart;
            break;
    }
    if (chart) {
        chart.filterAll();
        dc.redrawAll();
    }
}
