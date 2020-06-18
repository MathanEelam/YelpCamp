const
mongoose = require("mongoose");
// SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	discription: String,
	comments: [
		{
			type: mongoose.Schema.Types.ObjectID,
			ref: "Comment",
		}
	]
});

module.exports = mongoose.model("campground", campgroundSchema);