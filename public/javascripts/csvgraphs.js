$(document).ready(function() {
    $(".sub").hide(); // hide on page load
    $(".main").hide();
    $("select").change(function() {
        $(this).find("option:selected").each(function() {
            val = $(this).attr("value")
            if (val == 0) { //if option is "choose"
                $(".main").hide();
                $(".sub").hide();
            } else if (val == 1) { //for all journal
                $(".main").show();
                $(".sub").hide();
            } else { // for each journal create id's 'graph-11,21,31...'
                id1 = 'graph-' + val + '1';
                $(".graph1").attr('id', id1);
                id2 = 'graph-' + val + '2';
                $(".graph2").attr('id', id2);
                id3 = 'graph-' + val + '3';
                $(".graph3").attr('id', id3);
                id4 = 'graph-' + val + '4';
                $(".graph4").attr('id', id4);
                $(".sub").show();
                $(".main").hide();
                path = "../files/graphcsv/" + journals[val] + ".csv"
                name1 = 'graph-' + val + '1';
                name2 = 'graph-' + val + '2';
                name3 = 'graph-' + val + '3';
                name4 = 'graph-' + val + '4';
                Plotly.d3.csv(path, function(err, rows) {
                    trace00 = {
                        x: rows.map(function(row) { return row['Year'] }),
                        y: rows.map(function(row) { return row['ArticleCount'] }),
                        name: 'ArticleCount',
                        text: rows.map(function(row) { return row['Month'] }),
                        type: 'bar',
                        xaxis: 'x',
                        yaxis: 'y',
                    };
                    trace01 = {
                        x: rows.map(function(row) { return row['Year'] }),
                        y: rows.map(function(row) { return row['CitationCount'] }),
                        name: 'CitationCount',
                        text: rows.map(function(row) { return row['Month'] }),
                        type: 'bar',
                    };
                    data0 = [trace00, trace01];
                    layout0 = {
                        autosize: true,
                        hovermode: 'closest',
                        title: "Article count vs Citation Count",
                        xaxis: {
                            autorange: true,
                            domain: [0, 1],
                            range: [2004.5, 2016.5],
                            type: 'linear'
                        },
                        yaxis: {
                            autorange: true,
                            domain: [0, 1],
                            range: [0, 100],
                            type: 'linear'
                        }
                    };
                    Plotly.plot(name1, {
                        data: data0,
                        layout: layout0,
                    });

                    Plotly.d3.csv(path, function(err, rows) {
                        var POP_TO_PX_SIZE = 2e10;
                        var trace1 = {
                            mode: 'markers',
                            type: 'bar',
                            x: rows.map(function(row) { return row['Year'] }),
                            y: rows.map(function(row) { return row['CitationCount'] }),
                            text: rows.map(function(row) { return row['Name'] }),
                        };

                        layout1 = {
                            autosize: true,
                            hovermode: 'closest',
                            legend: {
                                x: 0.5,
                                y: -0.25,
                                orientation: "h",
                                traceorder: "normal",
                                xanchor: "center",
                            },

                            title: "Citation count vs Year",
                            xaxis: {
                                autorange: true,
                                range: [2009.5, 2016.5],
                                title: 'Year',
                                type: 'linear'
                            },
                            yaxis: {
                                autorange: true,
                                range: [0, 4047.36842105],
                                title: 'Citation Count',
                                type: 'linear'
                            }
                        };
                        Plotly.plot(name2, [trace1], layout1, { showLink: false });
                    });
                    Plotly.d3.csv(path, function(err, rows) {
                        var POP_TO_PX_SIZE = 2e10;
                        var trace2 = {
                            mode: 'markers',
                            type: 'bar',
                            x: rows.map(function(row) { return row['Year'] }),
                            y: rows.map(function(row) { return row['ArticleCount'] }),
                            text: rows.map(function(row) { return row['Name'] }),
                        };

                        var layout2 = {
                            autosize: true,
                            hovermode: "closest",
                            legend: {
                                x: 0.5,
                                y: -0.25,
                                orientation: "h",
                                traceorder: "normal",
                                xanchor: "center"
                            },

                            title: "Article count vs Year",
                            xaxis: {
                                autorange: true,
                                fixedrange: false,
                                range: [1982.5, 2016.5],
                                title: "Year",
                                type: "linear"
                            },
                            yaxis: {
                                autorange: true,
                                range: [0, 33.6842105263],
                                title: "Article Count",
                                type: "linear"
                            }
                        };
                        Plotly.plot(name3, [trace2], layout2, { showLink: false });
                    });
                    Plotly.d3.csv(path, function(err, rows) {
                        var POP_TO_PX_SIZE = 2e10;
                        var trace3 = {
                            mode: 'markers',
                            type: 'pie',
                            direction: "counterclockwise",
                            hoverinfo: "label+value+text+percent",
                            sort: true,
                            textinfo: "value+percent",
                            labels: rows.map(function(row) { return row['Month'] }),
                            values: rows.map(function(row) { return row['ArticleCount'] }),
                            text: rows.map(function(row) { return row['Name'] }),
                        };

                        var layout3 = {
                            autosize: true,
                            hovermode: "closest",
                            legend: {
                                x: 1.00343949045,
                                y: 0.910994764398
                            },
                            title: "Article Count per month"
                        };
                        Plotly.plot(name4, [trace3], layout3, { showLink: false });
                    });
                    $('select').on('change', function() { // delete traces to avoid overlaing
                        Plotly.deleteTraces(name1, 0);
                        Plotly.deleteTraces(name1, 0);
                        Plotly.deleteTraces(name2, 0);
                        Plotly.deleteTraces(name3, 0);
                        Plotly.deleteTraces(name4, 0);
                    })
                });
            }
        });
    }).change();
});
var data = [];
var arr = [];
var options = ["Choose", "All Journal Data"];
var journals = ["random", "random"]
path = "../files/graphcsv/Journals.csv"
Papa.parse(path, {
    download: true,
    complete: function(results) {
        arr = $.makeArray(results.data)
        for (i = 1; i < arr.length - 1; i++) {
            options.push(arr[i][0]); // append journals list to options
            journals.push(arr[i][0]);
        }

        var elm = document.getElementById('graphs'), // get the select
            df = document.createDocumentFragment(); // create a document fragment to hold the options while we create them
        for (var i = 0; i < options.length; i++) {
            var option = document.createElement('option'); // create the option element
            option.value = i; // set the value property
            option.appendChild(document.createTextNode(options[i])); // set the textContent in a safe way.
            df.appendChild(option); // append the option to the document fragment
        }
        elm.appendChild(df); // append the document fragment to the DOM. this is the better way rather than setting innerHTML a bunch of times (or even once with a long string)
    }
});


