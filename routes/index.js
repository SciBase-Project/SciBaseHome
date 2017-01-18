module.exports = function(io) {
    var express = require('express');
    var router = express.Router();
    var request = require("request");
    var fs = require("fs");
    var path = require("path");
    var util = require("../lib/util");
    var hbs = require('hbs');

    hbs.registerHelper('toUpperCase', function(str){
        return str.toUpperCase();
    });

    hbs.registerHelper('parseJson', function(context){
        return JSON.stringify(context);
    });

    hbs.registerHelper('capitalize', function(str){
        return (str + '').replace(/^([a-z])|\s+([a-z])/g, function ($1) {
            return $1.toUpperCase();
        });
    });
    
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

            console.log("Result: ",result);
            result.title = "SciBase";

            result.JournalCsvUrl = "files/papers/Journals.csv";
            result.ArticleCsvUrl = "files/papers/Articles.csv";
            result.AuthorCsvUrl = "files/papers/Authors.csv";
            result.InstitutionCsvUrl = "files/papers/Institutions.csv";

            util.generateArticleCsv();
            util.generateJournalCsv();
            util.generateAuthorCsv();
            util.generateInstitutionCsv();

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
                description: "This dataset consists of 40 ACM Journals with all the Articles and related information.",
                download_link: "https://s3.ap-south-1.amazonaws.com/scibasedatasets/datasets/ACM+dataset.tar.gz",
                internal: false,
                format: "JSON",
                size: "60 MB",
                category: "scibase-dataset"
            }, {
                title: "Indian Journals",
                description: "This dataset consists of a fewer number of Indian Journals from diverse domains and respective Articles published in last 3 years (2012 to 2016).",
                download_link: "https://s3.ap-south-1.amazonaws.com/scibasedatasets/datasets/DataSet-IndianJournals.tar.gz",
                internal: false,
                format: "JSON",
                size: "118 KB",
                category: "scibase-dataset"
            }, {
                title: "International Journals",
                description: "This dataset consists of a International Journals from diverse domains and respective Articles published in last 3 years (2012 to 2016).",
                download_link: "https://s3.ap-south-1.amazonaws.com/scibasedatasets/datasets/DataSet_InternationalJournal.tar.gz",
                internal: false,
                format: "JSON",
                size: "5.3 MB",
                category: "scibase-dataset"
            }, {
                title: "Scholastic Indices",
                description: "This is a dataset which has the scholastic indices such as Other Citation Count, Non Local Influence Quotient, SNIP and International Collaboration Ratio for the 40 ACM Journals.",
                download_link: "https://s3.ap-south-1.amazonaws.com/scibasedatasets/datasets/ScholasticIndices.csv",
                internal: false,
                format: "CSV",
                size: "4 KB",
                category: "scibase-dataset"
            }, {
                title: "Terence Tao Dataset",
                description: "This dataset consists of top four highly cited articles and the nested references for it up to 4 levels of Terence Tao, an Australian-American mathematician and a co-recipient of the 2006 Fields Medal and the 2014 Breakthrough Prize in Mathematics.",
                download_link: "https://s3.ap-south-1.amazonaws.com/scibasedatasets/datasets/T+Tao.zip",
                internal: false,
                format: "JSON",
                size: "137 MB",
                category: "scibase-dataset"

            },
        ];
        var filterSearch = {};
        filterSearch.journal = "all";
        filterSearch.author = "all";
        filterSearch.country = "all";
        filterSearch.year = "all";
        util.search_article(filterSearch, function(result){
            if(!result){
                console.log("Error loading search_article");
            }

            res.render('datacenter', {
                datasets: dataset_list,
                dataset : result
            });
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
        util.getNodes(function(result){

        

        // socket.io events
        io.on("connection", function(socket) {
            console.log("A user connected");
                   
       //console.log("this");
        //console.log(result);
            /**
             * When a user enters a Cypher query, the data is sent with query_request
             * event of socket.
             */
            socket.on('query_builder__request', function(cols) {
                //console.log(result);
                var column_names = cols;
                var query;

                var statement = String(column_names).split(/[->,]+/);
               // console.log(statement);


                var temp = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
                var nodesRec = [];
                var indexOfNode = -1;
                var return_param="", matching_param="";
                var jsonRelationship = [];

                for(var i =0; i< statement.length;i++){

                    if(i%2 !=0){
                        indexOfNode = (nodesRec.indexOf(statement[i-1]) + 1);
                        return_param += ( nodesRec[indexOfNode]+".`"+statement[i]+"`" );
                        if(i < statement.length - 1)
                            return_param += ","; 
                    }else{
                        if(nodesRec.indexOf(statement[i]) == -1){
                            nodesRec.push(statement[i]);
                            nodesRec.push(temp[i/2]);
                            
                            if(i>0){
                                item = {}
                                item["statement"] = "MATCH (n:`"+statement[i-2]+"`)-[r]->(`"+statement[i]+"`) RETURN DISTINCT TYPE(r)";
                                jsonRelationship.push(item);
                            }
                           
                        }
                        
                        
                    }

                }
                
                var jsonQuery = {
                    "statements" : jsonRelationship
                };
               // console.log(jsonQuery);

                var relationships = [];

                var auth_payload = new Buffer(NEO4J_USER + ":" + NEO4J_PASS).toString('base64');

                var res_1 = request({
                        url: NEO4J_API_URL,
                        method: "POST",
                        json: jsonQuery,
                        headers: {
                            "Authorization": "Basic " + auth_payload,
                            "Accept": "application/json; charset=UTF-8",
                        }
                    }, function(err, response, body) {
                        //console.log(body.results[0].data.length);
                        if (!err && response.statusCode === 200) {
                            
                            for(var i=0;i<body.results.length; i++){
                                if(body.results[i].data.length != 0){
                                    console.log("this " + body.results[i].data[0].row[0]);
                                    console.log("length " + body.results[i].data.length );
                                    relationships.push(body.results[i].data[0].row[0]);
                                } else{
                                    relationships.push("contains");
                                }
                                
                            }
                            
                            for(var j = 0, k=0; j<nodesRec.length; j+=2){

                                matching_param +=((j==0)?("("+nodesRec[j+1]+":`"+nodesRec[j]+"`)"):("-[:"+relationships[k++]+"]->"+"("+nodesRec[j+1]+":`"+nodesRec[j]+"`)"));

                            }
                

                            

                            query = "MATCH "+matching_param+" RETURN " +return_param;

                            

                            var request_json = {
                                "statements": [{
                                    "statement": query
                                }]
                            };
                            
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
                                    response_body.json_url = "files/papers/" + file_name_base + ".json";
                                    response_body.csv_url = "files/papers/" + file_name_base + ".csv";
                                    console.log(JSON.stringify(response_body));
                                    try {
                                        fs.writeFileSync(path.join(__dirname, "../public/files/papers/", file_name_base + ".json"), JSON.stringify(body), 'utf-8');
                                    } catch (e) {
                                        console.log("Error:", e.message);
                                        response_body.status = "error";
                                        response_body.json_url = null;
                                    }

                                    try {
                                        fs.writeFileSync(path.join(__dirname, "../public/files/papers/", file_name_base + ".csv"), util.jsonToCsv(body), 'utf-8');
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
                            }); // data request ends

                        } else{

                        console.log(err);
                    }
                        
                }); // relationships request ends

            }); // socket event handler ends
        }); // io event handler ends

        res.render('query_builder', {dataModel : result});
        });
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

    io.on("connection", function(socket) {
            console.log("A user connected");

                socket.on('filterSearch_request', function(filter) {
                    console.log("Socket connected");
                    console.log(filter);
                    util.search_article(filter, function(filterResult){
                        //console.log("filterResult", filterResult);
                        socket.emit("filterSearch_response", filterResult);
                        console.log("Socket emitted");
                    });
                   
                }); // socket event handler ends

                socket.on('downloadArticleData_request', function(articleData){
                    console.log("Downloading");
                    var file_name_base = util.randomString(20);

                    var response_body = {};
                    
                    response_body.csv_url = "files/papers/" + file_name_base + ".csv";

                    var csv = "";
                    csv += '"Title","DOI","Month","Year"\n';
                    for (var i = 0; i < articleData.length; i++) {

                        csv += '"' + articleData[i].title + '","' + articleData[i].doi + '","' + articleData[i].month + '","' + articleData[i].year + '"\n';
                    }
                    
                    try {
                        fs.writeFileSync(path.join(__dirname, "../public/files/papers/", file_name_base + ".csv"), csv, 'utf-8');
                        response_body.status = "success";

                    } catch (e) {
                        console.log("Error:", e.message);
                        response_body.status = "error";
                        response_body.csv_url = null;
                    }
                    
                    socket.emit("downloadArticleData_response", response_body);

                });

                
    }); // io event handler ends
    
    return router;
};
