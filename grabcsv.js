var mongoose = require("mongoose");
var csv = require("./models/csv")
try {
  mongoose.connect('mongodb://localhost/scibase');
} catch (err) {
  throw new Error("Could not connect to database");
}
csv.findOneAndRemove({ "name" :'update' },function(err,doc,result){
    if(err)
    console.log(err)
    else {
        console.log("Removed date from mongodb.");
        return -1;
    }

})
