'use strict';

var mongoose = require('mongoose');
var EDDS = mongoose.model('EDDSs');
var Disease = mongoose.model('Diseases');
var EucaImage = mongoose.model('EucaImages');
var ScreeningJob = mongoose.model('BreedingJobs');
var edds_mod = require('../../modules/edds.js');
var async = require('async');
var moment = require('moment');

exports.eutech_edds_dashboard = function(req, res){
  /*EDDS.find({}).sort({_id : -1}).limit(1).exec(function(err, edds){
    if (err)
      res.send(err);
    //console.log("EDDS data -> " + edds);

    var dl = edds_mod.diseaselist(function(diseaseList){
      //console.log("DiseaseList data -> " + diseaseList);
      res.render('edds/index.ejs', {edds: edds, diseaseList: diseaseList});
    });
  }); */

  async.parallel([
    function(callback){
      EDDS.find({}).sort({_id : -1}).limit(1).exec(function(err, edds){
        if (err)
          res.send(err);
      callback(null, edds);
      });
    },
    function(callback){
      var dl = edds_mod.diseaselist(function(diseaseList){
        callback(null, diseaseList);
      });
    },
    function(callback){
      EucaImage.find({}).sort({_id : -1}).limit(20).exec(function(err, eucaImages){
        if(err)
          res.send(err);
        callback(null, eucaImages);
      });
    },
    function(callback){
      ScreeningJob.find({}).sort({_id : -1}).limit(20).exec(function(err, screeningJobs){
        if(err)
          res.send(err);
        callback(null, screeningJobs);
      });
    }
  ], function(err, results){
      if(err)
        res.send(err)
      //console.log("Render => " + results[0] + results[1] + results[2]);
      res.render('edds/index.ejs', {edds: results[0], diseaseList: results[1], eucaImages: results[2], screeningJobs: results[3]});
  });

};

exports.eutech_edds_chart = function(req, res){
  console.log("Try display -> " + edds_mod.get_color(0));
};

exports.eutech_list_all_edds = function(req, res) {
  EDDS.findone({}).sort({$natural:-1}).exec(function(err, edds) {
    if (err)
      res.send(err);
    res.render('edds/list.ejs', {edds: edds});
    //res.json(diseases);
  });
};

exports.eutech_create_a_edds_data = function(req, res) {
    //console.log("Created disease with -> " + req.body);
    //var new_edds_data = new EDDS();
    //console.log('Newly created disease data: ' + new_disease_data);
    // get total number of euca image
    //EucaImage.count({}, function(err, numbOfEucaImage){
    //  if(err)
    //    res.send(err);
    var eu = edds_mod.update(function(edds){
      var new_edds_data = new EDDS();
      new_edds_data.lastedited = new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString();
      //new_edds_data.lastedited = moment().format();
      new_edds_data.total_images = edds.total_images;
      new_edds_data.total_validated_images = edds.total_validated_images;
      new_edds_data.total_invalidated_images = edds.total_invalidated_images;
      new_edds_data.total_images_today = edds.total_images_today;
      new_edds_data.total_validated_images_today = edds.total_validated_images_today;
      new_edds_data.save( function(err, edds) {
        if (err)
          res.send(err);
        console.log("Save new edds data successfully...");
        res.json(edds)
        //res.redirect('/eutech/edds')
      });
    });

      //console.log("Number of euca image => " + numbOfEucaImage);

    //});
    //new_edds_data.save(function(err, edds) {
    //  if (err)
    //    res.send(err);
    //  res.json(edds);
      //res.redirect('/eutech/edds')
    //});
};

exports.eutech_update_today_edds_data = function(req, res) {
    //console.log("Created disease with -> " + req.body);
    //var new_edds_data = new EDDS();
    //console.log('Newly created disease data: ' + new_disease_data);
    // get total number of euca image
    //EucaImage.count({}, function(err, numbOfEucaImage){
    //  if(err)
    //    res.send(err);

    var eu = edds_mod.update(function(err, edds){
      //console.log("Update EDDS for today => " + edds);
      res.json(edds);
    });
      //console.log("Number of euca image => " + numbOfEucaImage);

    //});
    //new_edds_data.save(function(err, edds) {
    //  if (err)
    //    res.send(err);
    //  res.json(edds);
      //res.redirect('/eutech/edds')
    //});
};

exports.eutech_read_a_edds_data = function(req, res) {
  console.log('GET edds details [' + req.params.eddsId + ']');
  EDDS.findById(req.params.eddsId, function(err, edds) {
    if (err)
      res.send(err);
    res.json(edds);
    //res.render('disease/details.ejs', {disease: disease});
  });
};

exports.eutech_edit_a_edds_data = function(req, res) {
  console.log('EDIT edds details [' + req.params.eddsId + ']');
  EDDS.findById(req.params.eddsId, function(err, edds) {
    if (err)
      res.send(err);
    res.render('edds/edit.ejs', {edds: edds});
  });
};

exports.eutech_update_a_edds_data = function(req, res) {
  var today = new Date();
  console.log("Month -> " + (today.getMonth() + 1));
  console.log("Year -> " + today.getFullYear());
  //console.log('UPDATE edds [' + req.params.eddsId + ']');
  //req.body.validated = false;
  EDDS.findOneAndUpdate({monthedited: today.getMonth() + 1, yearedited: today.getFullYear()}, req.body, { upsert: true, new: true, setDefaultsOnInsert: true }, function(err, edds) {
    if (err)
      res.send(err);
    console.log('UPDATE edds with ' + edds);
    //res.render('disease/details.ejs', {disease: disease});
    res.json(edds);
  });
  /*req.body.lastedit = new Date();
  EucaImage.findOneAndUpdate({_id: req.params.imageId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    console.log('PUT image with ' + task);
    res.json(task);
  });*/
};

exports.eutech_delete_a_edds_data = function(req, res) {
  console.log("Removing edds Id -> " + req.params.eddsId);
  EDDS.remove({
    _id: req.params.eddsId
  }, function(err, edds) {
    if (err)
      res.send(err);
    //res.json({ message: 'Disease[' + req.params.diseaseId + '] successfully deleted' });
    res.redirect('/eutech/edds');
  });


};
