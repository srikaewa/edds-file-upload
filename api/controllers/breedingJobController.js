'use strict';

var mongoose = require('mongoose');
var BreedingJob = mongoose.model('BreedingJobs');
var edds_mod = require('../../modules/edds.js');

exports.eutech_list_all_breeding_jobs = function(req, res) {
  BreedingJob.find({}, function(err, screeningJobs) {
    if (err)
      res.send(err);
    res.render('breedingJob/summary.ejs', {screeningJobs: screeningJobs});
    //res.json(breedingJobs);
  });
};

exports.eutech_list_photographer_breeding_jobs = function(req, res) {
  console.log("Screening jobs list for photographer => " + req.params.photographer + " by " + req.user.local.email);
  if(req.params.photographer == req.user.local.email){
    BreedingJob.find({photographer: req.params.photographer}, function(err, screeningJobs) {
      if (err)
        res.send(err);
      res.render('breedingJob/summary.ejs', {screeningJobs: screeningJobs});
      //res.json(breedingJobs);
    });
  }
  else{
    res.render('misc/warning.ejs');
  };
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
    //req.body.created = new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString()
    //req.body.lastedited = new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString()
    req.body.breedingdate = new Date(req.body.breedingdate);
    req.body.collectingdate = new Date(req.body.collectingdate);
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
  var moment = require('moment');
  BreedingJob.findById(req.params.jobId, function(err, screeningJob) {
    if (err)
      res.send(err);
    edds_mod.get_screening_job_image_list(screeningJob.jobId, function(eucaImages){
      res.render('breedingJob/details.ejs', {screeningJob: screeningJob, eucaImages: eucaImages, moment: moment});
    })
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

exports.eutech_update_a_breeding_job_data = function(req, res) {
  console.log('UPDATE breeding job [' + req.params.jobId + '] -> ' + req.body.culture);
  //req.body.validated = false;
  req.body.lastedited = new Date();
  BreedingJob.findOneAndUpdate({jobId: req.params.jobId}, req.body, {new: true}, function(err, breedingJob) {
    if (err)
      res.send(err);
    console.log('UPDATE breeding job [' + breedingJob.jobId + '] -> ' + breedingJob.lastedited +
                          ',' + breedingJob.culture + ',' + breedingJob.clone + ',' + breedingJob.note);
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

exports.eutech_timestamp_a_breeding_job_data = function(req, res) {
  console.log('UPDATE breeding job [' + req.params.jobId + ']');
  //req.body.validated = false;
  BreedingJob.findOneAndUpdate({jobId: req.params.jobId}, {lastedited: new Date()}, {new: true}, function(err, breedingJob) {
    if (err)
      res.send(err);
    console.log('UPDATE breeding job [' + breedingJob.jobId + '] -> ' + breedingJob.lastedited);
    //res.render('breedingJob/details.ejs', {breedingJob: breedingJob});
    res.json(breedingJob);
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
