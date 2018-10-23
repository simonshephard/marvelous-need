var mongoose = require('mongoose');
mongoose.connect(process.env.MLAB_URI);


// set up schema
var Schema = mongoose.Schema;
// var exerciseSchema = new Schema({
//   description: {type: String, required: true},
//   duration: {type: String, required: true},
//   date: {type: String, required: false}
// });

var userExerciseSchema = new Schema({
  name: {type: String, required: true},
  exercises: [{
    description: {type: String, required: true},
    duration: {type: String, required: true},
    date: {type: String, required: false}
  }]
});
var userExerciseModel = mongoose.model('userExercise', userExerciseSchema);
// NOTE: I believe that the first param here should be singular
// database collection will be plural lowercase - here database became "userexercises"

exports.UserExercise = userExerciseModel;