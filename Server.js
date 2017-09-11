var express	=	require("express");
var app	=	express();

/*****************
 api
 *****************/
var mongoose = require('mongoose');
var EucaImage = require('./api/models/eucaImageModel');
var BreedingJob = require('./api/models/breedingJobModel');


var bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
var connection = mongoose.connect('mongodb://localhost/EucaImageDb', {useMongoClient: true});



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var moment = require('moment');
app.locals.moment = moment;

/**** authentication ****/
var passport = require('passport');
var flash    = require('connect-flash');

require('./config/passport')(passport); // pass passport for configuration

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session      = require('express-session');

//var configDB = require('./config/database.js');

/***** authentication *****/
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// required for passport
app.use(session({ secret: 'eutecheedds', resave: false, saveUninitialized: true })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

app.use(function (req, res, next) {
  res.locals.user = req.user;
  next();
});

require('./api/routes/authenRoutes')(app, passport);
/**************************/
require('./api/routes/eucaImageRoutes')(app);
require('./api/routes/breedingJobRoutes')(app);

var path = require('path');
//app.use(express.static(dir));
app.use('/EucaPhoto',express.static(path.join(__dirname, '../EucaUploads')));
app.use('/img',express.static(path.join(__dirname, 'public/images')));
app.use('/script',express.static(path.join(__dirname, 'public')));
app.use('/css',express.static(path.join(__dirname, 'public/css')));
app.use('/vendors',express.static(path.join(__dirname, 'public/vendors')));
app.use('/build',express.static(path.join(__dirname, 'public/build')));
app.use('/js',express.static(path.join(__dirname, 'public/js')));
app.use('/gent',express.static(path.join(__dirname, 'public/gent')));

//app.use(express.static(dir2));



app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});


app.set('view engine', 'ejs');

/*
app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
}); */

/*
app.post('/api/photo',function(req,res){
  console.log("Upload POSTing....");
	upload(req,res,function(err) {
		if(err) {
      console.log("Error uploading file.");
			return res.end("Error uploading file.");
		}
    console.log("File " + req.file.originalname + " upload successfully!");
    console.log("Uploading at time " + new Date());

    var new_image_data = new EucaImage();S
    new_image_data.imageId = new_image_data._id;
    new_image_data.filename = req.file.originalname;
    console.log('New image data: ' + new_image_data);

		res.end('{"status":"201","uploadedFilename":"' + req.file.originalname + '"}');
	});
});
*/



app.listen(3009,function(){
  console.log("Eucalyptus Disease Diagnosis System - Backend Server");
  console.log("Server running on port 3009 - " + new Date());
});
