// CREATING CONSTANTS LATER TO BE USED IN THE MONTH CHART, AND IN THE SUNBURST CHARTS

const interval1 = "0-40";
const interval2 = "40-80";
const interval3 = "80-120";
const interval4 = "120-160";
const interval5 = "160-200";
const interval6 = "200-240";
const interval7 = "240-280";
const interval8 = "280-320";
const interval9 = "320-360";

const NORTH = "N";
const WEST = "W";
const EAST = "E";
const SOUTH = "S";
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

const SPEED1 = "0-3";
const SPEED2 = "3-6";
const SPEED3 = "6-9";
const SPEED4 = "9-12";
const SPEED5 = "12-15";

//****************************************************************************************************************************************************

// CREATING THE DIFFERENT TYPES OF CHARTS


var yearChart = dc.barChart("#year-chart");
var monthChart = dc.rowChart("#month-chart");
var windSunburstChart = dc.sunburstChart("#wind-sunburst-chart");
var waveheightSunburstChart = dc.sunburstChart("#waveheight-sunburst-chart");
var wavepeakperiodSunburstChart = dc.sunburstChart("#wavepeakperiod-sunburst-chart");
var heatmapOne = dc.heatMap("#heatmap-number-one");
var heatmapTwo = dc.heatMap("#heatmap-number-two");

// CREATING ALL THE COMMENTED CHARTS

/*

var tableData                   = dc.dataTable("#table-chart");
var waveHeightChart           = dc.lineChart("#wave-height-chart");
var wavePeakChart             = dc.lineChart("#wave-peak-chart");
var meanWaveLenghtChart       = dc.lineChart("#wave-lenght-chart");
var uwWindStrength            = dc.barChart("#wind-strength-uw-chart");
var vwWindStrength            = dc.barChart("#wind-strength-vw-chart");
var dirmChart                 = dc.lineChart("#wave-chart");
var meanPeriodChart           = dc.lineChart("#mean-period-chart");
var peakWavePeriod            = dc.lineChart("#peak-period-chart");
var windDirChart                = dc.pieChart("#wind-direction-chart");
var waveDirChart                = dc.pieChart("#wave-direction-chart");

*/

//***************************************************************************************************************************************************

// FUNCTIONS TO BE IMPLEMENTED IN THE CHARTS

//Function for counting the number of data belonging to a certain wind direction 

function setWindDirection(d) {

    var wd = [];

    var westEast = d.uw;
    var southNorth = d.vw;

    var absWE = Math.abs(westEast);
    var absSN = Math.abs(southNorth);
    var windForce = Math.sqrt(Math.pow(absWE, 2) + Math.pow(absSN, 2));

    if (southNorth > 0) {
        wd.push(SOUTH);
    }
    else if (southNorth < 0) {
        wd.push(NORTH);
    }

    if (westEast > 0) {
        wd.push(WEST);
    }
    else if (westEast < 0) {
        wd.push(EAST);
    }

    if (wd.length === 0) {
        wd.push(NO_WIND);
    }

    d.windDirection = wd.join("-");

    if (windForce <= 3) {
        d.windSpeed = SPEED1;
    }
    else if (windForce > 3 && windForce <= 6) {
        d.windSpeed = SPEED2;
    }
    else if (windForce > 6 && windForce <= 9) {
        d.windSpeed = SPEED3;
    }
    else if (windForce > 9 && windForce <= 12) {
        d.windSpeed = SPEED4;
    }
    else if (windForce > 12) {
        d.windSpeed = SPEED5;
    }

    if (d.Hs < 1) {
        d.waveHeight = "0-1";
    }
    else if (1 < d.Hs && d.Hs < 3.5) {
        d.waveHeight = "1-3.5";
    }
    else { d.waveHeight = "High"; }

    /*            
    else if (1.5 < d.Hs && d.Hs < 3) {
        d.waveHeight = "1-2";
    }
    else if (3 < d.Hs && d.Hs < 4.5) {
        d.waveHeight = "3-4.5";
    }
    else if(4.5 < d.Hs && d.Hs < 6)  {
        d.waveHeight = "4.5-6";
    }
    else if(6 < d.Hs && d.Hs < 7.5) {
        d.waveHeight = "6-7.5";
    }
    else { d.waveHeight = "High";}

    */

    if (d.Tp < 3) {
        d.peakPeriod = "0-3";
    }
    else if (3 < d.Tp && d.Tp < 6) {
        d.peakPeriod = "3-6";
    }
    else if (6 < d.Tp && d.Tp < 9) {
        d.peakPeriod = "6-9";
    }
    else if (9 < d.Tp && d.Tp < 12) {
        d.peakPeriod = "9-12";
    }
    else { d.peakPeriod = "Long"; }

}

