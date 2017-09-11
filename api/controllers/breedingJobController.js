'use strict';

var mongoose = require('mongoose');
var BreedingJob = mongoose.model('BreedingJobs');

exports.eutech_list_all_breeding_jobs = function(req, res) {
  BreedingJob.find({}, function(err, breedingJobs) {
    if (err)
      res.send(err);
    //res.render('breedingJob/list.ejs', {breedingJobs: breedingJob});
    res.json(breedingJobs);
  });
};

exports.eutech_get_next_breeding_job_id = function(req, res) {
  BreedingJob.nextCount(function(err, count) {
      if(err)
        res.send(err);
      console.log("Get next breeding job count -> ", count);
      res.json({nextId: count}) ;
  });
};

exports.eutech_create_a_breeding_job_data = function(req, res) {
    console.log("Created breeding job with -> " + req.body);
    var new_bj_data = new BreedingJob(req.body);
    //console.log("New job id -> " + new_bj_data._id);
    //new_bj_data.jobId = "eutech-jb-001-" + ("000000" + new_bj_data._id).slice(-6);
    //var d = new Date();
    //var m = d.getMonth() + 1;
    //new_bj_data.photographer = req.params.photographer;
    //new_bj_data.created = d;
    //new_bj_data.lastedited = d;

    console.log('Newly created breeding job data: ' + new_bj_data);
    new_bj_data.save(function(err, breedingJob) {
      if (err)
        res.send(err);
      res.json(breedingJob);
    });
};

exports.eutech_read_a_breeding_job_data = function(req, res) {
  console.log('GET breeding job details [' + req.params.jobId + ']');
  BreedingJob.findById(req.params.jobId, function(err, breedingJob) {
    if (err)
      res.send(err);
    res.render('breedingJob/details.ejs', {breedingJob: breedingJob});
  });
};

exports.eutech_edit_a_breeding_job_data = function(req, res) {
  console.log('EDIT breeding job details [' + req.params.jobId + ']');
  BreedingJob.findById(req.params.jobId, function(err, breedingJob) {
    if (err)
      res.send(err);
    res.render('breedingJob/edit.ejs', {breedingJob: breedingJob});
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

exports.eutech_update_a_breeding_job_data = function(req, res) {
  console.log('UPDATE breeding job [' + req.params.jobId + ']');
  //req.body.validated = false;
  BreedingJob.findOneAndUpdate({_id: req.params.jobId}, req.body, {new: true}, function(err, breedingJob) {
    if (err)
      res.send(err);
    console.log('UPDATE breeding job with ' + breedingJob);
    //res.render('breedingJob/details.ejs', {breedingJob: breedingJob});
    res.json(breedingJob);
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
  console.log('VALIDATE image [' + req.body.validated + ']');
  req.body.validated = true;
  //req.body.validator = user.local.email;
  EucaImage.findOneAndUpdate({_id: req.params.imageId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    console.log('UPDATE image validation with ' + task.validated);
    res.render('details.ejs', {eucaImage: task});
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
    res.json({ message: 'Eucalyptus image[' + req.params.jobId + '] successfully deleted' });
  });
};

exports.eutech_delete_a_breeding_job_data = function(req, res) {
  console.log("Removing breeding job Id -> " + req.params.jobId);
  BreedingJob.remove({
    _id: req.params.jobId
  }, function(err, breedingJob) {
    if (err)
      res.send(err);
    res.json({ message: 'Eucalyptus image[' + req.params.jobId + '] successfully deleted' });
    //res.redirect('/eutech/breedingJob')
  });


};

exports.get_breeding_job_count = function(req, res) {
    //if (err)
    //  res.send(err);
    //var res_end = '{"imageId":"' + eucaImage.imageId + '","diseasetype":"' + eucaImage.diseasetype + '", "stage":"' + eucaImage.stage + '","level":"' + eucaImage.level + '","lastedit":"' + eucaImage.lastedit + '","elapsetime":"'+ eucaImage.elapsetime + '"}';
    //console.log("Job count of " + req.params.photographer)
    var cnt = BreedingJob.find({photographer: req.params.photographer}).count(function(err, count){
      if (err)
        res.send(err);
      console.log('GET total number of breeding job by ' + req.params.photographer + ' = ' + count + ' jobs');
      res.send({count: count});
  });
};
