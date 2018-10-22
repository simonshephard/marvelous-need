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
// NOTE: I beleive that the first param here should be singular
// database collection will be plural lowercase - here database became "userexercises"

// var findUrlByShortUrl = function(shortUrl, done) {
//   UrlModel.find({shortUrl: shortUrl}, function(err, data) {
//     if (err) return done(err);
//     return done(null, data);
//   });
// };


exports.UserExercise = userExerciseModel;
// exports.findUrlByShortUrl = findUrlByShortUrl;
