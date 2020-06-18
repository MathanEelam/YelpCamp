const express        = require("express"),
	  app            = express(),
	  bodyParser     = require("body-parser");
	  mongoose       = require("mongoose");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

mongoose.connect("mongodb://localhost/YelpCamp");
	  
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

// SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	discription: String
});

let campground = mongoose.model("campground", campgroundSchema);

// campground.create(
// 	{
// 		name: "Granite Hill",
// 	 	image: "https://q-cf.bstatic.com/images/hotel/max1024x768/224/224305749.jpg",
// 		discription: "Granite Hill Capital Partners, LLC operates as a venture capital firm. The Company invests in retail,"
// 	}, function(err, campground){
// 	   if(err) {
// 			console.log("Error occurred, find below");
// 			console.log(err);
// 	}  else {
// 			console.log("Added to database, find below");
// 			console.log(campground);
// 	}
// });
 
// campground.remove(
// 	{
// 	name: "Salmon Creek"
// 	}, function(err, campground){
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			console.log(campground);
// 		}
// 	});

let campgrounds = [
		{name: "Salmon Creek", image: "https://www.outandaboutwithkids.com.au/wp-content/uploads/2012/10/CAMP-AND-CARE-WITH-BIG4-2011-redux.jpg"},
		{name: "Granite Hill", image: "https://q-cf.bstatic.com/images/hotel/max1024x768/224/224305749.jpg"},
		{name: "Mountain Goat's", image: "https://media-cdn.tripadvisor.com/media/photo-s/0f/96/37/ae/getlstd-property-photo.jpg"}
	]

app.get("/", function(req, res) {
	res.render("landing.ejs");
})

app.get("/campgrounds", function(req, res) {
	//get all campgrounds from db
	campground.find({}, function(err, allCampgrounds){
		if(err) {
			console.log(err);
		} else {	
			res.render("index.ejs", {campgrounds: allCampgrounds});
		}
	});
});

app.post("/campgrounds", function(req, res) {
	let name          	 = req.body.name;
	let image         	 = req.body.image;
	let discription   	 = req.body.discription;
	let newCampground  	 = {name: name, image: image, discription: discription};
	// create a campground and add to db
	
	campground.create(newCampground, function(err, newlyCreated){
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

app.get("/campgrounds/new", function(req, res) {
	res.render("new.ejs");
});

app.get("/campgrounds/:id", function(req, res) {
	campground.findById(req.params.id, function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			res.render("show.ejs",{campground: foundCampground});	
		}	
	});
	req.params.id
});

app.listen(3000, function(req, res) {
	console.log("Serving YelpCamp at port 3000...");
});