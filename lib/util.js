var crypto = require("crypto");

module.exports = {
  randomString: function (howMany, chars) {
    chars = chars
        || "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    var rnd = crypto.randomBytes(howMany)
        , value = new Array(howMany)
        , len = chars.length;

    for (var i = 0; i < howMany; i++) {
        value[i] = chars[rnd[i] % len]
    };

    return value.join('');
  },

  jsonToCsv: function(json_data) {
    var data = json_data['results'][0];
    var csv = "";

    csv += data['columns'].join(',') + '\n';
    for(var i=0; i<data['data'].length; i++)
    {
        csv += data['data'][i]['row'].join(',') + '\n';
    }

    return csv;
  }
}
