const mongoose = require("mongoose");
const Schema = mongoose.Schema;



//mongoose Schema for every activity
const activitySchema = new Schema({
  id: {type:String, required:true},
  url: String,
  records: [{
    recordid: {type:Number, required:true},
    date: String,
    logged: String,
  }],
});

const statSchema = new Schema({
  activityid:String,
  statid:{type:Number, required:true},
  date:String,
  logged:String
});

const userSchema = new Schema({
  id: Number,
  username: String,
  password: String
});

//Activity is the collection name; mongoose will lowercase and pluralize it
const activities = mongoose.model('activities', activitySchema);
const users = mongoose.model('users', userSchema);
const stats = mongoose.model('stats', statSchema);

module.exports = {activities, users, stats};
