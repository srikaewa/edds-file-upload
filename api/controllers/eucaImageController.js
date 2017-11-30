'use strict';

var mongoose = require('mongoose');
var EucaImage = mongoose.model('EucaImages');
var DiseaseLabel = mongoose.model('Diseases');

var edds_mod = require('../../modules/edds.js');

var async = require('async');

var multer	=	require('multer');
var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '../EucaUploads');
  },
  filename: function (req, file, callback) {
    //callback(null, file.fieldname + '-' + Date.now());
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).array('userPhoto', 3);

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
    //console.log("File " + req.files[2].originalname + " upload successfully!");
    console.log("Files were uploaded successfully!");
    console.log("Uploading at time " + new Date());
    console.log("req -> " + req.query.submitter);

    var new_image_data = new EucaImage();
    new_image_data.imageId = new_image_data._id;
    new_image_data.filename = req.files[0].originalname;
    new_image_data.originalfilename = req.files[1].originalname;
    new_image_data.displayfilename = req.files[2].originalname;
    //var d2 = new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString().substr(0,19).replace('T', ' ');
    //new_image_data.submit = new Date();
    //new_image_data.lastedit = new_image_data.submit;
    new_image_data.submitter = req.query.submitter;
    new_image_data.latitude = req.query.latitude;
    new_image_data.longitude = req.query.longitude;
    new_image_data.jobId = req.query.jobId;
    new_image_data.uploaded = true;
    new_image_data.save();

    console.log('New image data[' +new_image_data.submitter+ '] ' + new_image_data);

    /*** returning info about uploaded file ***/
		//res.end('{"status":"201","uploadedFilename":"' + req.file.originalname + '"}');
    res.json(new_image_data);
	});
};

exports.run_classify = function(req, res) {
  EucaImage.findById(req.params.imageId, function(err, eucaImage)
  {
    if(err)
      res.send(err);
    console.log('GET image [' + eucaImage.imageId + ']');

    var exec = require('child_process').exec;
    var result = '';

    // check ann type
    var command;
    if(req.params.annType == "sfam")
    {
      console.log('SFAM type...')
      command = "../edds/run_classifyEuca.sh /usr/local/MATLAB/MATLAB_Runtime/v92/ ../EucaUploads/"+ eucaImage.filename + " " + eucaImage.imageId + " " + "http://localhost:3009/eucaImages/";
    }
    else {
      console.log('AlexNet CNN type...');
      command = "../edds/run_classifyEucaCNN.sh /usr/local/MATLAB/MATLAB_Runtime/v92/ ../EucaUploads/"+ eucaImage.filename + " " + eucaImage.imageId + " " + "http://localhost:3009/eucaImages/";
    }

    //console.log('EXEC command -> ' + command);
    var child = exec(command);
    //var child = exec('ls -al');

    child.stdout.on('data', function(data) {
        result += data;
    });

    child.on('close', function() {
        console.log('Classifying done...');
        console.log(result);
        //edds_mod.get_disease_label(function(diseaseLabel){
          //console.log("Update disease label " + diseaseLabel + " to " + )
          console.log("Update disease[" + eucaImage.diseasetype + "] to image " + eucaImage.imageId);
          async.series([
            function(callback){
              EucaImage.findOneAndUpdate({imageId: eucaImage.imageId},{lastedit: new Date()}, function(err, eucaImage){
                if(err)
                  res.send(err);
                callback(null, eucaImage);
              })
            },
            function(callback){
              var eu = edds_mod.update(function(err, edds){
                if(err)
                  res.send(err);
                //console.log("Update EDDS => " + edds);
                //res.json(edds);
                callback(null, edds);
                //res.redirect('/eutech/eucaImages')
              });
            }
          ], function(err, results){
              if(err)
                res.send(err);
              console.log("RUN_CLASSIFY updated with image[" + eucaImage.imageId + "] sucessfully");
          });
        //});
    });
  });
};

