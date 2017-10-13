'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// auto-increment
var connection = mongoose.createConnection("mongodb://localhost/EucaImageDb");

var DiseaseSchema = new Schema({
  created: {
    type: Date,
    default: new Date()
  },
  disease_number: {
    type: String
  },
  disease_label: {
    type: String
  },
  total_images: {
    type: Number,
    integer: true,
    default: 0
  },
  total_images_today: {
    type: Number,
    integer: true,
    default: 0
  },
  total_validated_images: {
    type: Number,
    integer: true,
    default: 0
  },
  total_accuracy:{
    type: Number,
    double: true,
    default: 0
  },
  lastedited: {
    type: Date,
    default: new Date()
  }
});

var EDDSSchema = new Schema({
  total_images: {
    type: Number,
    integer: true,
    default: 0
  },
  total_images_today: {
    type: Number,
    integer: true,
    default: 0
  },
  total_validated_images: {
    type: Number,
    integer: true,
    default: 0
  },
  total_validated_images_today: {
    type: Number,
    integer: true,
    default: 0
  },
  total_invalidated_images: {
    type: Number,
    integer: true,
    default: 0
  },
  total_invalidated_images_today: {
    type: Number,
    integer: true,
    default: 0
  },
  total_accuracy: {
    type: Number,
    double: true,
    default: 0.0
  },
  created: {
    type: Date,
    default: new Date()
  },
  lastedited: {
    type: Date,
    default: new Date()
  },
  dayedited: {
    type: String,
    default: new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString().substr(9,1)
  },
  monthedited:{
    type: String,
    default: new Date().getMonth() + 1
  },
  yearedited:{
    type: String,
    default: new Date().getFullYear()
  },
  diseases: [DiseaseSchema]
});

module.exports = mongoose.model('EDDSs', EDDSSchema);
module.exports = mongoose.model('DiseaseInfo', DiseaseSchema);
