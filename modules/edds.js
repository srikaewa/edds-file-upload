'use strict';

var mongoose = require('mongoose');
var EucaImage = mongoose.model('EucaImages');
var DiseaseLabel = mongoose.model('Diseases');
var EDDS = mongoose.model('EDDSs');
var async = require('async');
var moment = require('moment');

var update = function (callback){
      var yesterday = moment().subtract(1, 'days').format();
      var today = moment().format();
      console.log("Yesterday date => " + yesterday);
      async.parallel([
              function(callback){
                EucaImage.count({submit: {"$gte": yesterday}}, function(err, numbOfEucaImageToday){
                  if(err)
                    callback(err);
                  console.log("Number of euca image added today => " + numbOfEucaImageToday);
                  callback(null, numbOfEucaImageToday);
                });
              },
              function(callback){
                EucaImage.count({validated: true, lastvalidated: {"$gte": yesterday}}, function(err, numbOfValidatedImageToday){
                  if(err)
                    callback(err);
                  console.log("Number of validated euca image added today => " + numbOfValidatedImageToday);
                  callback(null, numbOfValidatedImageToday);
                });
              },
              function(callback){
                EucaImage.count({}, function(err, numbOfEucaImage){
                  if(err)
                    callback(err);
                  console.log("Number of total euca image => " + numbOfEucaImage);
                  callback(null, numbOfEucaImage);
                });
              },
              function(callback){
                EucaImage.count({validated: true}, function(err, numbOfValidatedEucaImage){
                  if(err)
                    callback(err);
                  console.log("Number of total validated euca image => " + numbOfValidatedEucaImage);
                  callback(null, numbOfValidatedEucaImage);
                });
              },
      ], function(err, results){
              if(err)
                res.send(err)
              var lastedited = new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString();
              //console.log("Result[0] => " + results[0]);
              //console.log("Result[1] => " + results[1]);
              //new_edds_data.lastedited = moment().format();
              EDDS.findOneAndUpdate({created: {"$gte": today}},
                {total_images: results[2], total_validated_images: results[3], total_invalidated_images: results[2]-results[3],
                 total_images_today: results[0], total_validated_images_today: results[1], total_invalidated_images_today: results[0] - results[1],
                 lastedited: lastedited},
                {upsert: true, new: true}).sort({$natural: -1}).exec(function(err, edds) {
                if (err)
                  res.send(err);
                console.log('UPDATE edds with ' + edds);
                return callback(edds);
                //res.render('edds/index.ejs', {edds: edds});
                //res.json(edds);
                //res.render('disease/details.ejs', {disease: disease});
              });
            }
      );
    };

var count_disease = function(diseasetype, callback){
};

var diseaselist = function (callback)
    {
      DiseaseLabel.find({}, function(err, diseaseLabel){
            if(err)
              return err;
            //console.log("GET Disease label => " + diseaseLabel);
            return callback(diseaseLabel);
        });
    };

module.exports.update = update;
module.exports.diseaselist = diseaselist;
