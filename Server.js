var express	=	require("express");
var app	=	express();
<<<<<<< HEAD
=======
var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '../uploads');
  },
  filename: function (req, file, callback) {
    //callback(null, file.fieldname + '-' + Date.now());
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).single('userPhoto');
>>>>>>> ca0720ed40dbf4565190bccea0c1295bcd4b8032

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

var routes = require('./api/routes/eucaImageRoutes');
routes(app);

app.use(function(req, res) {
  res.status(404).send({url: req.originalUrl + ' not found'})
});

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
