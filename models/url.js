var mongoose = require("mongoose");

var urlSchema = mongoose.Schema({
    originalUrl : String,
    shortUrl : String,
    createDate: {type: Date, default: Date.now},
    expDate: {type : Date}
});

module.exports = mongoose.model("url", urlSchema);
