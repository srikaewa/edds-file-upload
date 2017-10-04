'use strict';

var mongoose = require('mongoose');
var EucaImage = mongoose.model('EucaImages');
var DiseaseLabel = mongoose.model('Diseases');
var DiseaseInfo = mongoose.model('DiseaseInfo');
var ScreeningJob = mongoose.model('BreedingJobs')
var EDDS = mongoose.model('EDDSs');
var async = require('async');
var moment = require('moment');

var update = function (callback){
      var yesterday = moment().subtract(1, 'days').format();
      var today = moment().format();
      console.log("Yesterday date => " + yesterday);
      async.parallel([
              function(callback){
                EucaImage.count({submit: {"$gte": today}}, function(err, numbOfEucaImageToday){
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
              function(callback){
                EucaImage.count({validated: true, retrain_needed: false}, function(err, numbOfTrueValidatedEucaImage){
                  if(err)
                    callback(err);
                  console.log("Number of total true validated euca image => " + numbOfTrueValidatedEucaImage);
                  callback(null, numbOfTrueValidatedEucaImage);
                });

              }
      ], function(err, results){
              if(err)
                return err;
              var lastedited = new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString();
              //console.log("Result[0] => " + results[0]);
              //console.log("Result[1] => " + results[1]);
              //new_edds_data.lastedited = moment().format();

              EDDS.findOne({created: {$gte: today}}, function(err, edds){


                /*{total_images: results[2], total_validated_images: results[3], total_invalidated_images: results[2]-results[3],
                 total_images_today: results[0], total_validated_images_today: results[1], total_invalidated_images_today: results[0] - results[1],
                 total_accuracy: (results[3]==0) ? 0 : (results[4]/results[3])*100,
                 lastedited: lastedited},
                {upsert: true, new: true}) */
                if (err)
                {
                  console.log("Never reached here! -> " + err);
                  return err;
                }

                if(edds)
                {
                  console.log('UPDATE edds with id = ' + edds._id);
                  edds.total_images = results[2];
                  edds.total_validated_images = results[3];
                  edds.total_invalidated_images = results[2]-results[3];
                  edds.total_images_today = results[0];
                  edds.total_validated_images_today = results[1]; edds.total_invalidated_images_today = results[0] - results[1];
                  edds.total_accuracy = (results[3]==0) ? 0 : (results[4]/results[3])*100;
                  edds.lastedited = lastedited;
                  edds.save(function(err, edds){
                     if(err)
                      return callback(err, edds);
                    console.log("Update edds with id[" + edds._id + "] successfully...");
                    if(edds.diseases.length == 0)
                      {
                        create_disease(edds._id, function(err, result){
                          console.log("After create dieases => " + result);
                        });
                      }else {
                        update_disease(edds._id, function(err, result){
                          console.log("After update dieases => " + result);
                        });
                      }
                    return callback(err, edds);
                   });
                }
                else {
                  console.log("No today EDDS data, let's create new one!");
                  var new_edds_data = new EDDS({total_images: results[2], total_validated_images: results[3], total_invalidated_images: results[2]-results[3],
                   total_images_today: results[0], total_validated_images_today: results[1], total_invalidated_images_today: results[0] - results[1],
                   total_accuracy: (results[3]==0) ? 0 : (results[4]/results[3])*100,
                   lastedited: lastedited});
                  new_edds_data.save(function(err, edds){
                    if(err)
                      return(err);
                    if(edds.diseases.length == 0)
                      {
                        create_disease(edds._id, function(err, result){
                          console.log("After create dieases => " + result);
                        });
                      }else {
                        update_disease(edds._id, function(err, result){
                          console.log("After update dieases => " + result);
                        });
                      }
                    console.log("successfully created new EDDS data...");
                    return callback(err, edds);
                  });
                }
                //res.render('edds/index.ejs', {edds: edds});
                //res.json(edds);
                //res.render('disease/details.ejs', {disease: disease});
              });
            }
      );
    };

var create_disease = function(edds, callback)
    {
      var today = new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString();
      var diseaselist = [];
      async.waterfall([
        function(callback){
          DiseaseLabel.find({}, function(err, diseaseLabel){
                if(err)
                  return err;
                //console.log("GET Disease label => " + diseaseLabel);
                for(var i=0;i < diseaseLabel.length; i++)
                {
                  var dd = {type: diseaseLabel[i].disease_number, label : diseaseLabel[i].disease_label};
                  //console.log("List => " + dd.type + ", " + dd.label);
                  diseaselist.push(dd);
                }
                callback(null, diseaselist);
            });
        },
        function(diseaselist, callback){
          async.each(diseaselist, function(disease, callback){
            // create each disease info
            var dc = new DiseaseInfo({disease_number: disease.type, disease_label: disease.label});
            //console.log("DC => " + dc);
            EDDS.update(
              {"_id": edds},
              {"$push": {"diseases": dc}},
              function(err, result){
                //console.log("Disease pushed => " + result + " with id = " + edds);
              });
            });
        }
      ], function(err, result){
          if(err)
            return(err);
          console.log("Create diseases data => " + result);
          return callback(err, result);
      });

      /*EucaImage.count({diseasetype: diseasetype}, function(err, numberOfDisease){
        if(err)
          return err;
        EDDS.findOneAndUpdate({created: {"$gte": today}}, { }).exec(function(err, edds){
          if (err)
            return err;

        })
      });*/
    };

var update_disease = function(edds, callback)
{
  var today = moment().format();
  var diseaselist = [];
  async.waterfall([
    function(callback){
      DiseaseLabel.find({}, function(err, diseaseLabel){
            if(err)
              return err;
            //console.log("GET Disease label => " + diseaseLabel);
            for(var i=0;i < diseaseLabel.length; i++)
            {
              var dd = {type: diseaseLabel[i].disease_number, label : diseaseLabel[i].disease_label};
              //console.log("List => " + dd.type + ", " + dd.label);
              diseaselist.push(dd);
            }
            callback(null, diseaselist);
        });
    },
    function(diseaselist, callback){
      //console.log("Disease list for counting -> " + diseaselist);
      async.each(diseaselist, function(disease, callback){
        console.log("Counting disease -> " + disease.label);
        // update all disease info
        //console.log("Update disease with id => " + edds + " & " + disease.type);
        disease_count(disease.type, function(err, numberOfImages){
        console.log("Update disease with id => " + edds + " & " + disease.type + " n = " + numberOfImages);
        EDDS.updateOne(
          {"_id": edds,
           "diseases.disease_number": disease.type},
          {"$set": {"diseases.$.total_images": numberOfImages[0],
                    "diseases.$.total_images_today": numberOfImages[1],
                    "diseases.$.total_validated_images": numberOfImages[2],
                    "diseases.$.total_accuracy": (numberOfImages[2] == 0) ? 0: ((numberOfImages[3]/numberOfImages[2])*100).toFixed(2)}},
          function(err, result){
            if(err)
            {
              console.log("Pushed diseases err -> "+err);
              return callback(err, edds);
            }
            //console.log("Disease pushed => " + result.total_images + " with id = " + edds);
          });
        });
      });
    }
  ], function(err, result){
    console.log("Updated diseases")
    return callback(err, result);
  });
};

var disease_count = function(type, callback){
  var yesterday = moment().subtract(1, 'days').format();
  async.parallel([
    function(callback){
      EucaImage.count({diseasetype: type}, function(err, numberOfDisease){
        if(err)
          return err;
        console.log("Num[" +type+ "] total => " + numberOfDisease);
        callback(null, numberOfDisease);
      });
    },
    function(callback){
      EucaImage.count({submit:{"$gte":yesterday}, diseasetype: type}, function(err, numberOfDiseaseToday){
        if(err)
          return err;
        console.log("Num[" +type+ "] total today => " + numberOfDiseaseToday);
        callback(null, numberOfDiseaseToday);
      });
    },
    function(callback){
      console.log("Counting -> " + type);
      EucaImage.count({diseasetype: type, validated: true}, function(err, numberOfValidatedDisease){
        if(err)
          return err;
        console.log("Num[" +type+ "] validated => " + numberOfValidatedDisease);
        callback(null, numberOfValidatedDisease);
      });
    },
    function(callback){
      console.log("Counting -> " + type);
      EucaImage.count({diseasetype: type, validated: true, retrain_needed: false}, function(err, numberOfTrueValidatedDisease){
        if(err)
          return err;
        console.log("Num[" +type+ "] true validated => " + numberOfTrueValidatedDisease);
        callback(null, numberOfTrueValidatedDisease);
      });
    },

  ], function(err, results){
      return callback(err, results);
  });

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

var get_disease_label = function(type, callback)
{
  DiseaseLabel.find({disease_type:type}, function(err, diseaseLabel){
        if(err)
          return err;
        //console.log("GET Disease label => " + diseaseLabel);
        return callback(diseaseLabel);
    });
}

var get_screening_job_image_list = function(jobId, callback)
{
      EucaImage.find({jobId: jobId}, function(err, eucaImages){
        if(err)
          return err;
        return callback(eucaImages);
      });
}

var get_color = function(index)
{
  return "#"+Math.random().toString(16).slice(2, 8).toUpperCase();
}

module.exports.update = update;
module.exports.diseaselist = diseaselist;
module.exports.disease_count = disease_count;
module.exports.get_screening_job_image_list = get_screening_job_image_list;
module.exports.get_color = get_color;
