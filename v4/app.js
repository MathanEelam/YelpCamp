const
express        = require("express"),
app            = express(),
bodyParser     = require("body-parser"),
mongoose       = require("mongoose"),
campground     = require("./models/campground"),
comment        = require("./models/comment"),
seedDB         = require("./seeds");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
seedDB();

mongoose.connect("mongodb://localhost/YelpCampV3");
	  
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

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
			res.render("campgrounds/index.ejs", {campgrounds: allCampgrounds});
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
	res.render("campgrounds/new.ejs");
});

app.get("/campgrounds/:id", function(req, res) {
	campground.findById(req.params.id).populate("comments").exec( function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render("campgrounds/show.ejs",{campground: foundCampground});	
		}	
	});
	req.params.id
});

//========================================
// COMMENT ROUTES
//========================================

app.get("/campgrounds/:id/comments/new", function(req, res) {
	campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
		} else {
			res.render("comments/new.ejs", {campground: campground});
		}
	});
});

app.post("/campgrounds/:id/comments", function(req, res) {
	//LOOKUP CAMPGROUND ID
	campground.findById(req.params.id, function(err, campground) {
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			//CREATE NEW COMMENT
			comment.create(req.body.comment, function(err, comment) {
				if (err) {
					console.log(err);
				} else {
					//CONNECT NEW COMMENT TO CAMPGROUND
					campground.comments.push(comment);
					campground.save();
					//REDIREC CAMPGROUDN SHOW PAGE
					res.redirect("/campgrounds/"+campground._id);
				}
			});
			
		}
	});
});

app.listen(3000, function(req, res) {
	console.log("Serving YelpCamp at port 3000...");
});