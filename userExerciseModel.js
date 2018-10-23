var mongoose = require('mongoose');
mongoose.connect(process.env.MLAB_URI);


// set up schema
var Schema = mongoose.Schema;
var userExerciseSchema = new Schema({
  name: {type: String, required: true},
  exercises: [{
      description: {type: String, required: true},
      duration: {type: String, required: true},
      date: {type: String, required: false}
    }]
});
var userExerciseModel = mongoose.model('userExercise', userExerciseSchema);
// NOTE: I beleive that the first param here should be singular
// database collection will be plural lowercase - here database became "userexercises"


// NEED TO SOLVE ASYNCHRONICITY BEFORE USING FUNCTIONS INDIRECTLY TO GET DATA******
var getAllDocs = function() {
  userExerciseModel.find({}, function(err, docs) {
    return docs;
  });
};
var getAllUsers = function() {
  var docs = getAllDocs();
  var users = [];
  for (let doc in docs) {
      users.push({
        name: doc.name,
        id: doc._id
      });
  }
  return users;
};



exports.UserExercise = userExerciseModel;
exports.getAllDocs = getAllDocs;
exports.getAllUsers = getAllUsers;
