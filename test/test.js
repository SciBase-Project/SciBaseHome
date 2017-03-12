var neo4j = require('neo4j');

var db = new neo4j.GraphDatabase({
    url: 'http://pesitsouthscibase.org:7474',
    auth: {
        username: 'neo4j',
        password: 'scibase'
    },

});
var flag = true;

var allQueries = ['MATCH (j:Journal) RETURN j.Name as Name', "MATCH (a:Article) RETURN count(a)", "MATCH (a:Author) RETURN count(a)",
    "MATCH (i:Institution) RETURN count(i)", "MATCH (j:Journal) RETURN count(j)", "MATCH p=(j:Journal)-[c:CONTAINS]->(a:Article) optional match q=(j:Journal)-[c:CONTAINS]->(a:Article)-[:CITED_BY]-() return j.Name as Name,a.Year as Year,a.Month as Month,count(distinct p)as ArticleCount,count(q)as CitationCount order by j.Name, a.Year, a.Month", "MATCH (a:Article) RETURN a.Title",
    "MATCH (a:Author) RETURN a.Name", "MATCH (i:Institution) RETURN i.Name", "MATCH (n:Journal) with max(toFloat(n.SNIP))as val MATCH p= (n:Journal)-[c:CONTAINS]->(a:Article)optional match q= (n:Journal)-[c:CONTAINS]->(a:Article)-[:CITED_BY]->()  return n.Name as Name, (toFloat(n.SNIP)/val)^.25*toFloat(n.NLIQ)^.25*toFloat(n.OCQ)^.25*toFloat(n.ICR)^.25 as InternationalityScore,count(distinct p) as TotalArticleCount,count(q)as TotalCitationCount order by Name"
]
var k;
db.cypher({
    queries: [{
            query: 'MATCH (j:Journal) RETURN j.Name as Name',
        },
        {
            query: "MATCH (a:Article) RETURN count(a)",
        },
        {
            query: "MATCH (a:Author) RETURN count(a)",
        },
        {
            query: "MATCH (i:Institution) RETURN count(i)",
        },
        {
            query: "MATCH (j:Journal) RETURN count(j)",
        },
        {
            query: "MATCH p=(j:Journal)-[c:CONTAINS]->(a:Article) optional match q=(j:Journal)-[c:CONTAINS]->(a:Article)-[:CITED_BY]-() return j.Name as Name,a.Year as Year,a.Month as Month,count(distinct p)as ArticleCount,count(q)as CitationCount order by j.Name, a.Year, a.Month",
        },
        {
            query: "MATCH (a:Article) RETURN a.Title",
        },
        {
            query: "MATCH (a:Author) RETURN a.Name",
        },
        {
            query: "MATCH (i:Institution) RETURN i.Name",
        },
        {
            query: "MATCH (n:Journal) with max(toFloat(n.SNIP))as val MATCH p= (n:Journal)-[c:CONTAINS]->(a:Article)optional match q= (n:Journal)-[c:CONTAINS]->(a:Article)-[:CITED_BY]->()  return n.Name as Name, (toFloat(n.SNIP)/val)^.25*toFloat(n.NLIQ)^.25*toFloat(n.OCQ)^.25*toFloat(n.ICR)^.25 as InternationalityScore,count(distinct p) as TotalArticleCount,count(q)as TotalCitationCount order by Name"
        }
    ],
}, callback1);

function callback1(err, results) {
    if (err) throw err;
    var result = results;
    if (!results) {
        console.log('No journals found.');
        flag = false;
        return -1;
    } else {
        function hasNull(target) {
            for (var member in target) {
                if (target[member] == null)
                    return true;
            }
            return false;
        }
        for (var i = 0; i < results.length; i++) {
            if (results[i].length == 0) {
                console.log("Error -- Query : '" + allQueries[i] + "' returning no data");
                flag = false;
                return -1;
            } else {
                var hasNulls = results[i].some(function(value) {
                    return value === null
                });
                if (hasNulls == true) {
                    console.log("Error -- Query : '" + allQueries[i] + "' has a null link");
                    flag = false;
                    return -1;
                } else {
                    for (var j = 0; j < results[i].length; j++) {
                        k = hasNull(results[i][j]);
                    }
                    if (k == true) {
                        console.log("Error -- Query : '" + allQueries[i] + "' has a null value inside.");
                        flag = false;
                        return -1;
                    }
                }
            }

        }

    }
};
db.cypher({
    queries: [{
        query: 'MATCH (j:Journal) RETURN j.Name as Name',
    }, ]
}, callback2);

function callback2(err, results) {
    if (err) throw err;
    var result = results;
    if (!results) {
        console.log('No journals found.');
        flag = false;
        return -1;
    } else {
        var result = []
        for (var i = 0; i < results[0].length; i++) {

            db.cypher({
                queries: [{
                        query: "MATCH p=(j:Journal)-[c:CONTAINS]->(a:Article)where j.Name = '" + results[0][i]["Name"] + "' optional match q=(j:Journal)-[c:CONTAINS]->(a:Article)-[:CITED_BY]-()  return j.Name as Name,a.Year as Year,a.Month as Month,count(distinct p)as ArticleCount,count(q)as CitationCount order by j.Name, a.Year, a.Month ",

                    },

                ]
            }, callback3);
            actquery = "MATCH p=(j:Journal)-[c:CONTAINS]->(a:Article)where j.Name = '" + results[0][i]["Name"] + "' optional match q=(j:Journal)-[c:CONTAINS]->(a:Article)-[:CITED_BY]-()  return j.Name as Name,a.Year as Year,a.Month as Month,count(distinct p)as ArticleCount,count(q)as CitationCount order by j.Name, a.Year, a.Month "

            function callback3(err, results) {
                if (err) throw err;
                var result = results;
                if (!results) {
                    console.log('No journals found.');
                    flag = false;
                    return -1;
                } else {
                    function hasNull(target) {
                        for (var member in target) {
                            if (target[member] == null)
                                return true;
                        }
                        return false;
                    }

                    if (results[0][0] == null) {
                        console.log("Error -- Query : '" + actquery + "' returning no data");
                        flag = false;
                        return -1;

                    } else {
                        for (var j = 0; j < results[0][0].length; j++) {
                            k = hasNull(results[i][j]);
                        }
                        if (k == true) {
                            console.log("Error -- Query : '" + actquery + "' has a null value inside.");
                            flag = false;
                            return -1;
                        }
                    }
                }

            }
        }
    }
}
