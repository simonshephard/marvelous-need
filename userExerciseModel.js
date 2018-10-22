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


var getAllDocs = function() {
  userExerciseModel.find({}, function(err, docs) {
    return docs;
  });
};

var getUsers = function() {
  var docs userExerciseModel.find({}, function(err, docs) {
    return docs;
  });
};



exports.UserExercise = userExerciseModel;
// exports.findUrlByShortUrl = findUrlByShortUrl;
