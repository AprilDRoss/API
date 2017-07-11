const mongoose = require("mongoose");
const Schema = mongoose.Schema;



//mongoose Schema for every activity
const activitySchema = new Schema({
  id: {type:String, required:true},
  url: String,
  records: [{
    record_id: Number,
    date: [String],
    log: [String],
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

module.exports = {activities, users};
