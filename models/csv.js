 var mongoose = require('mongoose');
var updateCsv = new mongoose.Schema({
    name : String,
	update_next: { type: Date, default : Date.now },
});
module.exports = mongoose.model('updateCsv', updateCsv); 