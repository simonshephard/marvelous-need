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

  
//   *******DATE************
  // 5. same but also save
  const newExercise = {
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date
  };
  console.log("newExercise:", newExercise);

  // THIS FAILS
  // UserExercise.findOneAndUpdate({_id: req.body.userId}, {$push: {exercises: newExercise}}, function(err, doc) {
  
  // THIS SUCCEEDS BUT DOES NOT ADD
  UserExercise.findOneAndUpdate({_id: req.body.userId}, {exercises: newExercise}, function(err, doc) {
    if(err) {console.log(err);}
    console.log("updatedDocAfterUpdate:", doc);
    res.json(doc);
  });

  

// {
// "name": "New2",
// "id": "5bcedb74f945f90c00f91d78"
// }
  
//   UserExercise.findById(req.body.userId, function(err, doc) {
    
//     console.log("docStart:", doc);
    
//     doc.exercises.push(newExercise);
//     console.log("docAfterPush:", doc);
    
    // doc.update((err, updatedDoc) => {
    //   console.log("updatedDocAfterUpdate:", updatedDoc);
    // });
    // console.log("docAfterUpdate:", doc);    
    // // updatedDocAfterUpdate: { ok: 0, n: 0, nModified: 0 }
    
//     doc.save((err, updatedDoc) => {
//       if(err) {console.log(err);}
//       console.log("updatedDocAfterUpdate:", updatedDoc);
//     });
//     console.log("docAfterUpdate:", doc);
//     // { MongoError: Unknown modifier: $pushAll
//     //     at Function.MongoError.create (/rbd/pnpm-volume/d8ea260b-7c11-40a9-845f-f21ddde1d877/node_modules/.registry.npmjs.org/mongodb-core/2.1.18/node_modules/mongodb-core/lib/error.js:31:11)
//     //     at toError (/rbd/pnpm-volume/d8ea260b-7c11-40a9-845f-f21ddde1d877/node_modules/.registry.npmjs.org/mongodb/2.2.34/node_modules/mongodb/lib/utils.js:139:22)
//     //     at /rbd/pnpm-volume/d8ea260b-7c11-40a9-845f-f21ddde1d877/node_modules/.registry.npmjs.org/mongodb/2.2.34/node_modules/mongodb/lib/collection.js:1059:67
//     //     at /rbd/pnpm-volume/d8ea260b-7c11-40a9-845f-f21ddde1d877/node_modules/.registry.npmjs.org/mongodb-core/2.1.18/node_modules/mongodb-core/lib/connection/pool.js:469:18
//     //     at _combinedTickCallback (internal/process/next_tick.js:67:7)
//     //     at process._tickCallback (internal/process/next_tick.js:98:9)
//     //   name: 'MongoError',
//     //   message: 'Unknown modifier: $pushAll',
//     //   driver: true,
//     //   index: 0,
//     //   code: 9,
//     //   errmsg: 'Unknown modifier: $pushAll' }
//     // updatedDocAfterUpdate: undefined
  
//   });
    

// {
//   "doc": {
//     "_id": "5bce6075d6cfd26ff0b30757",
//     "name": "New1",
//     "__v": 0,
//     "exercises": [
//       {
//         "description": "des",
//         "duration": "dur",
//         "date": "dat",
//         "_id": "5bce6131794918714b22a2da"
//       }
//       ]
//   }
// }
    
    
  
    
});

// {
// "users": [
// {
// "name": "New1",
// "id": "5bce6075d6cfd26ff0b30757"
// },
// {
// "name": "New2",
// "id": "5bce6081d6cfd26ff0b30758"
// }
// ]
// }


// var findUrlByShortUrl = require('./myApp.js').findUrlByShortUrl;
// app.get("/api/shorturl/:shortUrl", function (req, res) {
//   findUrlByShortUrl(req.params.shortUrl, function(err, data) {
//     // res.json({
//     //   return: data,
//     //   url: data[0].longUrl,
//     //   parsed: url.parse(data[0].longUrl),
//     //   href: url.parse(data[0].longUrl).href
//     // });
//     // res.redirect(url.parse(data[0].longUrl).href);
//     res.redirect(data[0].longUrl);
//   });
// });



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
