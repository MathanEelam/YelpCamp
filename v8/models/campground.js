var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   comments: [
      {
         type: mongoose.Schema.ObjectId,
         ref: "comment"
      }
   ]
});

module.exports = mongoose.model("campground", campgroundSchema);