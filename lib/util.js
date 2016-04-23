var crypto = require("crypto");
var request = require("request");

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
        var csv = "";

        csv += data.columns.join(',') + '\n';
        for (var i = 0; i < data.data.length; i++) {
            csv += '"' + data.data[i].row.join('","') + '"\n';
        }

        return csv;
    },

    getStats: function(callback) {
        var NEO4J_API_URL = "http://" + process.env.NEO4J_HOST + ":7474/db/data/transaction/commit";
        var NEO4J_USER = process.env.NEO4J_USER;
        var NEO4J_PASS = process.env.NEO4J_PASS;

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
    }
};
