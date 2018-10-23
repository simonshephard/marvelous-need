const express = require('express')
const app = express()
const bodyParser = require('body-parser')

const cors = require('cors')

const mongoose = require('mongoose')
mongoose.connect(process.env.MLAB_URI || 'mongodb://localhost/exercise-track' )

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())


app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


// TODO********************************************

// Create a New User
// POST /api/exercise/new-user
// returned will be an object with username and _id

// Add exercises
// POST /api/exercise/add
// posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date.
// Returned will the the user object with also with the exercise fields added.

// GET all users
// api/exercise/users with the same info as when creating a user

// GET users's exercise log: GET /api/exercise/log?{userId}[&from][&to][&limit]
// { } = required, [ ] = optional
// from, to = dates (yyyy-mm-dd); limit = number
// Return will be the user object with added array log and count (total exercise count).

// I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
// I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
// I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. Returned will the the user object with also with the exercise fields added.
// I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). Return will be the user object with added array log and count (total exercise count).
// I can retrieve part of the log of any user by also passing along optional parameters of from & to or limit. (Date format yyyy-mm-dd, limit = int)



// first check API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

// next set up UserExercise model
var UserExercise = require('./userExerciseModel.js').UserExercise;


// next allow create new user
app.post("/api/exercise/new-user", function (req, res, next) {
  
  // 1. this gives body back directly from post without saving in db
  // res.json({ reqBody: req.body });
  
  // 2. this creates model using schema and returns model
  // NOTE: it gives an id but still does not save in db
  // var userExercise = new UserExercise({
  //   name: req.body.username,
  // });
  // res.json({ userExercise: userExercise });

  // {
  //   "userExercise": {
  //   "name": "Simon",
  //   "_id": "5bcdfc74a7ea3c3afebda94a",
  //   "exercises": []
  //   }
  // }
  
  // 3. same but also saves to db
  // var userExercise = new UserExercise({
  //   name: req.body.username,
  // });
  // userExercise.save();
  // res.json({ userExercise: userExercise });
  
  // 4. same but just provides required {name, _id}
  var userExercise = new UserExercise({
    name: req.body.username
  });
  userExercise.save();
  res.json({
    name: userExercise.name,
    id: userExercise._id
  });
    
});


// next allow get all users from api/exercise/users

// NEED TO SOLVE ASYNCHRONICITY BEFORE USING FUNCTIONS INDIRECTLY TO GET DATA******
// var getAllUsers = require('./userExerciseModel.js').getAllUsers;
// var getAllDocs = require('./userExerciseModel.js').getAllDocs;

app.get("/api/exercise/users", function (req, res, next) {
    UserExercise.find({}, function(err, docs) {
      // res.json({ docs: docs }); // docs is an array of userExercise objects      
      const users = [];
      for (let doc of docs) {
        users.push({
          name: doc.name,
          id: doc._id
        });
      }
      res.json({ users: users });
    });
});


// next allow add exercises to users - update users
// POST /api/exercise/add
// posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date.
// Returned will the the user object with also with the exercise fields added.

app.post("/api/exercise/add", function (req, res) {
  
  // 1. first just return posted information back
  // res.json({ reqBody: req.body });

  // {
  //   "reqBody": {
  //     "userId": "id",
  //     "description": "desc",
  //     "duration": "dur",
  //     "date": "date"
  //   }
  // }
  
  
  // 2. same but return formatted information back
  // res.json({
  //   _id: req.body.userId,
  //   description: req.body.description,
  //   duration: req.body.duration,
  //   date: req.body.date
  // });
  
  // {
  //   "_id": "id",
  //   "description": "desc",
  //   "duration": "dur",
  //   "date": "date"
  // }

  
  // 3. now use data to create exercise and return
  // var newExercise = {
  //   description: req.body.description,
  //   duration: req.body.duration,
  //   date: req.body.date
  // };
  // res.json(newExercise);
  
  
  // 4. now find add exercise and return
  // const newExercise = {
  //   description: req.body.description,
  //   duration: req.body.duration,
  //   date: req.body.date
  // };
  // UserExercise.findById(req.body.userId, function(err, doc) {
  //   doc.exercises.push(newExercise);
  //   res.json(doc);    
  // });

  
  // 5. same but also save and use current date if none supplied
  let dateValue = todaysdate.
  if (req.body.date == "") {
  }
  const newExercise = {
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date
  };
  console.log("newExercise:", newExercise);
  
  
  // FAILS - problem with $push
  // UserExercise.findOneAndUpdate({_id: req.body.userId}, {"$push": {exercises: newExercise}}, {new: true}, function(err, doc) {
  
  // SUCCEEDS BUT REPLACES EXERCISE INSTEAD OF ADDING
  // UserExercise.findOneAndUpdate({_id: req.body.userId}, {exercises: newExercise}, {new: true}, function(err, doc) {
  //   if(err) {console.log("err:", err);}
  //   console.log("docBeforeUpdate:", doc);  // UPDATE METHOD WORKS BUT THIS DOC IS THE ONE PRIOR TO UPDATE
  //   res.json(doc);
  // });
  
  // FAILS - DOES NOT UPDATE AND DOES NOT RETURN
  // UserExercise.update({_id: req.body.userId}, {$push: {exercises: newExercise}}, function(err, doc) {
  //   if(err) {console.log(err);}
  //   console.log("docBeforeUpdate:", doc);  // UPDATE METHOD WORKS BUT THIS DOC IS THE ONE PRIOR TO UPDATE UNLESS SPECIFY NEW
  //   res.json(doc);
  // });
  
  // SEEMS TO BE ISSUE WITH $PUSH EITHER USED EXPLICITLY OR UNDERLYING SOME OF UPDATE METHODS

  UserExercise.findOne({_id: req.body.userId}, function(err, doc) {
    if(err) {console.log(err);}
    console.log("docBeforeUpdate:", doc);
    console.log("retreived:", doc.exercises);
    doc.exercises.push(newExercise);
    console.log("updated:", doc);
    // FAILS
    // doc.save();
    // FAILS
    // doc.update();
    // FAILS
    // UserExercise.update({_id: req.body.userId}, {exercises: doc});
    // console.log("docAfterSave:", doc);
    // res.json(doc);
    
    UserExercise.findOneAndUpdate({_id: req.body.userId}, {exercises: doc.exercises}, {new: true}, function(err, updatedDoc) {
      if(err) {console.log("err:", err);}
      console.log("updatedAndSaved?:", updatedDoc);
      // Unformatted data
      // res.json(updatedDoc);
      // Formatted version of data
      const exercises = [];
      for (let exercise of updatedDoc.exercises) {
        exercises.push({
          description: exercise.description,
          duration: exercise.duration,
          date: exercise.date
        });
      }
      res.json({
        name: updatedDoc.name,
        exercises: exercises
      });

    });

  });    
  
    
});





// Not found middleware
app.use((req, res, next) => {
  return next({status: 404, message: 'not found'})
})

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage

  if (err.errors) {
    // mongoose validation error
    errCode = 400 // bad request
    const keys = Object.keys(err.errors)
    // report the first validation error
    errMessage = err.errors[keys[0]].message
  } else {
    // generic or custom error
    errCode = err.status || 500
    errMessage = err.message || 'Internal Server Error'
  }
  res.status(errCode).type('txt')
    .send(errMessage)
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
