const
express        			= require("express"),
app            			= express(),
bodyParser     			= require("body-parser"),
mongoose       			= require("mongoose"),
passport       			= require("passport"),  
localStrategy  			= require("passport-local"),  
passportLocalMongoose   = require("passport-local-mongoose"),  
campground     			= require("./models/campground"),
comment        			= require("./models/comment"),
User					= require("./models/user"),
seedDB         			= require("./seeds");

//Reqiuring routes
let
campgroundRoutes        = require("./routes/campgrounds"),
commentsRoutes          = require("./routes/comments"),
authRoutes              = require("./routes/index");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
app.use(express.static(__dirname + "/public"));
//seed the database
//seedDB();



mongoose.connect("mongodb://localhost/YelpCampV8");
	  
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

let campgrounds = [
		{name: "Salmon Creek", image: "https://www.outandaboutwithkids.com.au/wp-content/uploads/2012/10/CAMP-AND-CARE-WITH-BIG4-2011-redux.jpg"},
		{name: "Granite Hill", image: "https://q-cf.bstatic.com/images/hotel/max1024x768/224/224305749.jpg"},
		{name: "Mountain Goat's", image: "https://media-cdn.tripadvisor.com/media/photo-s/0f/96/37/ae/getlstd-property-photo.jpg"}
	];

//PASSPORT CONFIGURATION
app.use(require("express-session")(
	{
		secret: "Once again rusty wins cutest dog!",
		resave: false,
		saveUninitialized: false
	}
));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLE WERE
app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   next();
});

//Pre fix routes
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentsRoutes);
app.use("/",authRoutes);

app.listen(3000, function(req, res) {
	console.log("Serving YelpCamp at port 3000...");
});