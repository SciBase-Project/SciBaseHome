module.exports = function(io) {
    var express = require('express');
    var router = express.Router();
    var request = require("request");
    var fs = require("fs");
    var path = require("path");
    var util = require("../lib/util");

    // this is a new comment here

    var NEO4J_API_URL = "http://localhost:7474/db/data/transaction/commit";
    // var NEO4J_API_URL = "http://" + process.env['NEO4J_HOST'] + ":7474/db/data/transaction/commit";
    // var NEO4J_API_URL = "http://54.201.10.92:7474/db/data/transaction/commit";
    // var NEO4J_USER = process.env['NEO4J_USER'];
    // var NEO4J_PASS = process.env['NEO4J_PASS'];
    var NEO4J_USER = "neo4j";
    var NEO4J_PASS = "scibase";


    /* GET home page. */
    router.get('/', function(req, res, next) {
        util.getStats(function(result) {
           // var json_pre = '[{"Id":1,"UserName":"Sam Smith"},{"Id":2,"UserName":"Fred Frankly"},{"Id":1,"UserName":"Zachary Zupers"}]';
            console.log("Result: ",result);
            result.title = "SciBase";
            result.JournalCsvUrl = "files/papers/Journals.csv";
            result.ArticleCsvUrl = "files/papers/Articles.csv";
            util.generateArticleCsv();
            util.generateJournalCsv();
            res.render('index', result);
             
            });
    });

    router.get('/team', function(req, res, next) {
        res.render('team', {
            title: 'SciBase'
        });
    });

    router.get('/publications', function(req, res, next) {
        res.render('publications', {
            title: 'SciBase'
        });
    });
    /* GET home page. */
    router.get('/datacenter', function(req, res, next) {
        var dataset_list = [{
                title: "Scimago Dataset (1999 - 2014)",
                description: "In this section you can find the entire collection of journals covered by Scopus (currently the largest database of academic literature with 21,900 journals from 5,000 publishers) along with their SNIP, IPP and SJR metrics going back to 1999.",
                download_link: "http://www.journalmetrics.com/documents/SNIP_IPP_SJR_complete_1999_2014.xlsx",
                internal: true,
                format: "XLSX",
                size: "16.1 MB",
                category: "scimago-dataset"
            }, {
                title: "Scimago Dataset (Archive at the time of January 2010)",
                description: "Due to the fact that journal metrics are calculated from Scopus, the journal metric values cannot be fixed in time. Scopus is dynamic. This dataset is the is the first publicly released set.",
                download_link: "http://www.journalmetrics.com/documents/SNIP_SJR_complete_1999_2009_JAN%202010.xlsx",
                internal: true,
                format: "XLSX",
                size: "2.8 MB",
                category: "scimago-dataset"
            }, {
                title: "AMiner Paper",
                description: "This file saves the paper information and the citation network.",
                download_link: "http://arnetminer.org/lab-datasets/aminerdataset/AMiner-Paper.rar",
                internal: false,
                format: "CSV",
                size: "509 MB",
                category: "aminer-dataset"
            }, {
                title: "AMiner Author",
                description: "This file saves the author information.",
                download_link: "http://arnetminer.org/lab-datasets/aminerdataset/AMiner-Author.zip",
                internal: false,
                format: "CSV",
                size: "167 MB",
                category: "aminer-dataset"
            }, {
                title: "AMiner Co-author",
                description: "This file saves the collaboration network among the authors in the second file.",
                download_link: "http://arnetminer.org/lab-datasets/aminerdataset/AMiner-Coauthor.zip",
                internal: false,
                format: "CSV",
                size: "31.5 MB",
                category: "aminer-dataset"
            }, {
                title: "ACM Journals",
                description: "Dataset of ACM journals.",
                download_link: "https://s3.ap-south-1.amazonaws.com/scibasedatasets/datasets/ACM+dataset.tar.gz",
                internal: false,
                format: "JSON",
                size: "60 MB",
                category: "scibase-dataset"
            }, {
                title: "Indian Journals",
                description: "Dataset of Indian journals.",
                download_link: "https://s3.ap-south-1.amazonaws.com/scibasedatasets/datasets/DataSet-IndianJournals.tar.gz",
                internal: false,
                format: "JSON",
                size: "118 KB",
                category: "scibase-dataset"
            }, {
                title: "International Journals",
                description: "Dataset of International journals.",
                download_link: "https://s3.ap-south-1.amazonaws.com/scibasedatasets/datasets/DataSet_InternationalJournal.tar.gz",
                internal: false,
                format: "JSON",
                size: "5.3 MB",
                category: "scibase-dataset"
            }, {
                title: "Scholastic Indices",
                description: "Scholastic indices.",
                download_link: "https://s3.ap-south-1.amazonaws.com/scibasedatasets/datasets/ScholasticIndices.csv",
                internal: false,
                format: "CSV",
                size: "4 KB",
                category: "scibase-dataset"
            }, 
        ];

        res.render('datacenter', {
            datasets: dataset_list,
            helpers: {
                toUpperCase: function(str) {
                    return str.toUpperCase();
                }
            }
        });
    });

    /* GET home page. */
    router.get('/custom_datasets', function(req, res, next) {

        // socket.io events
        io.on("connection", function(socket) {
            console.log("A user connected");
            /**
             * When a user enters a Cypher query, the data is sent with query_request
             * event of socket.
             */
            socket.on('query_request', function(query) {
                var request_json = {
                    "statements": [{
                        "statement": query
                    }]
                };
                var auth_payload = new Buffer(NEO4J_USER + ":" + NEO4J_PASS).toString('base64');
                var res = request({
                    url: NEO4J_API_URL,
                    method: "POST",
                    json: request_json,
                    headers: {
                        "Authorization": "Basic " + auth_payload,
                        "Accept": "application/json; charset=UTF-8"
                    }
                }, function(err, response, body) {
                    if (!err && response.statusCode === 200) {
                        var file_name= util.randomString(20) + ".json";
                        var error = false,
                            response_body = {};
                        // console.log("API request successful. Received reply:", JSON.stringify(body));

                        response_body.status = "success";
                        response_body.url = "/downloads/generated/json/" + file_name;
                        try {
                            fs.writeFileSync(path.join(__dirname, "../files/datasets/generated/json", file_name), JSON.stringify(body), 'utf-8');
                        } catch (e) {
                            console.log("Error:", e.message);
                            response_body.status = "error";
                            response_body.url = null;
                        }


                        /**
                         * The result of the query is sent with query_response event of socket.
                         * For failure, the structure of the response is:
                         * {"status": "error", "url": null}
                         *
                         * And for success:
                         * {"status": "success", "url": "/downloads/generated/xyz.json"}
                         */
                        console.log("Response sent: ", JSON.stringify(response_body));
                        socket.emit("query_response", response_body);
                    } else {
                        console.log("API request failed with error: " + err);
                        console.log("response.statusCode: " + response.statusCode);
                        console.log("response.statusText: " + response.statusText);
                    }
                }); // request ends
            }); // socket event handler ends
        }); // io event handler ends

        res.render('custom_datasets', {});
    });

    router.get('/query_builder', function(req, res, next) {

        // socket.io events
        io.on("connection", function(socket) {
            console.log("A user connected");
            /**
             * When a user enters a Cypher query, the data is sent with query_request
             * event of socket.
             */
            socket.on('query_builder__request', function(cols) {
                var column_names = cols;
                var query;
                var column_mappings =  {
                    "Article - Title": "ar.title",
                    "Article - Abstract" : "ar.abstract",
                    "Article - DOI" : "ar.doi",
                    "Author - Full Name" : "a.full_name",
                    "Author - First Name" : "a.first_name",
                    "Author - Last Name" : "a.last_name",
                    "Author - Middle Name" : "a.middle_name",
                    "Author - Profile Link" : "a.link",
                    "Journal - Name" : "j.name"
                    // ...
                };

                console.log(column_mappings["Article - Title"]);

                var return_param = "";
                for (var i=0; i < column_names.length; i++) {
                    return_param += column_mappings[column_names[i]];
                    if(i < column_names.length - 1)
                        return_param += ",";
                }
                console.log(return_param);

                // Object.keys(column_names).forEach(function (key) {
                //     return_param += column_mappings[column_names[key]];
                //     console.log(column_mappings[column_names[key]]);
                // });

                // var n = return_param.lastIndexOf(',');
                // return_param[n] = "";
                query = "MATCH (a:Author)<-[r:authored_by]-(ar:Article) RETURN " + return_param;

                console.log(return_param);

                var request_json = {
                    "statements": [{
                        "statement": query
                    }]
                };
                var auth_payload = new Buffer(NEO4J_USER + ":" + NEO4J_PASS).toString('base64');
                var res = request({
                    url: NEO4J_API_URL,
                    method: "POST",
                    json: request_json,
                    headers: {
                        "Authorization": "Basic " + auth_payload,
                        "Accept": "application/json; charset=UTF-8"
                    }
                }, function(err, response, body) {
                    if (!err && response.statusCode === 200) {
                        var file_name_base = util.randomString(20);
                        var error = false,
                            response_body = {};
                        // console.log("API request successful. Received reply:", JSON.stringify(body));

                        response_body.status = "success";
                        response_body.json_url = "/downloads/generated/json/" + file_name_base + ".json";
                        response_body.csv_url = "/downloads/generated/csv/" + file_name_base + ".csv";
                        console.log(JSON.stringify(response_body));
                        try {
                            fs.writeFileSync(path.join(__dirname, "../files/datasets/generated/json", file_name_base + ".json"), JSON.stringify(body), 'utf-8');
                        } catch (e) {
                            console.log("Error:", e.message);
                            response_body.status = "error";
                            response_body.json_url = null;
                        }

                        try {
                            fs.writeFileSync(path.join(__dirname, "../files/datasets/generated/csv", file_name_base + ".csv"), util.jsonToCsv(body), 'utf-8');
                        } catch (e) {
                            console.log("Error:", e.message);
                            response_body.status = "error";
                            response_body.csv_url = null;
                        }

                        /**
                         * The result of the query is sent with query_response event of socket.
                         * For failure, the structure of the response is:
                         * {"status": "error", "url": null}
                         *
                         * And for success:
                         * {"status": "success", "url": "/downloads/generated/xyz.json"}
                         */
                        console.log("Response sent: ", JSON.stringify(response_body));
                        socket.emit("query_builder__response", response_body);
                    } else {
                        console.log("API request failed with error: " + err);
                        console.log("response.statusCode: " + response.statusCode);
                        console.log("response.statusText: " + response.statusText);
                    }
                }); // request ends
            }); // socket event handler ends
        }); // io event handler ends

        res.render('query_builder', {});

    });

    router.get('/login', function(req, res, next) {
        res.redirect('https://orcid.org/oauth/authorize?client_id=APP-7V6NPHD04FV07E8W&response_type=code&scope=/authenticate&redirect_uri=http://54.201.10.92:3000/loged_in');
    });

    router.get('/loged_in', function(req, res, next) {
        var code = req.query.code;
        var dataString = 'client_id=APP-7V6NPHD04FV07E8W&client_secret=b6f8f45a-4c36-4f7a-b9ae-92f47a647613&grant_type=authorization_code&redirect_uri=http://54.201.10.92:3000/loged_in&code=' + code;
        console.log(dataString);
        var options = {
            url: 'https://orcid.org/oauth/token',
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: dataString,
        };

        var result = "not sure";
        var name = "default Value";
        var orcidId = "default Value";
        console.log("insidefunc");
        function callback(error, response, body) {
            if (!error && response.statusCode == 200) {
                body = JSON.parse(body);
                name = body.name;
                orcidId = body.orcid;
                console.log("success");
            } else {
                console.log("failure");
            }
            response1 = JSON.stringify(response);
            response2 = JSON.stringify(body);

            res.render('logged_in', {
                token: req.query.code,
                name: body.name,
                orcidId: body.orcid
            });
        }
        request(options, callback);
        

    });

    router.get('/aminerAPI', function(req, res, next) {
        res.render('aminerAPI', {});
    });

    return router;
};
