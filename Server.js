var express	=	require("express");
var app	=	express();

/*****************
 api
 *****************/
var mongoose = require('mongoose');
var EucaImage = require('./api/models/eucaImageModel');
var bodyParser = require('body-parser');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/EucaImageDb');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var moment = require('moment');
app.locals.moment = moment;

var routes = require('./api/routes/eucaImageRoutes');
routes(app);

var path = require('path');
var dir = path.join(__dirname, '../EucaUploads');
var dir2 = path.join(__dirname, 'public/images');
var dir3 = path.join(__dirname, 'public');
var dir4 = path.join(__dirname, 'public/css');

console.log("Dir = " + dir);
console.log("Dir2 = " + dir2);

//app.use(express.static(dir));
app.use('/EucaPhoto',express.static(dir));
app.use('/img',express.static(dir2));
app.use('/script',express.static(dir3));
app.use('/css',express.static(dir4));
//app.use(express.static(dir2));

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});


app.set('view engine', 'ejs');

/*
@param {string, required} staticFiles The directory where your album starts - can contain photos or images
@param {string, required} urlRoot The root URL which you pass into the epxress router in app.use (no way of obtaining this otherwise)
@param {string, optional} title Yup, you guessed it - the title to display on the root gallery
@param {boolean, optional} render Default to true. If explicitly set to false, rendering is left to the next function in the chain - see below.
@param {string, optional} thumbnail.width Thumbnail image width, defaults '200'
@param {string, optional} thumbnail.height as above
@param {string, optional} image.width Large images width defaults '100%'
@param {string, optional} image.height as above
*/
app.use('/gallery', require('node-gallery')({
  staticFiles : 'resources/photos',
  urlRoot : 'gallery',
  title : 'Example Gallery'
}));

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