//Function for counting the number of data belonging to a certain wave direction ([0,90] ; [90,180] ; [180,270] ; [270,360])

function getWaveDirection(d) {

    var result2 = [];

    var wavedirection = d.Dirm;

    if (wavedirection < 40) {
        result2.push(interval1);
    }

    else if (wavedirection > 40 && wavedirection < 80) {
        result2.push(interval2);
    }

    else if (wavedirection > 80 && wavedirection < 120) {
        result2.push(interval3);
    }

    else if (wavedirection > 120 && wavedirection < 160) {
        result2.push(interval4);
    }

    else if (wavedirection > 160 && wavedirection < 200) {
        result2.push(interval5);
    }

    else if (wavedirection > 200 && wavedirection < 240) {
        result2.push(interval6);
    }

    else if (wavedirection > 240 && wavedirection < 280) {
        result2.push(interval7);
    }

    else if (wavedirection > 280 && wavedirection < 320) {
        result2.push(interval8);
    }

    else result2.push(interval9);


    return result2;

}

// Creating the reduce function, using a function closure (function that returns a function):

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
        p.average = p.count ? p.total / p.count : null;
        return p;
    }
};
var fieldRemove = function (field) {
    return function (p, v) {
        --p.count;
        p.total -= v[field];
        p.max = v[field] > p.max ? v[field] : p.max;
        p.average = p.count ? p.total / p.count : null;
        return p;
    }
};

//**************************************************************************************************************************************************

var urlParams = new URLSearchParams(window.location.search);
var coordinates = urlParams.get("coordinates");
if (!coordinates || coordinates.indexOf(";") < 0) {
    alert('Missing or wrongly typed coordinates');
}
let latLng = coordinates.split(";");
$("#coordinates").html("Coordinates for LAT: " + latLng[0] + " and LNG: " + latLng[1]);


//***************************************************************************************************************************************************

// LOADING THE CSV FILE FOR WHICH WE WANT TO CREATE THE DASHBOARD