exports.run_retrain = function(req, res) {
  EucaImage.findById(req.params.imageId, function(err, eucaImage)
  {
    if(err)
      res.send(err);
    console.log('GET image [' + eucaImage.imageId + ']');
    // change status to training
    edds_mod.update_retrain_status(req.params.imageId, 'training', function(eucaImage){
      var exec = require('child_process').exec;
      var result = '';
      var type = req.params.diseasetype;
      var stage;
      if (req.params.stage == 'undefined')
      {
        stage = '0';
      }
      else {
        stage = req.params.stage;
      }
      var command = "../train/run_trainEuca.sh /usr/local/MATLAB/MATLAB_Runtime/v92/ ../EucaUploads/"+ eucaImage.filename + " [" + type + "," + stage + "] " + eucaImage.imageId + " " + "http://localhost:3009/eucaImages/"
      console.log('EXEC command -> ' + command);
      var child = exec(command);
      //var child = exec('ls -al');

      child.stdout.on('data', function(data) {
          result += data;
      });

      child.on('close', function() {
          console.log('Retraining done...');
          console.log(result);
          res.send("done");
          //edds_mod.get_disease_label(function(diseaseLabel){
            //console.log("Update disease label " + diseaseLabel + " to " + )
          //});
      });

    })

  });
};

exports.list_all_images = function(req, res) {
  EucaImage.find({}, function(err, eucaImage) {
    if (err)
      res.send(err);
    res.json(eucaImage);
  });
};

exports.eutech_list_all_images = function(req, res) {
  //EucaImage.find({}).sort({$natural: -1}).exec(function(err, eucaImage) {
  EucaImage.find({}).exec(function(err, eucaImage) {
    if (err)
      res.send(err);
    res.render('image/list.ejs', {eucaImages: eucaImage});
  });
};

exports.eutech_list_invalidated_images = function(req, res) {
  if(req.user.local.validator)
  {
    EucaImage.find({validated: false}).sort({$natural: -1}).exec(function(err, eucaImages) {
      if (err)
        res.send(err);
      res.render('image/list.ejs', {eucaImages: eucaImages});
    });
  }
  else {
    res.render('misc/warning.ejs');
  }
};

