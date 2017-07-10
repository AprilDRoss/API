const express = require('express');
const mustacheExpress = require('mustache-express');
const router = express.Router();
const mongo = require('mongo');
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const assert = require('assert');

//mongoose connection
 mongoose.Promise = require("bluebird");
 mongoose.connect("mongodb://localhost:27017/activityTracker");
 var url = 'mongodb://localhost:27017/activityTracker';

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

//mongoose Schema for activities collection
const activitySchema = new Schema({
  id: Number,
  name : {type:String, required:true},
  date : Date,
  tracking: String

});

const userSchema = new Schema({
  id: Number,
  username: String,
  password: String
});

//Activity is the collection name; mongoose will lowercase and pluralize it
const activities = mongoose.model('activities', activitySchema);
const users = mongoose.model('users', userSchema);

router.get('/',
  passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.json({ username: req.user.username, password: req.user.password });
  });

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

router.post('/api/activities', function(req, res){
  activities.create(req.body).then(function(newActivity){
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


router.get('/api/activities/:_id', function(req, res){
  activities.findById(req.params._id).then(function(newActivity){
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

//*********    PUT              doesnt work*************
// router.put('/api/activities/:_id', function(req, res){
//   activities.updateOne({id:req.params._id},
//   {push: {name:req.body.name}}).then(function(newActivity){
//     if(newActivity){
//       res.setHeader('Content-Type', 'application/json');
//       res.status(200).json(newActivity);
//     } else {
//       res.status(403).send("No activity found...");
//     }
//   }).catch(function(err) {
//     res.status(400).send("Bad request. Please try again.");
//   });

// });
//
router.delete('/api/activities/:_id', function(req, res){
  activities.deleteOne(req.params._id).then(function(newActivity){
    if(newActivity){
      res.status(200).send("Successfully removed activity.");
    } else {
      res.status(404).send("Activity not found.");
    }
  }).catch(function(err) {
    res.status(400).send("Bad request. Please try again.");
  })
});
//
// router.post('/api/activities/:_id/tracking', function(req, res){
//   activities.updateOne({"id":req.params._id},
//       {$push: {"date":req.body},{"tracking":req.body}}).then(function(newActivity){
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

// router.delete('/api/stats/:id', function(req, res){
// activities.deleteOne({id: req.params.id, date:req.params.date})
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