Plotly.d3.csv('../files/graphcsv/generateAllArticleIntScore.csv', function(err, rows) {
    var trace1 = {
        mode: 'markers',
        type: 'scatter',
        x: rows.map(function(row) { return row['TotalCitationCount'] }),
        y: rows.map(function(row) { return row['TotalArticleCount'] }),
        text: rows.map(function(row) {
            str = row['Name'] + "<br>" + row['InternationalityScore']
            return str
        }),
        marker: {
            sizemode: 'area',
            size: rows.map(function(row) { return row['InternationalityScore'] * 200 }),
        }
    };

    var layout1 = {
        hovermode: "closest",
        title: "Total citation count vs total article count" + "<br> with internationality score ",
        xaxis: {
            autorange: true,
            range: [-2075.59709325, 33446.7218862],
            title: "Total citation count",
            type: "linear"
        },
        yaxis: {
            autorange: true,
            range: [43.5581236359, 516.996793001],
            title: "Total article count",
            type: "linear"
        }
    };
    Plotly.plot('my-graph1', [trace1], layout1, { showLink: false });
});

Plotly.d3.csv('../files/graphcsv/generateAllArticleCitvsYear.csv', function(err, rows) {
    var trace2 = {
        mode: 'markers',
        type: 'bar',
        x: rows.map(function(row) { return row['Year'] }),
        y: rows.map(function(row) { return row['CitationCount'] }),
        text: rows.map(function(row) { return row['Name'] }),
    };

    layout2 = {
        hovermode: 'closest',
        title: "Citation count vs Year",
        xaxis: {
            autorange: true,
            range: [2009.5, 2016.5],
            title: 'Year',
            type: 'linear'
        },
        yaxis: {
            autorange: true,
            range: [0, 4047.36842105],
            title: 'Citation Count',
            type: 'linear'
        }
    };
    Plotly.plot('my-graph2', [trace2], layout2, { showLink: false });
});

Plotly.d3.csv('../files/graphcsv/generateAllArticleCitvsYear.csv', function(err, rows) {
    var trace3 = {
        mode: 'markers',
        type: 'bar',
        x: rows.map(function(row) { return row['Year'] }),
        y: rows.map(function(row) { return row['ArticleCount'] }),
        text: rows.map(function(row) { return row['Name'] }),
    };

    var layout3 = {
        hovermode: "closest",
        title: "Article count vs Year",
        xaxis: {
            autorange: true,
            fixedrange: false,
            range: [1982.5, 2016.5],
            title: "Year",
            type: "linear"
        },
        yaxis: {
            autorange: true,
            range: [0, 33.6842105263],
            title: "Article Count",
            type: "linear"
        }
    };
    Plotly.plot('my-graph3', [trace3], layout3, { showLink: false });
});

Plotly.d3.csv('../files/graphcsv/generateAllArticleCitvsYear.csv', function(err, rows) {
    var POP_TO_PX_SIZE = 2e10;
    var trace4 = {
        mode: 'markers',
        type: 'pie',
        direction: "counterclockwise",
        hoverinfo: "label+value+text+percent",
        sort: true,
        textinfo: "value+percent",
        labels: rows.map(function(row) { return row['Month'] }),
        values: rows.map(function(row) { return row['ArticleCount'] }),
        text: rows.map(function(row) { return row['Name'] }),
    };

    var layout4 = {
        hovermode: "closest",
        legend: {
            x: 1.00343949045,
            y: 0.910994764398
        },
        title: "Article Count per month"
    };
    Plotly.plot('my-graph4', [trace4], layout4, { showLink: false });
});