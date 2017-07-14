'use strict';


var mongoose = require('mongoose');
var EucaImage = mongoose.model('EucaImages');

var multer	=	require('multer');
var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '../../uploads');
  },
  filename: function (req, file, callback) {
    //callback(null, file.fieldname + '-' + Date.now());
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).single('userPhoto');


exports.check_file_server = function(req,res){
        res.end("200");
  };

exports.upload_file = function(req,res){
  console.log("Uploading eucalyptus image....");
	upload(req,res,function(err) {
		if(err) {
      console.log("Error uploading file.");
			return res.end("Error uploading file.");
		}
    console.log("File " + req.file.originalname + " upload successfully!");
    console.log("Uploading at time " + new Date());

    var new_image_data = new EucaImage();
    new_image_data.imageId = new_image_data._id;
    new_image_data.filename = req.file.originalname;
    console.log('New image data: ' + new_image_data);

    /*** returning info about uploaded file ***/
		//res.end('{"status":"201","uploadedFilename":"' + req.file.originalname + '"}');
    res.json(new_image_data);
	});
};

exports.list_all_images = function(req, res) {
  EucaImage.find({}, function(err, eucaImage) {
    if (err)
      res.send(err);
    res.json(eucaImage);
  });
};

exports.create_a_image_data = function(req, res) {
  var new_image_data = new EucaImage(req.body);
  new_image_data.imageId = new_image_data._id;
  console.log('New image data: ' + new_image_data);
  new_image_data.save(function(err, eucaImage) {
    if (err)
      res.send(err);
    res.json(eucaImage);
  });
};

exports.read_a_image_data = function(req, res) {
  console.log('GET image [' + req.params.imageId + ']');
  EucaImage.findById(req.params.imageId, function(err, eucaImage) {
    if (err)
      res.send(err);
    res.json(eucaImage);
  });
};

exports.update_a_image_data = function(req, res) {
  console.log('PUT image [' + req.params.imageId + ']');
  EucaImage.findOneAndUpdate({_id: req.params.imageId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });
};

exports.delete_a_image_data = function(req, res) {
  EucaImage.remove({
    _id: req.params.imageId
  }, function(err, eucaImage) {
    if (err)
      res.send(err);
    res.json({ message: 'Eucalyptus image[' + req.params.imageId + '] successfully deleted' });
  });
};
