'use strict';

var mongoose = require('mongoose');
var Disease = mongoose.model('Diseases');

exports.eutech_list_all_diseases = function(req, res) {
  Disease.find({}, function(err, diseases) {
    if (err)
      res.send(err);
    res.render('disease/list.ejs', {diseases: diseases});
    //res.json(diseases);
  });
};

exports.eutech_get_disease_list = function(req, res) {
  Disease.find({}, function(err, diseases) {
    if (err)
      res.send(err);
    //res.render('disease/list.ejs', {diseases: diseases});
    res.json(diseases);
  });
};

exports.eutech_create_a_disease_data = function(req, res) {
    //console.log("Created disease with -> " + req.body);
    var new_disease_label = new Disease(req.body);
    //console.log('Newly created disease data: ' + new_disease_data);
    new_disease_label.save(function(err, disease) {
      if (err)
        res.send(err);
      //res.json(disease);
      res.redirect('/eutech/diseases')
    });
};

exports.eutech_read_a_disease_data = function(req, res) {
  console.log('GET disease details [' + req.params.diseaseId + ']');
  Disease.findById(req.params.diseaseId, function(err, disease) {
    if (err)
      res.send(err);
    res.json(disease);
    //res.render('disease/details.ejs', {disease: disease});
  });
};

exports.eutech_edit_a_disease_data = function(req, res) {
  console.log('EDIT disease details [' + req.params.diseaseId + ']');
  Disease.findById(req.params.diseaseId, function(err, disease) {
    if (err)
      res.send(err);
    res.render('disease/edit.ejs', {disease: disease});
  });
};

exports.eutech_update_a_disease_data = function(req, res) {
  console.log('UPDATE disease [' + req.params.diseaseId + ']');
  //req.body.validated = false;
  Disease.findOneAndUpdate({_id: req.params.diseaseId}, req.body, {new: true}, function(err, disease) {
    if (err)
      res.send(err);
    console.log('UPDATE disease with ' + disease);
    //res.render('disease/details.ejs', {disease: disease});
    res.json(disease);
  });
  /*req.body.lastedit = new Date();
  EucaImage.findOneAndUpdate({_id: req.params.imageId}, req.body, {new: true}, function(err, task) {
    if (err)
      res.send(err);
    console.log('PUT image with ' + task);
    res.json(task);
  });*/
};

exports.eutech_delete_a_disease_data = function(req, res) {
  console.log("Removing disease Id -> " + req.params.diseaseId);
  Disease.remove({
    _id: req.params.diseaseId
  }, function(err, disease) {
    if (err)
      res.send(err);
    //res.json({ message: 'Disease[' + req.params.diseaseId + '] successfully deleted' });
    res.redirect('/eutech/diseases');
  });


};
