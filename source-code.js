// Creating constants, later to be used in the windDirChart, the monthChart and the waveDirChart

const interval1 	=   "0-40";
const interval2     =   "40-80";
const interval3     =   "80-120";
const interval4     =   "120-160";
const interval5     =   "160-200";
const interval6     =   "200-240";
const interval7     =   "240-280";
const interval8     =   "280-320";
const interval9     =   "320-360";

const NORTH     = "North";
const WEST      = "West";
const EAST      = "East";
const SOUTH     = "South";
const NO_WIND   = "No wind";

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


/*

GRAFICO PER I VENTI:

Link esempio su dc.js examples: https://dc-js.github.io/dc.js/examples/sunburst.html

Link del codice : https://github.com/dc-js/dc.js/blob/master/web/examples/sunburst.html

Link del file csv che viene utilizzato nell'esempio : https://github.com/defunctzombie/d3-examples/blob/master/box-plot/morley.csv

Vorrei creare lo stesso grafico utilizzando come anello interno le direzioni cardinali del vento, e come anello esterno creare le fascie di velocitá [ (o-2 m/s), (2-4 m/s)....] 
corrispondenti ad ogni direzione cardinale. Cosí uno puó scegliere una direzione cardinale e una fascia di velocita dei venti.


*/



//const SPEED1 = "0-3 [m/s]";
//const SPEED2 = "3-6 [m/s]";
//const SPEED3 = "6-9 [m/s]";
//const SPEED4 = "9-12 [m/s]";
//const SPEED5 = "12-15 [m/s]";



//**************************************************************************************************

// Creating the different types of charts:

var windDirChart        = dc.pieChart("#wind-direction-chart");
var waveDirChart        = dc.pieChart("#wave-direction-chart");
var yearChart           = dc.barChart("#year-chart");
var monthChart          = dc.rowChart("#month-chart");
var waveHeightChart     = dc.lineChart("#wave-height-chart");
var wavePeakChart       = dc.lineChart("#wave-peak-chart");
var meanWaveLenghtChart = dc.lineChart("#wave-lenght-chart");
var uwWindStrength      = dc.barChart("#wind-strength-uw-chart");
var vwWindStrength      = dc.barChart("#wind-strength-vw-chart");
var dirmChart           = dc.lineChart("#wave-chart");
var meanPeriodChart     = dc.lineChart("#mean-period-chart");
var peakWavePeriod      = dc.lineChart("#peak-period-chart");
var hexabinHsTp         = dc.heatMap("#hexabin-number-one");
var hexabinHsDm         = dc.heatMap("#hexabin-number-two");
//var sunburstCat         = dc.sunburstChart("#first-rose");
//**************************************************************************************************

//Function for counting the number of data belonging to a certain wind direction (North-South-West-East)

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
    
    if (wavedirection < 40) {
        result2.push(interval1);
    }
    
    else if(wavedirection > 40 && wavedirection < 80) {
        result2.push(interval2);
    }
    
    else if(wavedirection > 80 && wavedirection < 120) {
        result2.push(interval3);
    }
    
    else if(wavedirection > 120 && wavedirection < 160) {
        result2.push(interval4);  
    } 
    
    else if(wavedirection > 160 && wavedirection < 200) {
        result2.push(interval5);
    }
    
    else if(wavedirection > 200 && wavedirection < 240) {
        result2.push(interval6);
    }
    
    else if(wavedirection > 240 && wavedirection < 280) {
        result2.push(interval7);
    }
    
    else if(wavedirection > 280 && wavedirection < 320) {
        result2.push(interval8);
    }
    
    else result2.push(interval9);
    
    
    return result2;
    
}

//****************************************************************************************************

