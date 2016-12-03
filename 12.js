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
    direction: "counterclockwise", 
    hoverinfo: "label+value+text+percent", 
    labels: ["November", "January", "February", "May", "July", "February", "August", "November", "December", "May", "February", "June", "August", "May", "May", "February", "November", "June", "February", "May", "October", "November", "March", "February", "November", "August", "March", "December", "May", "July", "February", "September", "December", "August", "November", "August", "May", "July", "October", "November", "February", "December", "May", "August", "October", "February", "March", "December", "August", "March", "February", "December", "May", "June", "July", "April", "March", "September", "October", "January", "December", "June", "April", "July", "January", "January", "January", "January", "January", "January", "January", "January", "January", "January", "January", "January", "January", "January", "January", "January", "January", "January", "April", "January", "September", "July", "October", "May", "February", "April", "May", "January", "March", "August", "July", "February", "October", "December", "May", "June", "September", "June", "April", "March", "September", "May", "October", "September", "May", "October", "April", "September", "July", "June", "November", "October", "February", "January", "March", "January", "January", "September", "July", "January", "June", "February", "October", "April", "September", "October", "April", "April", "December", "January", "September", "February", "May", "March", "January", "April", "November", "October", "May", "August", "March", "May", "February", "November", "August", "May", "February", "August", "August", "February", "February", "November", "June", "April", "February", "November", "November", "May", "May", "November", "February", "February", "December", "August", "May", "March", "August", "November", "February", "August", "February", "September", "November", "November", "May", "May", "February", "February", "May", "August", "August", "February", "January", "November", "May", "December", "November", "May", "May", "August", "February", "August", "May", "March", "February", "November", "February", "November", "August", "August", "February", "December", "November", "May", "August", "August", "September", "November", "February", "February", "November", "May", "February", "August", "August", "November", "May", "August", "May", "February", "November", "June", "August", "May", "July", "August", "November", "May", "May", "August", "February", "February", "December", "May", "November", "August", "February", "February", "December", "May", "May", "February", "August", "November", "May", "February", "November", "December", "August", "May", "November", "June", "May", "February", "February", "May", "February", "November", "August", "September", "November", "August", "September", "May", "August", "February", "November", "August", "November", "August", "February", "January", "May", "April", "October", "October", "July", "December", "July", "January", "April", "February", "October", "October", "July", "April", "May", "April", "January", "June", "January", "October", "July", "January", "July", "October", "January", "July", "April", "December", "January", "July", "September", "April", "May", "July", "January", "July", "April", "October", "March", "January", "January", "April", "July", "July", "October", "October", "January", "December", "April", "April", "March", "September", "January", "August", "April", "April", "January", "January", "January", "January", "July", "November", "January", "April", "July", "April", "October", "July", "April", "January", "January", "April", "December", "March", "April", "October", "October", "July", "July", "November", "July", "May", "April", "October", "September", "October", "February", "October", "February", "January", "January", "October", "January", "August", "October", "October", "December", "March", "August", "April", "July", "January", "April", "October", "July"], 
    labelssrc: "harshavamsi:10:d75135", 
    name: "Article Count", 
    sort: true, 
    textinfo: "value+percent", 
    type: "pie", 
    uid: "66ae25", 
    values: ["4", "6", "7", "5", "5", "4", "4", "3", "3", "3", "7", "3", "5", "5", "4", "4", "4", "3", "5", "4", "14", "3", "4", "4", "3", "4", "3", "5", "3", "10", "3", "2", "3", "4", "4", "1", "4", "4", "6", "7", "8", "7", "4", "5", "4", "1", "3", "4", "3", "6", "5", "4", "9", "4", "10", "3", "4", "4", "5", "4", "6", "4", "6", "4", "12", "23", "6", "1", "8", "6", "7", "4", "19", "16", "15", "9", "18", "12", "18", "5", "14", "10", "9", "6", "4", "5", "7", "6", "5", "5", "6", "5", "4", "4", "5", "7", "4", "6", "7", "4", "4", "6", "4", "6", "5", "3", "5", "6", "5", "6", "3", "3", "3", "7", "5", "5", "9", "3", "2", "4", "18", "20", "12", "17", "20", "9", "8", "15", "15", "12", "13", "18", "21", "8", "18", "20", "32", "8", "13", "10", "7", "18", "19", "17", "18", "3", "3", "3", "2", "3", "6", "4", "4", "3", "5", "3", "3", "3", "3", "5", "3", "3", "3", "3", "3", "4", "2", "5", "3", "3", "2", "4", "4", "3", "4", "3", "5", "4", "3", "3", "3", "3", "6", "4", "3", "1", "3", "2", "3", "3", "4", "3", "4", "3", "4", "4", "3", "3", "3", "3", "3", "2", "3", "5", "6", "3", "3", "2", "3", "3", "3", "4", "3", "3", "3", "2", "6", "3", "3", "3", "2", "3", "2", "3", "4", "3", "3", "3", "2", "3", "4", "2", "4", "3", "4", "4", "2", "4", "6", "3", "2", "3", "4", "4", "4", "2", "2", "2", "3", "3", "4", "2", "4", "3", "3", "2", "3", "1", "3", "3", "5", "4", "3", "2", "4", "3", "4", "3", "4", "4", "2", "3", "4", "3", "3", "3", "5", "3", "4", "6", "4", "4", "6", "6", "3", "7", "4", "7", "4", "3", "4", "6", "4", "5", "6", "3", "3", "5", "3", "4", "4", "4", "5", "8", "4", "3", "5", "4", "6", "4", "3", "4", "2", "3", "7", "4", "4", "4", "5", "4", "4", "3", "4", "9", "4", "4", "6", "7", "10", "5", "8", "4", "6", "3", "4", "3", "4", "7", "6", "4", "4", "3", "5", "3", "4", "5", "6", "4", "4", "5", "5", "5", "5", "4", "4", "6", "4", "6", "4", "4", "5", "4", "6", "6", "6", "6", "3", "2", "4", "6", "4", "4", "6", "6", "6", "3", "4", "4", "4", "4", "4"], 
    valuessrc: "harshavamsi:10:9aa193"
  }
];
var layout = {
  autosize: true, 
  hovermode: "closest", 
  legend: {
    x: 1.00343949045, 
    y: 0.910994764398
  }, 
  title: "Total citation count vs total article count with internationality score"
};
Plotly.plot('plotly-div', data, layout);