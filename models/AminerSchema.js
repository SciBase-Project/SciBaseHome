var mongoose = require('mongoose');

var AminerSchema = new mongoose.Schema({
    index : String,
    publication : String,
    title : String,
    abstract : String,
    authors : [
        String
    ],
    references : [
        String
    ],
    year : String
},
    { collection : 'aminer' });

mongoose.model('Aminer', AminerSchema);