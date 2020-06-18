const 
mongoose = require("mongoose"),
Campground = require("./models/campground"),
Comment    = require("./models/comment");

let data = [
	{
		name: "Cloud Rest",
		image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTePVj5GxZlI0rSc8Aby5xdJAp3cgSrlpdHMLe76wTyEs4OQ0Dv&usqp=CAU",
		discription: "Blah blah blah blah",
	},
	{
		name: "Desert Mesa",
		image: "https://media.voltron.voanews.com/Drupal/01live-166/styles/sourced/s3/2019-04/8276BB01-3F7A-46C0-A3C5-830BA1F5DC7C.jpg?itok=h1Vq7yPy",
		discription: "Blah blah blah blah",
	},
	{
		name: "Canyon Floor",
		image: "https://www.aljazeera.com/mritems/imagecache/mbdxxlarge/mritems/Images/2019/10/21/c282578602ad4feaacd6d76009fc10f8_18.jpg",
		discription: "Blah blah blah blah",
	},
	
]

function seedDB() {
	//REMVE ALL CAMPGROUNDS
	Campground.remove({}, function(err) {
		if (err) {
		console.log(err);	
		}
		// ADD A CAMPGORUNDS
		data.forEach(function(seed) {
			Campground.create(seed, function(err, campground) {
				if (err) {
					console.log(err);
				} else {
					console.log("Added campgrounds");
					// ADD A COMMENTS
					Comment.create(
						{
							text: "This place is great but i widh to have internet",
							author: "Homer",
						}, function (err, comment) {
							if (err) {
								console.log(err);
							} else {
								campground.comments.push(comment);
								campground.save();
								console.log("Comment created");
							}
						}
					);
				}
			});	
		});
	});
	
		
	
}

module.exports = seedDB;