exports.create_a_image_data = function(req, res) {
  var new_image_data = new EucaImage(req.body);
  new_image_data.imageId = new_image_data._id;
  var d = new Date();
  var m = d.getMonth() + 1;
  new_image_data.submit = d.getFullYear() + "-" + m + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  new_image_data.lastedit = d.getFullYear() + "-" + m + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  console.log('Newly created image data: ' + new_image_data);
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

exports.eutech_read_a_image_data = function(req, res) {
  console.log('GET image details [' + req.params.imageId + ']');
  EucaImage.findById(req.params.imageId, function(err, eucaImage) {
    if (err)
      res.send(err);
    res.render('image/details.ejs', {eucaImage: eucaImage});
  });
};

exports.eutech_edit_a_image_data = function(req, res) {
  console.log('EDIT image details [' + req.params.imageId + ']');
  DiseaseLabel.find({}, function(err, diseaseLabel){
    if(err)
      res.send(err)

    EucaImage.findById(req.params.imageId, function(err, eucaImage) {
      if (err)
        res.send(err);
      res.render('image/edit.ejs', {eucaImage: eucaImage, diseaseLabel: diseaseLabel});
    });

  });
};

exports.update_a_image_data = function(req, res) {
  //console.log('UPDATE image - ' + req.body.lastedit);
  var d2 = new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString().substr(0,19).replace('T', ' ');
  req.body.lastedit = d2;
  EucaImage.findOneAndUpdate({_id: req.params.imageId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    console.log('PUT image with ' + task);
    res.json(task);
  });
};

exports.eutech_update_a_image_data = function(req, res) {
  console.log('UPDATE image [' + req.params.imageId + ']');
  req.body.validated = false;
  req.body.lastedit = new Date();
  EucaImage.findOneAndUpdate({_id: req.params.imageId}, req.body, {new: true}, function(err, eucaImage) {
    if (err)
      res.send(err);
    console.log('UPDATE image with ' + eucaImage);
    res.render('details.ejs', {eucaImage: eucaImage});
  });
  /*req.body.lastedit = new Date();
  EucaImage.findOneAndUpdate({_id: req.params.imageId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    console.log('PUT image with ' + task);
    res.json(task);
  });*/
};

exports.eutech_update_a_disease_label = function(req, res) {
  console.log('UPDATE image [' + req.params.imageId + ']');
  EucaImage.findOneAndUpdate({_id: req.params.imageId}, {diseaselabel: req.params.diseaselabel, lastedit: new Date()}, {new: true}, function(err, eucaImage) {
    if (err)
      res.send(err);
    console.log('UPDATE image with ' + eucaImage.imageId + ' & ' + eucaImage.diseaselabel);
    res.json({imageId: eucaImage.imageId, diseaselabel: eucaImage.diseaselabel});
  });
  /*req.body.lastedit = new Date();
  EucaImage.findOneAndUpdate({_id: req.params.imageId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    console.log('PUT image with ' + task);
    res.json(task);
  });*/
};


exports.eutech_update_a_disease_data = function(req, res) {
  console.log('UPDATE image [' + req.params.imageId + '] with ' + req.params.type + ' & ' + req.params.stage);
  async.parallel([
    function(callback){
      DiseaseLabel.find({}, function(err, diseaseLabel){
        if(err)
          return err;
        callback(null, diseaseLabel);
      });
    },
    function(callback){
      DiseaseLabel.find({disease_number: req.params.type}, function(err, dlabel){
        if(err)
          return err;

        callback(null, dlabel[0].disease_label);
      });
    }
  ], function(err, results){
      if(err)
        res.send(err);

        //console.log("Results[0] => " + results[0]);
        //console.log("Results[1] => " + results[1]);

        //console.log("Results[1].disease_label =>" + dlabel.disease_label);

        EucaImage.findOneAndUpdate({_id: req.params.imageId}, {validated: false, diseasetype: req.params.type, diseaselabel: results[1], retrain_needed: true, stage: req.params.stage, retrain_status: "retrain" , lastedit: new Date() }, {new: true}, function(err, eucaImage) {
          if (err)
            res.send(err);

          console.log('UPDATE image with ' + eucaImage);

          //res.json(eucaImage);
          edds_mod.update(function(err, edds){
            if(err)
              res.send(err);
            console.log("Update EDDS dashboard...");
            res.render('image/edit.ejs', {eucaImage: eucaImage, diseaseLabel: results[0]});
          });
        });
  });



    /*req.body.lastedit = new Date();
    EucaImage.findOneAndUpdate({_id: req.params.imageId}, req.body, {new: true}, function(err, task) {
      if (err)
        res.send(err);
      console.log('PUT image with ' + task);
      res.json(task);
    });*/
};

exports.eutech_validate_a_image_data = function(req, res) {
  console.log('VALIDATE image [' + req.params.validated + ']');
  //var today = new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString();
  //req.body.validated = true;
  //req.body.validator = user.local.email;
  EucaImage.findOneAndUpdate({_id: req.params.imageId}, {validated: req.params.validated, validator:req.params.validator, lastvalidated: new Date()}, {new: true}, function(err, eucaImage) {
    if (err)
      res.send(err);
    console.log('UPDATE image validation with ' + eucaImage.validated + ' @' + eucaImage.lastvalidated);
    //res.render('image/edit.ejs', {eucaImage: eucaImage});
    res.json(eucaImage);
    var eu = edds_mod.update(function(err, edds){
      console.log("After update EDDS => " + edds);
      //res.json(edds);
      //res.redirect('/eutech/eucaImages')
      //res.json(eucaImage);
    });
  });
  /*req.body.lastedit = new Date();
  EucaImage.findOneAndUpdate({_id: req.params.imageId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    console.log('PUT image with ' + task);
    res.json(task);
  });*/
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

exports.eutech_delete_a_image_data = function(req, res) {
  console.log("Removing " + req.params.imageId);
  EucaImage.remove({
    _id: req.params.imageId
  }, function(err, eucaImage) {
    if (err)
      res.send(err);
    //res.json({ message: 'Eucalyptus image[' + req.params.imageId + '] successfully deleted' });
    // update edds dashboard
    var eu = edds_mod.update(function(err, edds){
      //console.log("Update EDDS => " + edds);
      //res.json(edds);
      res.redirect('/eutech/eucaImages')
    });
  });
};

exports.get_disease_type = function(req, res) {
  EucaImage.findById(req.params.imageId, function(err, eucaImage) {
    if (err)
      res.send(err);
    //var res_end = '{"imageId":"' + eucaImage.imageId + '","diseasetype":"' + eucaImage.diseasetype + '", "stage":"' + eucaImage.stage + '","level":"' + eucaImage.level + '","lastedit":"' + eucaImage.lastedit + '","elapsetime":"'+ eucaImage.elapsetime + '"}';
    console.log('GET disease_type=' + eucaImage.diseasetype + ' for image [' + eucaImage.imageId + '] submitted by ' + eucaImage.submitter);
    res.json(eucaImage);
  });
};

exports.table_summarize = function(req, res) {
  res.render('tables.ejs');
};

exports.eutech_disease_folder = function(req, res) {
  EucaImage.find({diseaselabel: req.params.diseaselabel, validated: true}, function(err, eucaImages) {
    if (err)
      res.send(err);
    //var res_end = '{"imageId":"' + eucaImage.imageId + '","diseasetype":"' + eucaImage.diseasetype + '", "stage":"' + eucaImage.stage + '","level":"' + eucaImage.level + '","lastedit":"' + eucaImage.lastedit + '","elapsetime":"'+ eucaImage.elapsetime + '"}';
    //console.log('GET files =' + eucaImage.diseasetype + ' for image [' + eucaImage.imageId + '] submitted by ' + eucaImage.submitter);
    // Dependencies
    var filelist = '';
    if(eucaImages.length>0)
    {
      for(var i=0; i<eucaImages.length - 1; i++)
        filelist+=eucaImages[i].filename + ',';
      filelist+=eucaImages[eucaImages.length - 1].filename;
      res.json({filecount: eucaImages.length, files: filelist});
    }
    else {
      res.json({ message: 'No eucaimage with disease label ' + req.params.diseaselabel + ' found!' });
    }
  });
};

exports.eutech_disease_stage_folder = function(req, res) {
  EucaImage.find({diseaselabel: req.params.diseaselabel, stage: req.params.stage, validated: true}, function(err, eucaImages) {
    if (err)
      res.send(err);
    //var res_end = '{"imageId":"' + eucaImage.imageId + '","diseasetype":"' + eucaImage.diseasetype + '", "stage":"' + eucaImage.stage + '","level":"' + eucaImage.level + '","lastedit":"' + eucaImage.lastedit + '","elapsetime":"'+ eucaImage.elapsetime + '"}';
    //console.log('GET files =' + eucaImage.diseasetype + ' for image [' + eucaImage.imageId + '] submitted by ' + eucaImage.submitter);
    // Dependencies
    var filelist = '';
    if(eucaImages.length>0)
    {
      for(var i=0; i<eucaImages.length - 1; i++)
        filelist+=eucaImages[i].filename + ',';
      filelist+=eucaImages[eucaImages.length - 1].filename;
      res.json({filecount: eucaImages.length, files: filelist});
    }
    else {
      res.json({ message: 'No eucaimage with disease label ' + req.params.diseaselabel + ' found!' });
    }
  });
};