d3.csv(coordinates + ".csv").then(function (data) {

    // Since its a csv file we need to format the data a bit.


    //var dateFormatSpecifier = '%m/%d/%Y';
    //var dateFormat = d3.timeFormat(dateFormatSpecifier);
    //var dateFormatParser = d3.timeParse(dateFormatSpecifier);
    //var numberFormat = d3.format('.2f');


    data.forEach(function (d) {

        //d.dd = dateFormatParser(d.date);
        //d.mm = d3.timeMonth(d.dd); // pre-calculate month for better performance


        // Data coercion: from string to number


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


        // Data enrichment

        setWindDirection(d);
        d.waveDirection = getWaveDirection(d);


        //d.date = new Date(d.yyyy, d.mm - 1, d.dd);
        //d.mm = d3.timeMonth(d.date);
        //d.dd = d3.timeDay(d.date);
        //d.windDirection = 
        //setWindDirection(d);
        //d.waveDirection = getWaveDirection(d);
        //d.waveHeightHs  = getNumberOfHeight(d);
        //d.intervalTp    = getInterval(d);

    });


    //***************************************************************************************************************************************************  

    // Beginning data manipulation using crossfilter:

    var ndx = crossfilter(data);

    //*************************************************************************************************************************************************** 

    // YEAR CHART (BAR-CHART)

    var yearDim = ndx.dimension(d => d.yyyy);
    var groupYear = yearDim.group();

    yearChart
        .dimension(yearDim)
        .group(groupYear)
        .x(d3.scaleBand())
        .xUnits(dc.units.ordinal)
        .elasticY(true)
        .margins({ top: 10, right: 10, bottom: 30, left: 60 })
        .height(550)
        .width(850);

    //yearChart.xAxis().ticks(10);


    //****************************************************************************************************************************************************

    // MONTH CHART (ROW-CHART)

    var monthDim = ndx.dimension(d => d.mm);
    var groupMonth = monthDim.group();

    monthChart
        .dimension(monthDim)
        .group(groupMonth)
        .ordering(d => d.key)
        .label(d => MONTHS[d.key - 1])
        .elasticX(true)
        .height(550)
        .width(850);

    //************************************************************************************************************************************************   

    // HEATMAP NUMBER 1

    var heatmap1Dim = ndx.dimension(d => [(Math.floor(d.Hs * 2)) / 2, (Math.round(d.Tp * 2)) / 2]);
    var freq1Group = heatmap1Dim.group().reduceCount();

    heatmap1Dim.filter(d => d[0] >= 0.5);

    heatmapOne
        .width(800)
        .height(800)
        .dimension(heatmap1Dim)
        .group(freq1Group)
        //.xBorderRadius(555550)
        //.yBorderRadius(555550)
        .keyAccessor(function (d) { return d.key[0]; })
        .valueAccessor(function (d) { return d.key[1]; })
        .colorAccessor(function (d) { return d.value; })
        .title(function (d) {
            return "Hs:   " + d.key[0] + "\n" +
                "Tp:  " + d.key[1] + "\n" +
                "Count: " + d.value;
        })
        //.colors(["#000066", "#000099", "#0000cc", "#0000ff", "#3333ff", "#6666ff", "#9999ff", "#ccccff", "#e6e6ff", "#ffffcc", "#ffff99", "#ffff66", "#ffff33", "#ffff00", "#ffbb33", "#ffaa00", "#ff8c1a", "#ff751a", "#ff6600", "#ff471a", "#ff3300", "#ff1a1a", "#e60000", "#cc0000", "#800000"])
        //.colors(["#cc00cc","#9900cc","#6600cc","#3300cc","#0000cc","#0033cc","#0066cc","#0099cc","#00cccc","#00cc99","#00cc66","#00cc33","#00cc00","#33cc00","#66cc00","#99cc00","#cccc00","#cc9900","#cc6600","#cc3300","#cc0000"])
        //.colors(["#000066","#000099","#0000ff","#0066ff","#3399ff","#33ccff","#66ffff","#ccffff","#99ffcc","#00ff00","#339933","#ffff00","#ffcc00","#ff9933","#ff6600","#ff5050","#ff3300","#ff0000","#cc0000","#800000"])
        .colors(["#0000b3", "#0000ff", "#3333ff", "#4d4dff", "#8080ff", "#ffeb99", "#ffe066", "#ffd633", "#ffcc00", "#e6b800", "#ff8533", "#ff751a", "#ff6600", "#ff3300", "#e62e00", "#b32400", "#990000", "#660000"])
        .calculateColorDomain()
        .on('preRedraw', function () {
            heatmapOne.calculateColorDomain();
        });

    //************************************************************************************************************************************************

    // HEATMAP NUMBER 2

    var heatmap2Dim = ndx.dimension(d => [(Math.floor(d.Hs * 2)) / 2, (Math.round(d.Dirm / 10)) * 10]);
    var freq2Group = heatmap2Dim.group().reduceCount();

    heatmap2Dim.filter(d => d[0] >= 0.5);

    heatmapTwo
        .width(800)
        .height(800)
        .dimension(heatmap2Dim)
        .group(freq2Group)
        //.xBorderRadius(555550)
        //.yBorderRadius(555550)
        .keyAccessor(function (d) { return d.key[0]; })
        .valueAccessor(function (d) { return d.key[1]; })
        .colorAccessor(function (d) { return d.value; })
        .title(function (d) {
            return "Hs:   " + d.key[0] + "\n" +
                "Dm:  " + d.key[1] + "\n" +
                "Count: " + d.value;
        })
        //.colors(["#000066", "#000099", "#0000cc", "#0000ff", "#3333ff", "#6666ff", "#9999ff", "#ccccff", "#e6e6ff", "#ffffcc", "#ffff99", "#ffff66", "#ffff33", "#ffff00", "#ffbb33", "#ffaa00", "#ff8c1a", "#ff751a", "#ff6600", "#ff471a", "#ff3300", "#ff1a1a", "#e60000", "#cc0000", "#800000"])
        .colors(["#0000b3", "#0000ff", "#3333ff", "#4d4dff", "#8080ff", "#ffeb99", "#ffe066", "#ffd633", "#ffcc00", "#e6b800", "#ff8533", "#ff751a", "#ff6600", "#ff3300", "#e62e00", "#b32400", "#990000", "#660000"])
        .calculateColorDomain()
        .on('preRedraw', function () {
            heatmapTwo.calculateColorDomain();
        });

    //**********************************************************************************************************************************************

    // SUNBURST CHARTS 1-2-3


    // 1
    var windSunburstDim = ndx.dimension(d => [d.windDirection, d.windSpeed]);
    var windSunburstGroup = windSunburstDim.group();

    windSunburstChart
        .width(800)
        .height(800)
        .radius(300)
        .innerRadius(90)
        .dimension(windSunburstDim)
        .group(windSunburstGroup)
        .legend(dc.legend().x(-3).itemHeight(14));

    var colors = {
        '0-3': '#009900',
        '3-6': '#99e699',
        '6-9': '#ffff00',
        '9-12': '#ff6600',
        '12-15': '#ff0000'
    };
    var baseGetColor = windSunburstChart.getColor;
    windSunburstChart.getColor = function (d, i) {
        if (d.depth == 2) {
            return colors[d.key];
        }
        else if (Array.isArray(d.key)) {
            var _val = d.key[1];
            return colors[_val];
        }
        return baseGetColor(d, i);
    }


    // 2
    var waveheightSunburstDim = ndx.dimension(d => [d.windDirection, d.waveHeight]);
    var waveheightSunburstGroup = waveheightSunburstDim.group();

    waveheightSunburstChart
        .width(800)
        .height(800)
        .radius(300)
        .innerRadius(90)
        .dimension(waveheightSunburstDim)
        .group(waveheightSunburstGroup)
        .legend(dc.legend().x(-3).itemHeight(14));
    //.legend(dc.legend());


    // 3
    var wavepeakperiodSunburstDim = ndx.dimension(d => [d.windDirection, d.peakPeriod]);
    var wavepeakperiodSunburstGroup = wavepeakperiodSunburstDim.group();

    wavepeakperiodSunburstChart
        .width(800)
        .height(800)
        .radius(300)
        .innerRadius(90)
        .dimension(wavepeakperiodSunburstDim)
        .group(wavepeakperiodSunburstGroup)
        .legend(dc.legend().x(-3).itemHeight(14));
    //.legend(dc.legend());


    //*************************************************************************************************************************************************

    // WIND DIRECTION CHART (PIE-CHART)

    /*
var windDim     = ndx.dimension(d => d.windDirection);
var groupWind   = windDim.group();

const windLegend = dc.htmlLegend().container("#wind-direction-chart-legend").horizontal(false).highlightSelected(true);

windDirChart
 .dimension(windDim)
 .group(groupWind)
 .height(420)
 .width(450)
 .legend(windLegend);
*/

    //*************************************************************************************************************************************************

    // WAVE DIRECTION CHART (PIE-CHART)

    /*
var waveDim     = ndx.dimension(d => d.waveDirection);
var groupWave   = waveDim.group();

const waveLegend = dc.htmlLegend().container("#wave-direction-chart-legend").horizontal(false).highlightSelected(true);

waveDirChart
 .dimension(waveDim)
 .group(groupWave)
 //.ordinalColors([ "#248f24", "#2eb82e" , "#5cd65c" , "#99e699" ])
 .height(420)
 .width(450)
 .legend(waveLegend);
*/

    //**************************************************************************************************************************************************

    // WAVE MEAN PERIOD CHART (LINE CHART)

    /*
 
var tmGroup = dayDim.group().reduce(fieldAdd('Tm'), fieldRemove('Tm'), init);

meanPeriodChart
.dimension(dayDim)
.group(tmGroup)
.x(d3.scaleBand())
.xUnits(dc.units.ordinal)
.renderArea(true)
.renderDataPoints(true)
.colors("#cc9966")
.elasticX(true)
.elasticY(true)
.xAxisLabel("Days of the month")
.height(550)
.width(1300)
.valueAccessor(p => p.value.average);
 
*/

    //**************************************************************************************************************************************************

    // WAVE PEAK PERIOD CHART (LINE CHART)

    /*
 

var tpGroup = yearDim.group().reduce(fieldAdd('Tp'), fieldRemove('Tp'), init);

peakWavePeriod
.dimension(yearDim)
.group(tpGroup)
.x(d3.scaleBand())
.xUnits(dc.units.ordinal)
.renderArea(true)
.renderDataPoints(true)
.colors("#cc9966")
.elasticY(true)
.elasticX(true)
.height(550)
.width(1300)
.valueAccessor(p => p.value.max);
 
 
*/

    //************************************************************************************************************************************************

    // WAVE-HEIGHT-CHART (LINECHART)

    /*
 
var dayDim = ndx.dimension(d => d.dd);
var whGroup = dayDim.group().reduce(fieldAdd('Hs'), fieldRemove('Hs'), init);

waveHeightChart
.dimension(dayDim)
.group(whGroup)
.x(d3.scaleBand())
.xUnits(dc.units.ordinal)
//.x(d3.scaleLinear().domain([0,32]))
.renderArea(true)
.renderDataPoints(true)
.colors("rgb(255, 102, 102)")
.elasticY(true)
.elasticX(true)
.xAxisLabel("Days of the month")
.height(550)
.width(1300)
.valueAccessor(p => p.value.average);
 
*/

    //************************************************************************************************************************************************

    // WAVE MEAN DIRECTION CHART (LINECHART)

    /*
 
var dirmGroup = dayDim.group().reduce(fieldAdd('Dirm'), fieldRemove('Dirm'), init);

dirmChart
.dimension(dayDim)
.group(dirmGroup)
.x(d3.scaleBand())
.xUnits(dc.units.ordinal)
.renderArea(true)
.renderDataPoints(true)
.elasticY(true)
.elasticX(true)
.xAxisLabel("Days of the month")
.height(550)
.width(1300)
.valueAccessor(p => p.value.average);
 
*/

    //***********************************************************************************************************************************************

    // WAVE PEAK CHART (LINECHART)

    /*
 
var wpGroup = yearDim.group().reduce(fieldAdd('Lp'), fieldRemove('Lp'), init);

wavePeakChart
.dimension(yearDim)
.group(wpGroup)
.x(d3.scaleBand())
.xUnits(dc.units.ordinal)
.renderArea(true)
.renderDataPoints(true)
.colors("rgb(0, 153, 51)")
.elasticY(true)
.elasticX(true)
.height(550)
.width(1300)
.valueAccessor(p => p.value.max);
 
*/

    //**********************************************************************************************************************************************   

    // WAVE MEAN LENGHT CHART (LINECHART)

    /*
 
var lmGroup = dayDim.group().reduce(fieldAdd('Lm'), fieldRemove('Lm'), init);

meanWaveLenghtChart
.dimension(dayDim)
.group(lmGroup)
.x(d3.scaleBand())
.xUnits(dc.units.ordinal)
.renderArea(true)
.colors("rgb(0, 153, 51)")
.renderDataPoints(true)
.elasticX(true)
.elasticY(true)
.xAxisLabel("Days of the month")
.height(550)
.width(1300)
.mouseZoomable(true)
.valueAccessor(p => p.value.average);
 
*/

    //**********************************************************************************************************************************************

    //WIND SPEED CHART (BARCHART)

    /*
 
var uwWindGroup = dayDim.group().reduce(fieldAdd('uw'), fieldRemove('uw'), init);

uwWindStrength
 .dimension(dayDim)
 .group(uwWindGroup)
 .x(d3.scaleBand())
 .xUnits(dc.units.ordinal)
 .colors("#ff944d")
 .elasticX(true)
 .elasticY(true)
 .xAxisLabel("Days of the month")
 .height(550)
 .width(1300)
 .valueAccessor(p => p.value.average);

 
var vwWindGroup = dayDim.group().reduce(fieldAdd('vw'), fieldRemove('vw'), init);

vwWindStrength
 .dimension(dayDim)
 .group(vwWindGroup)
 .x(d3.scaleBand())
 .xUnits(dc.units.ordinal)
 .colors("#ff944d")
 .elasticX(true)
 .elasticY(true)
 .xAxisLabel("Days of the month")
 .height(550)
 .width(1300)
 .valueAccessor(p => p.value.average);
 
*/

    //*********************************************************************************************************************************************** 

    // Rendering all the charts on the web page

    dc.renderAll();

});

//************************************************************************************************************************************************

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
        case "heatmap1":
            chart = hexabinHsTp;
            break;
        case "heatmap2":
            chart = hexabinHsDm;
            break;
        case "sunburst1":
            chart = windSunburstChart;
            break;
        case "sunburst2":
            chart = waveheightSunburstChart;
            break;
        case "sunburst3":
            chart = wavepeakperiodSunburstChart;
            break;
        case "wave":
            chart = waveDirChart;
            break;
        case "ALL": {
            yearChart.filterAll();
            monthChart.filterAll();
            hexabinHsTp.filterAll();
            hexabinHsDm.filterAll();
            windSunburstChart.filterAll();
            waveheightSunburstChart.filterAll();
            wavepeakperiodSunburstChart.filterAll();
            dc.redrawAll();
            return;
        }
    }
    if (chart) {
        chart.filterAll();
        dc.redrawAll();
    }
}


//***************************************************************************************************************************************************