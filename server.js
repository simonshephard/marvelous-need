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

// next set up Exercise model
var Exercise = require('./exerciseModel.js').Exercise;
app.post("/api/exercise/new-user", function (req, res, next) {
  
  // // 1. this gives body back directly from post without saving in db
  // res.json({ reqBody: req.body });
  
  // 2. this creates model using schema and returns model
  var newUrl = new UrlModel({
    longUrl: req.body.url,
    shortUrl: 1
  });
  res.json({ newUrl: newUrl });

  // 3. this does same but increments the count - asynchronous so done in callback
  // Url.count({}, function(err, count) {
  //   var newUrl = new UrlModel({
  //     longUrl: req.body.url,
  //     shortUrl: count+1
  //   });
  //   res.json({ newUrl: newUrl });
  // });

  // 4. same but also saves newUrl to db
  // Url.count({}, function(err, count) {
  //   var newUrl = new UrlModel({
  //     longUrl: req.body.url,
  //     shortUrl: count+1
  //   });
  //   newUrl.save();
  //   res.json({ newUrl: newUrl });
  // });
  
  // // 5. same but just provide old and new url not _id
  // Url.count({}, function(err, count) {
  //   var newUrl = new UrlModel({
  //     longUrl: req.body.url,
  //     shortUrl: count+1
  //   });
  //   newUrl.save();
  //   res.json({
  //     original_url: newUrl.longUrl,
  //     short_url: newUrl.shortUrl
  //   });
  // });
  
  // // 6. same but with check on valid url
  // const postedUrl = url.parse(req.body.url);
  // dns.lookup(postedUrl.hostname, (err, address, family) => {
  //   if (!address) {
  //     res.json({
  //       // address: address,
  //       // url: req.body.url,
  //       // errorType: err,
  //       error: "invalid URL"
  //     });
  //   } else {
  //     UrlModel.count({}, function(err, count) {
  //       var newUrl = new UrlModel({
  //         longUrl: req.body.url,
  //         shortUrl: count+1
  //       });
  //       newUrl.save();
  //       res.json({
  //         // lookup: postedUrl.hostname, 
  //         // address: address,
  //         // family: family,
  //         original_url: newUrl.longUrl,
  //         short_url: newUrl.shortUrl
  //       });
  //     });      
  //   }
  // });
  
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
