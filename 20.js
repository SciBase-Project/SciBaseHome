// You can reproduce this figure in plotly.js with the following code!

// Learn more about plotly.js here: https://plot.ly/javascript/getting-started

/* Here's an example minimal HTML template
 *
 * <!DOCTYPE html>
 *   <head>
 *     <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
 *   </head>
 *   <body>
 *   <!-- Plotly chart will be drawn inside this div -->
 *   <div id="plotly-div"></div>
 *     <script>
 *     // JAVASCRIPT CODE GOES HERE
 *     </script>
 *   </body>
 * </html>
 */

var data = [
  {
    x: ["1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1991", "1992", "1992", "1993", "1993", "1994", "1994", "1995", "1995", "1996", "1996", "1996", "1997", "1997", "1997", "1998", "1998", "1998", "1999", "1999", "1999", "2000", "2000", "2000", "2001", "2001", "2001", "2001", "2002", "2002", "2002", "2002", "2003", "2003", "2003", "2003", "2004", "2004", "2004", "2004", "2005", "2005", "2005", "2005", "2006", "2006", "2006", "2006", "2007", "2007", "2007", "2007", "2008", "2008", "2008", "2008", "2009", "2009", "2009", "2009", "2010", "2010", "2010", "2010", "2010", "2010", "2011", "2011", "2011", "2011", "2011", "2011", "2012", "2012", "2012", "2012", "2012", "2012", "2013", "2013", "2013", "2013", "2013", "2013", "2013", "2014", "2014", "2014", "2014", "2014", "2014", "2014", "2015", "2015", "2015", "2015", "2015", "2015", "2015", "2016", "2016", "2016", "2016", "2016", "2016", "2016"], 
    y: ["23", "20", "15", "15", "18", "16", "13", "14", "15", "15", "14", "13", "13", "16", "11", "15", "13", "12", "4", "13", "14", "16", "5", "19", "17", "9", "11", "8", "15", "9", "12", "15", "16", "11", "10", "14", "4", "12", "15", "10", "7", "6", "20", "13", "14", "17", "6", "10", "17", "13", "21", "15", "15", "17", "19", "6", "12", "23", "14", "23", "11", "22", "17", "19", "10", "16", "8", "14", "23", "9", "31", "12", "17", "12", "15", "21", "60", "12", "18", "25", "12", "17", "18", "15", "59", "1", "15", "95", "21", "14", "14", "28", "12", "25", "30", "18", "19", "17", "35", "9", "24", "15", "18", "88", "13", "7", "36", "32", "9", "8", "39", "3", "7", "10", "19"], 
    mode: "lines", 
    name: "count", 
    text: ["TOCS", "TOCS", "TOCS", "TOCS", "TOCS", "TOCS", "TOCS", "TOCS", "TOCS", "TOMACS", "TOMACS", "TOCS", "TOCS", "TOMACS", "TOCS", "TOMACS", "TOMACS", "TOCS", "JEA", "TOMACS", "TOCS", "TOCS", "JEA", "TOMACS", "TOMACS", "JEA", "TOCS", "JEA", "TOMACS", "TOCS", "TOCS", "TOMACS", "JEA", "TOCS", "JEA", "TOMACS", "TOIT", "JEA", "TOMACS", "TOCS", "TOIT", "JEA", "TOMACS", "TOCS", "TOIT", "TOIT", "JEA", "TOCS", "TOMACS", "TOCS", "TOIT", "JEA", "TOMACS", "TOMACS", "TOIT", "JEA", "TOCS", "TOMACS", "TWEB", "TOIT", "TOCS", "TWEB", "TOMACS", "JEA", "TOCS", "TOMACS", "TOCS", "TWEB", "JEA", "TOCS", "TOMACS", "TOIT", "TWEB", "JEA", "TIST", "TWEB", "TIST", "TOIT", "JEA", "TOMACS", "TOCS", "TOMACS", "TWEB", "TOCS", "TIST", "JEA", "TOIT", "TIST", "TEAC", "TOIT", "JEA", "TWEB", "TOCS", "TOMACS", "TIST", "JEA", "TWEB", "TEAC", "TOIT", "TOCS", "TOMACS", "TOIT", "TWEB", "TIST", "TOCS", "JEA", "TOMACS", "TEAC", "JEA", "TEAC", "TIST", "TOCS", "TWEB", "TOIT", "TOMACS"], 
    textsrc: "harshavamsi:19:5f0bd9", 
    type: "scatter", 
    uid: "f486c9", 
    xsrc: "harshavamsi:19:8da00d", 
    ysrc: "harshavamsi:19:f87fc3"
  }
];
var layout = {
  autosize: true, 
  hovermode: "closest", 
  xaxis: {
    autorange: true, 
    range: [1983, 2016], 
    title: "Year", 
    type: "linear"
  }, 
  yaxis: {
    autorange: true, 
    range: [-4.22222222222, 100.222222222], 
    title: "count", 
    type: "linear"
  }
};
Plotly.plot('plotly-div', data, layout);