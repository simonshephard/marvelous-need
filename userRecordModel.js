var mongoose = require('mongoose');
mongoose.connect(process.env.MLAB_URI);


// set up schema
var Schema = mongoose.Schema;
var userExerciseSchema = new Schema({
  name: {type: String,
         required: true},
  exercises: {type: Array,
             default: []}
});
var userExerciseModel = mongoose.model('userExercise', userExerciseSchema);


// var findUrlByShortUrl = function(shortUrl, done) {
//   UrlModel.find({shortUrl: shortUrl}, function(err, data) {
//     if (err) return done(err);
//     return done(null, data);
//   });
// };


exports.UserExercise = userExerciseModel;
// exports.findUrlByShortUrl = findUrlByShortUrl;
