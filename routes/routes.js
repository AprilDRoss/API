const express = require('express');
const mustacheExpress = require('mustache-express');
//const users = require('./users.json');
const router = express.Router();
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//mongoose connection
 mongoose.Promise = require("bluebird");
 mongoose.connect("mongodb://localhost:27017/activityTracker");

//mongoose Schema
const activitySchema = new Schema({
  id: Number,
  name : {type:String, required:true},
  date : Date,
  tracking: String
});
//Activity is the collection name; mongoose will lowercase and pluralize it
const activities = mongoose.model('activities', activitySchema);

router.get('/activities', function(req, res){
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

router.post('/activities', function(req, res){
  activities.create({
    id: req.body.id,
    name: req.body.name,
    date: Date.now,
    tracking: req.body.tracking
  }).then(function(newActivity){
    if (newActivity){
      res.setHeader('Content-Type','application/json');
      res.status(201).json(newTodo);
    }else{
      res.status(403).send("No activity found, sorry");
    }
  }).catch(function(err){
    res.status(400).send("Bad request. Please try again.")
  })
});

router.get('/activities/:id', function(req, res){
  activities.findById(req.params.id).then(function(activities){
    if (activities){
      res.setHeader('Content-Type','application.json');
      res.status(200).json(activities);
    }else{
      res.status(404).send("Activity not found.")
    }
  }).catch(function(err){
    res.status(400).send("Bad request. Please try again.")
  });
});

router.put('/activities/:id', function(req, res){
  activities.updateOne({id:req.params.id},{
    name: req.body.name,
    date: Date.now,
    tracking: req.body.tracking
  }).then(function(activity){
    if(activity){
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(todo);
    } else {
      res.status(403).send("No activity found...");
    }
  }).catch(function(err) {
    res.status(400).send("Bad request. Please try again.");
  });

});

router.delete('/activities/:id', function(req, res){
  activities.deleteOne({
    id: req.params.id
  }).then(function(activity){
    if(activity){
      res.status(200).send("Successfully removed activity.");
    } else {
      res.status(404).send("Activity not found.");
    }
  }).catch(function(err) {
    res.status(400).send("Bad request. Please try again.");
  })
});

router.post('/activities/:id/stats', function(req, res){
  activities.updateOne({id:req.params.id},{
    date: req.body.date,
    tracking: req.body.tracking
  }).then(function(activity){
    if(activity){
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(todo);
    } else {
      res.status(403).send("No activity found...");
    }
  }).catch(function(err) {
    res.status(400).send("Bad request. Please try again.");
  });
});

router.delete('/activities/stats/:id', function(req, res){
activities.deleteOne({id: req.params.id, date:req.params.date})
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
