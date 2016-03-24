module.exports = function(io) {
    var express = require('express');
    var router = express.Router();
    var request = require("request");
    var fs = require("fs");
    var path = require("path");
    var util = require("../lib/util");

    // var NEO4J_API_URL = "http://localhost:7474/db/data/transaction/commit";
    // var NEO4J_API_URL = "http://" + process.env['NEO4J_HOST'] + ":7474/db/data/transaction/commit";
    var NEO4J_API_URL = "http://54.201.10.92:7474/db/data/transaction/commit";
    // var NEO4J_USER = process.env['NEO4J_USER'];
    // var NEO4J_PASS = process.env['NEO4J_PASS'];
    var NEO4J_USER = "neo4j";
    var NEO4J_PASS = "scibase";

    /* GET home page. */
    router.get('/', function(req, res, next) {
        res.render('index', {
            title: 'SciBase'
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
            title: "Dataset A",
            description: "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet",
            download_link: "dataset_a.zip",
            internal: true,
            format: "csv",
            size: "53 MB"
        }, {
            title: "Dataset B",
            description: "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet",
            download_link: "dataset_b.zip",
            internal: true,
            format: "csv",
            size: "153 MB"
        }, {
            title: "Dataset C",
            description: "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet",
            download_link: "dataset_c.zip",
            internal: true,
            format: "csv",
            size: "523 MB"
        }, {
            title: "Dataset D",
            description: "Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet",
            download_link: "dataset_d.zip",
            internal: true,
            format: "csv",
            size: "33 MB"
        }, {
            title: "AMiner Paper",
            description: "This file saves the paper information and the citation network.",
            download_link: "http://arnetminer.org/lab-datasets/aminerdataset/AMiner-Paper.rar",
            internal: false,
            format: "csv",
            size: "509 MB"
        }, {
            title: "AMiner Author",
            description: "This file saves the author information.",
            download_link: "http://arnetminer.org/lab-datasets/aminerdataset/AMiner-Author.zip",
            internal: false,
            format: "csv",
            size: "167 MB"
        }, {
            title: "AMiner Co-author",
            description: "This file saves the collaboration network among the authors in the second file.",
            download_link: "http://arnetminer.org/lab-datasets/aminerdataset/AMiner-Coauthor.zip",
            internal: false,
            format: "csv",
            size: "31.5 MB"
        }, ];

        res.render('datacenter', {
            datasets: dataset_list
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
                }, function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        var file_name = util.randomString(20) + ".json";
                        var error = false,
                            response_body = {};
                        console.log("API request successful. Received reply:", JSON.stringify(body));

                        response_body.status = "success";
                        response_body.url = "/downloads/generated/" + file_name;
                        try {
                            fs.writeFileSync(path.join(__dirname, "../files/datasets/generated/", file_name), JSON.stringify(body), 'utf-8');
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
                        console.log("API request failed with error: " + error)
                        console.log("response.statusCode: " + response.statusCode)
                        console.log("response.statusText: " + response.statusText)
                    }
                }); // request ends
            }); // socket event handler ends
        }); // io event handler ends

        res.render('custom_datasets', {});
    });

    router.get('/custom_datasets/query_builder', function(req, res, next) {

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
                }

                var return_param = ""
                for (var col in column_names) {
                    return_param += column_mappings[col] + ", "
                }
                query = "MATCH (a:Author)<-[r:authored_by]-(ar:Article) RETURN *"
                // Generate Cipher Query here and assign to query variable
                //
                //
                //
                //

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
                }, function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                        var file_name = util.randomString(20) + ".json";
                        var error = false,
                            response_body = {};
                        console.log("API request successful. Received reply:", JSON.stringify(body));

                        response_body.status = "success";
                        response_body.url = "/downloads/generated/" + file_name;
                        try {
                            fs.writeFileSync(path.join(__dirname, "../files/datasets/generated/", file_name), JSON.stringify(body), 'utf-8');
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
                        socket.emit("query_builder__response", response_body);
                    } else {
                        console.log("API request failed with error: " + error)
                        console.log("response.statusCode: " + response.statusCode)
                        console.log("response.statusText: " + response.statusText)
                    }
                }); // request ends
            }); // socket event handler ends
        }); // io event handler ends


        res.render('query_builder', {
            title: 'SciBase'
        });
    });

    return router;
}
