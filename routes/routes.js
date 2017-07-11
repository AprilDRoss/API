const express = require('express');
const mustacheExpress = require('mustache-express');
const router = express.Router();
const mongo = require('mongo');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const assert = require('assert');


//*****Fix this after you fix the models folder*******
//const models = require("../models/activities.js");

//mongoose connection
 mongoose.Promise = require("bluebird");
 mongoose.connect("mongodb://localhost:27017/activitiesTracker");
 //var url = 'mongodb://localhost:27017/activityTracker';

passport.use(new BasicStrategy(
  function(username, password, done) {
    user.findOne({ username: req.body.username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

//mongoose Schema for every activity
const activitySchema = new Schema({
  id: {type:String, required:true},
  url: String,
  records: [{
    record_id: Number,
    date: [String],
    logged: [String],
  }],
});

const userSchema = new Schema({
  id: Number,
  username: String,
  password: String
});

//Activity is the collection name; mongoose will lowercase and pluralize it
const activities = mongoose.model('activities', activitySchema);
const users = mongoose.model('users', userSchema);

//authentication
router.get('/',
  passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.json({ username: req.user.username, password: req.user.password });
  });

//Get all activities
router.get('/api/activities', function(req, res){
  activities.find({}).then(function(allActivities){
    if(allActivities){
      res.setHeader('Content-Type','application/json');
      res.status(200).json(allActivities);
    }else{
      res.send("No activities found.")
    }
  }).catch(function(err){
    res.status(400).send("Bad request. Try again.")
  });
});

//POST a new activity
router.post('/api/activities', function(req, res){
  let activity = ({
    id:req.body.id,
    url:"//localhost:8080/api/activities/" + req.body.id,
    records: [{
      record_id: req.body.record_id,
      date: req.body.date,
      logged: req.body.logged
    }]
  });
  activities.create(activity).then(function(newActivity){
    if (newActivity){
      res.setHeader('Content-Type','application/json');
      res.status(201).json(newActivity);
    }else{
      res.status(403).send("No activity found, sorry");
    }
  }).catch(function(err){
    res.status(400).send("Bad request. Please try again.")
  })
});

//GET activites by id (name)
router.get('/api/activities/:id', function(req, res){
  activities.findOne({"id":req.params.id}).then(function(newActivity){
    if (newActivity){
      res.setHeader('Content-Type','application/json');
      res.status(201).json(newActivity);
    }else{
      res.status(403).send("No activity found, sorry");
    }
  }).catch(function(err){
    res.status(400).send("Bad request. Please try again.")
  })
});

//PUT to update a name
router.put('/api/activities/:id', function(req, res){
  activities.updateOne({"id":req.params.id},{$set:{"id":req.body.id}}).then(function(newActivity){
    if (newActivity){
      res.setHeader('Content-Type','application/json');
      res.status(201).json(newActivity);
    }else{
      res.status(403).send("No activity found, sorry");
    }
  }).catch(function(err){
    res.status(400).send("Bad request. Please try again.")
  })
});

//
//Delete an activity
router.delete('/api/activities/:id', function(req, res){
  activities.deleteOne({"id":req.params.id}).then(function(newActivity){
    if(newActivity){
      res.status(200).send("Successfully removed activity.");
    } else {
      res.status(404).send("Activity not found.");
    }
  }).catch(function(err) {
    res.status(400).send("Bad request. Please try again.");
  })
});

//POST request to add stats and overide logged data
router.post('/api/activities/:id/stats', function(req, res){
  activities.findOneandUpdate({"id":req.params.id},
       {$set:{"date":req.body.date, "logged":req.body.logged}}).then(function(newActivity){
    if (newActivity){
      res.setHeader('Content-Type','application/json');
      res.status(201).json(newActivity);
    }else{
      res.status(403).send("No activity found, sorry");
    }
  }).catch(function(err){
    res.status(400).send("Bad request. Please try again.")
  })
});


// router.delete('/api/stats/:id', function(req, res){
// activities.deleteOne({"id": req.params.id, "date":req.params.date})
//  .then(function(activity){
//   if(activity){
//     res.status(200).send("Successfully removed activity.");
//   } else {
//     res.status(404).send("Activity not found.");
//   }
// }).catch(function(err) {
//   res.status(400).send("Bad request. Please try again.");
// })
// });


module.exports = router;
