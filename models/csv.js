 var mongoose = require('mongoose');
var schema = mongoose.Schema;
 var updateCsv = new schema({
     name : String,
     update_next: { type: Date, default : Date.now },
 },{collection : "counts"});

 var updateCsvModel = mongoose.model("updateCsvModel", updateCsv);
module.exports = updateCsvModel
