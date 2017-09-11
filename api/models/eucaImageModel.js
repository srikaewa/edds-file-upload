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
    type: [{
      type: String,
      enum: ['Cerco', 'Cryptos', 'Cylindro', 'Xantho','x','none']
    }],
    default: ['x']
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
    type: String,
    default: new Date()
  },
  lastedit: {
    type: String,
    default: '-'
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
  jobId: {
    type: String,
    default: '-'
  }
});

module.exports = mongoose.model('EucaImages', EucaImageSchema);
