const express = require('express');
const mustacheExpress = require('mustache-express');
const router = express.Router();
const mongo = require('mongo');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const assert = require('assert');

//authentication
//router.use(passport.authenticate('basic', { session: false }));


//*****Fix this after you fix the models folder*******
const models = require("../models/activities.js");

//mongoose connection
 mongoose.Promise = require("bluebird");
 mongoose.connect("mongodb://localhost:27017/activitiesTracker");


// passport.use(new BasicStrategy(
//   function(username, password, done) {
//     models.users.findOne({ "username":username, "password":password }, function (err, user) {
//       if (err) { return done(err); }
//       if (!user) { return done(null, false); }
//       if (users.password == password){ return done(null, false); }
//       return done(null, user);
//     });
//   }
// ));

//applying authentication on the root
// router.get('/api',
//   passport.authenticate('basic', { session: false }),
//   function(req, res) {
//     res.json(req.user);
//   });

//Get all activities
router.get('/api/activities', function(req, res){
  models.activities.find({}).then(function(allActivities){
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
    url:"//localhost:8080/api/activities/" + req.body.url,
    statId: req.body.statId,
    statDate: req.body.statDate,
    statLogged: req.body.statLogged
  });
  models.activities.create(activity).then(function(newActivity){
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

//GET activites by id (activity name)
// router.get('/api/activities/:id', function(req, res){
//   models.activities.findOne({id:req.params.id}).then(function(newActivity){
//     if (newActivity){
//       res.setHeader('Content-Type','application/json');
//       res.status(201).json(newActivity);
//     }else{
//       res.status(403).send("No activity found, sorry");
//     }
//   }).catch(function(err){
//     res.status(400).send("Bad request. Please try again.")
//   })
// });

router.get('/api/activities/:id', function(req, res){
  models.activities.find({id:req.params.id}).then(function(newActivity){
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
  models.activities.updateOne({id:req.params.id},{$set:{id:req.body.id}}).then(function(newActivity){
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

//Delete an activity
router.delete('/api/activities/:id', function(req, res){
  models.activities.deleteOne({id:req.params.id}).then(function(newActivity){
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
router.post('/api/activities/:statid/stats', function(req, res){
  models.activities.updateOne({id:req.params.id, 'statId':req.params.statId},
       {$set:{statDate:req.body.statDate}},
       {$set:{statLogged:req.body.statLogged}}).then(function(newActivity){
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


router.delete('/api/activities/:id/stats/:statId', function(req, res){
 models.activities.updateOne({"id": req.params.id, "records.recordid":req.params.recordid},
   {$unset:{"records.date":""}},{$unset:{"records.logged":""}})
 .then(function(activity){
  if(activity){
    res.status(200).send("Successfully removed activity.");
  } else {
    res.status(404).send("Activity not found.");
  }
}).catch(function(err) {
  res.status(400).send("Bad request. Please try again.");
})
});


module.exports = router;