/* function getNumberOfHeight(d) {
    
    var result3 = [];
    
    var waveHeight = d.Hs;
    
    if (0 < waveHeight < 0.5) {
        result3.push(height1);
    }
    else if(0.5 < waveHeight < 1) {
        result3.push(height2);
    }
    else if(1 < waveHeight < 1.5) {
        result3.push(height3);
    }
    else if(1.5 < waveHeight < 2) {
        result3.push(height4);
    }
    else if(2 < waveHeight < 2.5) {
        result3.push(height5);
    }
    else if(2.5 < waveHeight < 3) {
        result3.push(height6);
    }
    else if(3 < waveHeight < 3.5) {
        result3.push(height7);
    }
    else if(3.5 < waveHeight < 4) {
        result3.push(height8);
    }
    else if(4 < waveHeight < 4.5) {
        result3.push(height9);
    }
    else if(4.5 < waveHeight < 5) {
        result3.push(height10);
    }
    else if(5 < waveHeight < 5.5) {
        result3.push(height11);
    }
    else if(5.5 < waveHeight <6) {
        result3.push(height12);
    }
    
    return result3;
} */

//****************************************************************************************************

/* function getInterval(d) {
    
    var result4 = [];
    
    var timeInterval = d.Tp;
    
    if (0 < timeInterval < 2) {
        result4.push(interval1);
    }
    else if(2 < timeInterval < 4) {
        result4.push(interval2);
    }
    else if(4 < timeInterval < 6) {
        result4.push(interval3);
    }
    else if(6 < timeInterval < 8) {
        result4.push(interval4);
    }
    else if(8 < timeInterval < 10) {
        result4.push(interval5);
    }
    else if(10 < timeInterval <12) {
        result4.push(interval6);
    }
    else if(12 < timeInterval < 14) {
        result4.push(interval7);
    }
    else if(14 < timeInterval < 16) {
        result4.push(interval8);
    }
    else if(16 < timeInterval < 18) {
        result4.push(interval9);
    }
    
    return result4;
} */


//****************************************************************************************************

// Loading the csv file for which we want to create the dashboard

