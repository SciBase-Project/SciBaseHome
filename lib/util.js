var crypto = require("crypto");
var request = require("request");
var fs = require("fs");
var path = require("path");

module.exports = {
    randomString: function(howMany, chars) {
        chars = chars || "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
        var rnd = crypto.randomBytes(howMany),
            value = new Array(howMany),
            len = chars.length;

        for (var i = 0; i < howMany; i++) {
            value[i] = chars[rnd[i] % len];
        }

        return value.join('');
    },

    jsonToCsv: function(json_data) {
        var data = json_data.results[0];
        //console.log("data:" data);
        var csv = "";

        csv += data.columns.join(',') + '\n';
        //console.log(data.data.length);
        for (var i = 0; i < data.data.length; i++) {
            //console.log(data.data[i].row);
            csv += '"' + data.data[i].row.join('","') + '"\n';
        }

        return csv;
    },

    getStats: function(callback) {
        var NEO4J_API_URL = "http://localhost:7474/db/data/transaction/commit";
        var NEO4J_USER = "neo4j";
        var NEO4J_PASS = "scibase";

        var request_json = {
            "statements": [{
                "statement": "MATCH (a:Article) RETURN count(a)"
            }, {
                "statement": "MATCH (a:Author) RETURN count(a)"
            }, {
                "statement": "MATCH (i:Institution) RETURN count(i)"
            }, {
                "statement": "MATCH (j:Journal) RETURN count(j)"
            }]
        };

        var counts_object = {
            journal_count: 0,
            article_count: 0,
            author_count: 0,
            institution_count: 0,
        };

        var auth_payload = new Buffer(NEO4J_USER + ":" + NEO4J_PASS).toString('base64');
        var res = request({
            url: NEO4J_API_URL,
            method: "POST",
            json: request_json,
            headers: {
                "Authorization": "Basic " + auth_payload,
                "Accept": "application/json; charset=UTF-8",
            }
        }, function(err, response, body) {
            //console.log(request_json);
            //console.log(body.results[0].data.length);
            if (!err && response.statusCode === 200) {
                counts_object.article_count = body.results[0].data[0].row[0];
                counts_object.author_count = body.results[1].data[0].row[0];
                counts_object.institution_count = body.results[2].data[0].row[0];
                counts_object.journal_count = body.results[3].data[0].row[0];
            }
            else {
                console.log(err);
            }
            callback(counts_object);
        }); // request ends
    },

    getNodes: function(callback) {
        var NEO4J_API_URL = "http://localhost:7474/db/data/transaction/commit";
        var NEO4J_USER = "neo4j";
        var NEO4J_PASS = "scibase";
        var query = "Start n = node(*) return distinct labels(n)";

        var request_json = {
            "statements": [{
                "statement": query
            }]
        };
        var nodes = [];
        var auth_payload = new Buffer(NEO4J_USER + ":" + NEO4J_PASS).toString('base64');
        var res = request({
            url: NEO4J_API_URL,
            method: "POST",
            json: request_json,
            headers: {
                "Authorization": "Basic " + auth_payload,
                "Accept": "application/json; charset=UTF-8",
            }
        }, function(err, response, body) {
            var dataModel=[];
            if (!err && response.statusCode === 200) {
                
                var jsonObj = [];
                
                for(var i=0;i<body.results[0].data.length; i++){
                    
                    nodes.push(body.results[0].data[i].row[0]);
                   // console.log("Pushing into Node "+ nodes[i]);
                    item = {}
                    item ["statement"] = "Match (a:`"+body.results[0].data[i].row[0]+"`) return distinct keys(a)";
                    jsonObj.push(item);

                }
                var jsonSecond = {
                    "statements": jsonObj
                };

                var res2 = request({
                    url: NEO4J_API_URL,
                    method: "POST",
                    json: jsonSecond,
                    headers: {
                        "Authorization": "Basic " + auth_payload,
                        "Accept": "application/json; charset=UTF-8",
                    }
                }, function(err, response, body) {

                        var dataModelJson = [];
                        if (!err && response.statusCode === 200) {
                            
                            
                            
                            for(var i=0; i<body.results.length; i++){
                                dataModel.push(body.results[i].data[0].row[0]);
                                var arr = String(body.results[i].data[0].row[0]).split(',');

                                for(var k = 0; k< arr.length; k++){
                                    item = {}
                                    item["node"] = nodes[i];
                                    item["key"] = arr[k];
                                    dataModelJson.push(item);
                                }
                            }
                            

                        }
                        else {
                            console.log(err);
                        }
                       //console.log(dataModel) ;
                       callback(dataModelJson);
                    }); // request ends


            }
            else {
                console.log(err);
                callback(null);
            }

          // console.log("here:"+dataModel);
        }); // request ends
    },
    generateJournalCsv : function(){
                var NEO4J_API_URL = "http://localhost:7474/db/data/transaction/commit";
                var NEO4J_USER = "neo4j";
                var NEO4J_PASS = "scibase";
                var query = "MATCH (j:Journal) RETURN j.Name";

               // console.log(return_param);

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
                        //var file_name_base = util.randomString(20);
                        //console.log(JSON.stringify(response_body));
                        try {
                             fs.writeFileSync(path.join(__dirname, "../public/files/papers/", "Journals.csv"),module.exports.jsonToCsv(body), 'utf-8');
                           //fs.writeFileSync("/files/papers/Journal.csv",module.exports.jsonToCsv(body), 'utf-8');
                        } catch (e) {
                            console.log("Error:", e.message);
                        }
                    }else{
                        console.log("Unable to generate Journal.csv !");
                    }
                });
    },
    generateArticleCsv : function(){
                var NEO4J_API_URL = "http://localhost:7474/db/data/transaction/commit";
                var NEO4J_USER = "neo4j";
                var NEO4J_PASS = "scibase";
                var query = "MATCH (a:Article) RETURN a.Title";

               // console.log(return_param);

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
                        //var file_name_base = util.randomString(20);
                        //console.log(JSON.stringify(response_body));
                        try {
                            fs.writeFileSync(path.join(__dirname, "../public/files/papers/", "Articles.csv"),module.exports.jsonToCsv(body), 'utf-8');
                        } catch (e) {
                            console.log("Error:", e.message);
                        }
                    }else{
                        console.log("Unable to generate Articles.csv !");
                    }
                });
    },
    generateAuthorCsv : function(){
                var NEO4J_API_URL = "http://localhost:7474/db/data/transaction/commit";
                var NEO4J_USER = "neo4j";
                var NEO4J_PASS = "scibase";
                var query = "MATCH (a:Author) RETURN a.Name";

               // console.log(return_param);

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
                        //var file_name_base = util.randomString(20);
                        //console.log(JSON.stringify(response_body));
                        try {
                            fs.writeFileSync(path.join(__dirname, "../public/files/papers/", "Authors.csv"),module.exports.jsonToCsv(body), 'utf-8');
                        } catch (e) {
                            console.log("Error:", e.message);
                        }
                    }else{
                        console.log("Unable to generate Authors.csv !");
                    }
                });
    },
    generateInstitutionCsv : function(){
                var NEO4J_API_URL = "http://localhost:7474/db/data/transaction/commit";
                var NEO4J_USER = "neo4j";
                var NEO4J_PASS = "scibase";
                var query = "MATCH (i:Institution) RETURN i.Name";

               // console.log(return_param);

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
                        //var file_name_base = util.randomString(20);
                        //console.log(JSON.stringify(response_body));
                        try {
                            fs.writeFileSync(path.join(__dirname, "../public/files/papers/", "Institutions.csv"),module.exports.jsonToCsv(body), 'utf-8');
                        } catch (e) {
                            console.log("Error:", e.message);
                        }
                    }else{
                        console.log("Unable to generate Institutions.csv !");
                    }
                });
    }
};
