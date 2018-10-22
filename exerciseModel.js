var mongoose = require('mongoose');
mongoose.connect(process.env.MLAB_URI);


// set up schema
var Schema = mongoose.Schema;
var exerciseSchema = new Schema({
  name: {type: String,
         required: true},
  exercise: {type: ArayNumber}
});
var UrlModel = mongoose.model('url', urlSchema);


var findUrlByShortUrl = function(shortUrl, done) {
  UrlModel.find({shortUrl: shortUrl}, function(err, data) {
    if (err) return done(err);
    return done(null, data);
  });
};


exports.UrlModel = UrlModel;
exports.findUrlByShortUrl = findUrlByShortUrl;