d3.csv("dati.csv").then(function (data) {

    // Since its a csv file we need to format the data a bit.
    //var dateFormatSpecifier = '%m/%d/%Y';
    //var dateFormat = d3.timeFormat(dateFormatSpecifier);
    //var dateFormatParser = d3.timeParse(dateFormatSpecifier);
    //var numberFormat = d3.format('.2f');
    
    
    data.forEach(function (d) {

        //d.dd = dateFormatParser(d.date);
        //d.mm = d3.timeMonth(d.dd); // pre-calculate month for better performance
        
        
        // data coercion: from string to number
        d.Hs       = +d.Hs;
        d.Tm       = +d.Tm;
        d.Tp       = +d.Tp;
        d.Dirm     = +d.Dirm;
        d.Dirp     = +d.Dirp;
        d.Sprd     = +d.Sprd;
        d.Lm       = +d.Lm;
        d.Lp       = +d.Lp;
        d.uw       = +d.uw;
        d.vw       = +d.vw;
        d.dd       = +d.dd;
        d.mm       = +d.mm;
        d.yyyy     = +d.yyyy;

        // data enrichment
        
        //d.date = new Date(d.yyyy, d.mm - 1, d.dd); 
        d.windDirection = getWindDirection(d);
        d.waveDirection = getWaveDirection(d);
        //d.waveHeightHs  = getNumberOfHeight(d);
        //d.intervalTp    = getInterval(d);
        
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
        .height(450)
        .width(450)
        .legend(windLegend);

//**************************************************************************************************
    
    var waveDim = ndx.dimension(d => d.waveDirection);
    var groupWave = waveDim.group();
    
    const waveLegend = dc.htmlLegend().container("#wave-direction-chart-legend").horizontal(false).highlightSelected(true);
    
    waveDirChart
        .dimension(waveDim)
        .group(groupWave)
        //.ordinalColors([ "#248f24", "#2eb82e" , "#5cd65c" , "#99e699" ])
        .height(450)
        .width(450)
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
        .height(550)
        .width(850);

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
        .height(550)
        .width(850);

//**************************************************************************************************    
    
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
        .renderArea(true)
        .renderDataPoints(true)
        .colors("rgb(255, 102, 102)")
        .elasticY(true)
        .elasticX(true)
        .xAxisLabel("Days of the month")
        .height(550)
        .width(1300)
        .valueAccessor(p => p.value.average);

    
//***************************************************************************************************
    
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
    
//***************************************************************************************************
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
    
//***************************************************************************************************   

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

//**************************************************************************************************
    
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
    
//**************************************************************************************************

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
    
//**************************************************************************************************
    
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
    
//**************************************************************************************************
    
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
    
//*************************************************************************************************
    
    var hexabin1Dim = ndx.dimension(d => [(Math.floor(d.Hs * 2 )) / 2, (Math.round(d.Tp * 2)) / 2]);
    var freq1Group = hexabin1Dim.group().reduceCount()
        
    
    hexabinHsTp
        .width(860)
        .height(860)
        .dimension(hexabin1Dim)
        .group(freq1Group)
        //.xBorderRadius(555550)
        //.yBorderRadius(555550)
        .keyAccessor(function(d) { return d.key[0]; })
        .valueAccessor(function(d) { return d.key[1]; })
        .colorAccessor(function(d) { return d.value; })
        .title(function(d) {
        return  "Hs:   "    + d.key[0] + "\n"  +
                "Tp:  "     + d.key[1] + "\n"  + 
                "Count: "   + d.value ; })
        .colors(["#000066","#000099","#0000cc","#0000ff","#3333ff","#6666ff","#9999ff","#ccccff","#e6e6ff","#ffffcc","#ffff99","#ffff66","#ffff33","#ffff00","#ffbb33","#ffaa00","#ff8c1a","#ff751a","#ff6600","#ff471a","#ff3300","#ff1a1a","#e60000","#cc0000","#800000"])
        //.colors(["#0000b3","#0000ff","#3333ff","#4d4dff","#8080ff","#ffeb99","#ffe066","#ffd633","#ffcc00","#e6b800","#ff8533","#ff751a","#ff6600","#ff3300","#e62e00","#b32400","#990000","#660000"])
        .calculateColorDomain();
    

//*************************************************************************************************
    
    var hexabin2Dim = ndx.dimension(d => [(Math.floor(d.Hs * 2 )) / 2, (Math.round(d.Dirm / 10)) * 10]);
    var freq2Group = hexabin2Dim.group().reduceCount()
        
    
    hexabinHsDm
        .width(860)
        .height(860)
        .dimension(hexabin2Dim)
        .group(freq2Group)
        //.xBorderRadius(555550)
        //.yBorderRadius(555550)
        .keyAccessor(function(d) { return d.key[0]; })
        .valueAccessor(function(d) { return d.key[1]; })
        .colorAccessor(function(d) { return d.value; })
        .title(function(d) {
        return  "Hs:   "    + d.key[0] + "\n"  +
                "Dm:  "     + d.key[1] + "\n"  + 
                "Count: "   + d.value ; })
        .colors(["#000066","#000099","#0000cc","#0000ff","#3333ff","#6666ff","#9999ff","#ccccff","#e6e6ff","#ffffcc","#ffff99","#ffff66","#ffff33","#ffff00","#ffbb33","#ffaa00","#ff8c1a","#ff751a","#ff6600","#ff471a","#ff3300","#ff1a1a","#e60000","#cc0000","#800000"])
        //.colors(["#0000b3","#0000ff","#3333ff","#4d4dff","#8080ff","#ffeb99","#ffe066","#ffd633","#ffcc00","#e6b800","#ff8533","#ff751a","#ff6600","#ff3300","#e62e00","#b32400","#990000","#660000"])
        .calculateColorDomain();
    
//*************************************************************************************************
    
    
    
//**************************************************************************************************    
    
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
        case "the-Edwin-button":
            chart = hexabinHsTp;
            break;
        case "the-Hibbert-button":
            chart = hexabinHsDm;
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