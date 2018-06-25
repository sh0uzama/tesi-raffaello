// Creating constants, later to be used in the windDirChart, the monthChart and the waveDirChart

const NINETY            =   "90";
const HUNDREDEIGHTY     =   "180";
const TWOHUNDREDSEVETY  =   "270";
const THREEHUNDREDSIXTY =   "360";

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

//**************************************************************************************************

// Creating the different types of charts:

var windDirChart = dc.pieChart("#wind-direction-chart");
var waveDirChart = dc.pieChart("#wave-direction-chart");
var yearChart = dc.barChart("#year-chart");
var monthChart = dc.rowChart("#month-chart");
var waveHeightChart = dc.lineChart("#wave-height-chart");
var wavePeakChart = dc.lineChart("#wave-peak-chart");
var meanWaveLenghtChart = dc.lineChart("#wave-lenght-chart");
var uwWindStrength = dc.barChart("#wind-strength-uw-chart");
var vwWindStrength = dc.barChart("#wind-strength-vw-chart");
var dirmChart = dc.lineChart("#wave-chart");

//**************************************************************************************************

//Functions for counting the number of data belonging to a certain wind direction (North-South-West-East)

function getWindDirection(d) {

    var result1 = [];

    var westEast = d.uw;
    var southNorth = d.vw;

    if (southNorth > 0) {
        result1.push(SOUTH);
    }
    else if (southNorth < 0) {
        result1.push(NORTH);
    }

    if (westEast > 0) {
        result1.push(WEST);
    }
    else if (westEast < 0) {
        result1.push(EAST);
    }

    if (result1.length === 0) {
        result1.push(NO_WIND);
    }

    return result1.join("-");

}

//**************************************************************************************************

//Function for counting the number of data belonging to a certain wave direction ([0,90] ; [90,180] ; [180,270] ; [270,360])

function getWaveDirection(d) {
    
    var result2 = [];
    
    var wavedirection = d.Dirm;
    
    if (wavedirection < 90) {
        result2.push(NINETY);
    }
    
    else if(wavedirection > 90 && wavedirection < 180) {
        result2.push(HUNDREDEIGHTY);
    }
    
    else if(wavedirection > 180 && wavedirection < 270) {
        result2.push(TWOHUNDREDSEVETY);
    }
    
    else result2.push(THREEHUNDREDSIXTY);
    
    
    return result2;
    
}

//****************************************************************************************************

// Loading the csv file for which we want to create the dashboard

d3.csv("dati.csv").then(function (data) {

    data.forEach(function (d) {

        // data coercion: from string to number
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
        d.waveDirection = getWaveDirection(d);

    });

    
//***************************************************************************************************   
    
    // Beginning data manipulation using crossfilter:
    
    var ndx = crossfilter(data);
    
//***************************************************************************************************
    
    var windDim = ndx.dimension(d => d.windDirection);
    var groupWind = windDim.group();

    const windLegend = dc.htmlLegend().container("#wind-direction-chart-legend").horizontal(false).highlightSelected(true);

    windDirChart
        .dimension(windDim)
        .group(groupWind)
        .height(350)
        .width(350)
        .legend(windLegend);

//**************************************************************************************************
    
    var waveDim = ndx.dimension(d => d.waveDirection);
    var groupWave = waveDim.group();
    
    const waveLegend = dc.htmlLegend().container("#wave-direction-chart-legend").horizontal(false).highlightSelected(true);
    
    waveDirChart
        .dimension(waveDim)
        .group(groupWave)
        .height(350)
        .width(350)
        .legend(waveLegend);
    
    
    
//**************************************************************************************************    
    
    var yearDim = ndx.dimension(d => d.yyyy);
    var groupYear = yearDim.group();

    yearChart
        .dimension(yearDim)
        .group(groupYear)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .margins({top: 10, right: 10, bottom: 30, left: 60})
        .height(400)
        .width(550);

    //yearChart.xAxis().ticks([1979, 1989, 2013, 2017]);

    
//**************************************************************************************************    
    
    var monthDim = ndx.dimension(d => d.mm);
    var groupMonth = monthDim.group();

    monthChart
        .dimension(monthDim)
        .group(groupMonth)
        .ordering(d => d.key)
        .label(d => MONTHS[d.key - 1])
        .elasticX(true)
        .height(400)
        .width(550);

//**************************************************************************************************    
    
    // Creating the reduce function, using s function closure (function that returns a function):
    
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

    
//***************************************************************************************************
    
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

    
//***************************************************************************************************
    
     var dirmGroup = dayDim.group().reduce(fieldAdd('Dirm'), fieldRemove('Dirm'), init);

    dirmChart
        .dimension(dayDim)
        .group(dirmGroup)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .elasticX(true)
        .height(400)
        .width(1200)
        .valueAccessor(p => p.value.average);
    
//***************************************************************************************************
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
    
//***************************************************************************************************   

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

//**************************************************************************************************
    
    var uwWindGroup = dayDim.group().reduce(fieldAdd('uw'), fieldRemove('uw'), init);

    uwWindStrength
        .dimension(dayDim)
        .group(uwWindGroup)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .elasticX(true)
        .elasticY(true)
        .height(400)
        .width(1200)
        .valueAccessor(p => p.value.average);
    
//**************************************************************************************************

    var vwWindGroup = dayDim.group().reduce(fieldAdd('vw'), fieldRemove('vw'), init);

    vwWindStrength
        .dimension(dayDim)
        .group(vwWindGroup)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .elasticX(true)
        .elasticY(true)
        .height(400)
        .width(1200)
        .valueAccessor(p => p.value.average);
    

    //Rendering all the charts on the web page
    dc.renderAll();

});

//**************************************************************************************************

// Creation of the reset button, I am using the switch case in order to create independence between the different reset buttons
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
        case "wave":
            chart = waveDirChart;
            break;
    }
    if (chart) {
        chart.filterAll();
        dc.redrawAll();
    }
}


//***************************************************************************************************