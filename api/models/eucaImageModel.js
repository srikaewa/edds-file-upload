'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var EucaImageSchema = new Schema({
  imageId: {
    type: String,
    default: 'xxxxxxxxxxxxxxxxxxxxxxxx'
  },
  filename: {
    type: String,
    Required: 'Kindly enter the name of the eucalyptus image file',
    default: '-'
  },
  originalfilename: {
    type: String,
    Required: 'Kindly enter the name of the original eucalyptus image file',
    default: '-'
  },
  displayfilename: {
    type: String,
    Required: 'Kindly enter the name of the display eucalyptus image file',
    default: '-'
  },
  uploaded: {
    type: Boolean,
    default: false
  },
  diseasetype: {
    type: String,
    default: 'x'
  },
  diseaselabel: {
    type: String,
    default: 'x'
  },
  stage: {
    type: String,
    default: '-'
  },
  level: {
    type: String,
    default: '-'
  },
  area: {
    type: String,
    default: '-'
  },
  submitter: {
    type: String,
    default: '-'
  },
  validator: {
    type: String,
    default: '-'
  },
  submit: {
    type: Date,
    default: new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString()
  },
  lastedit: {
    type: Date,
    default: new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString()
  },
  latitude: {
    type: String,
    default: '-'
  },
  longitude: {
    type: String,
    default: '-'
  },
  elapsetime: {
    type: String,
    default: '-'
  },
  validated: {
    type: Boolean,
    default: false
  },
  lastvalidated: {
    type: Date
  },
  jobId: {
    type: String,
    default: '-'
  },
  retrain_needed: {
    type: Boolean,
    default: false
  },
  retrain_status: {
    type: String,
    default: 'retrain'
  },
  retrain_elapsetime: {
    type: String,
    default: '-'
  }
});

module.exports = mongoose.model('EucaImages', EucaImageSchema);

// Disease Schema
var EucaDiseaseSchema = new Schema({
  diseaseId: {
    type: String
  },
  label: {
    type: String,
    default: '-'
  },
  totalimage: {
    type: Number,
    integer: true,
    default: 0
  },
  accuracy: {
    type: Number,
    double: true,
    default: 0.0
  },
  lastedited: {
    type: String,
    default: new Date()
  }
});

module.exports = mongoose.model('EucaDiseases', EucaDiseaseSchema);
