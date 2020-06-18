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
app.use(express.static(__dirname + "/public"));
seedDB();

mongoose.connect("mongodb://localhost/YelpCampV3");
	  
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

let campgrounds = [
		{name: "Salmon Creek", image: "https://www.outandaboutwithkids.com.au/wp-content/uploads/2012/10/CAMP-AND-CARE-WITH-BIG4-2011-redux.jpg"},
		{name: "Granite Hill", image: "https://q-cf.bstatic.com/images/hotel/max1024x768/224/224305749.jpg"},
		{name: "Mountain Goat's", image: "https://media-cdn.tripadvisor.com/media/photo-s/0f/96/37/ae/getlstd-property-photo.jpg"}
	]

app.get("/", function(req, res){
    res.render("landing");
});

//INDEX - show all campgrounds
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

//CREATE - add new campground to DB
app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    // Create a new campground and save to DB
    campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
   res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res) {
	campground.findById(req.params.id).populate("comment").exec( function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render("campgrounds/show.ejs",{campground: foundCampground});	
		}	
	});
});


// ====================
// COMMENTS ROUTES
// ====================

app.get("/campgrounds/:id/comments/new", function(req, res){
    // find campground by id
    campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
             res.render("comments/new.ejs", {campground: campground});
        }
    })
});

app.post("/campgrounds/:id/comments", function(req, res){
   //lookup campground using ID
   campground.findById(req.params.id, function(err, campground){
       if(err){
           console.log(err);
           res.redirect("/campgrounds");
       } else {
        comment.create(req.body.comment, function(err, comment){
           if(err){
               console.log(err);
           } else {
               campground.comment.push(comment);
               campground.save();
               res.redirect('/campgrounds/' + campground._id);
           }
        });
       }
   });
   //create new comment
   //connect new comment to campground
   //redirect campground show page
});

app.listen(3000, function(req, res) {
	console.log("Serving YelpCamp at port 3000...");
});