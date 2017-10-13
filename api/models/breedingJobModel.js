'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// auto-increment
var connection = mongoose.createConnection("mongodb://localhost/EucaImageDb");
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(connection);

var BreedingJobSchema = new Schema({
  jobId: {
    type: String,
    default: 'eutech-jb-001-xxxxxxx'
  },
  culture: {
    type: String,
    default: ''
  },
  round: {
    type: Number,
    integer: true,
    default: 1
  },
  breedingdate: {
    type: Date
  },
  collectingdate: {
    type: Date
  },
  photographer: {
    type: String
  },
  rep: {
    type: Number,
    integer: true,
    default: 1
  },
  clone: {
    type: String,
    default: "xxxx"
  },
  number: {
    type: Number,
    integer: true,
    default: 1
  },
  numberdone:{
    type: Number,
    integer: true,
    default: 0
  },
  created: {
    type: Date,
    default: new Date()
  },
  lastedited: {
    type: Date,
    default: new Date()
  },
  note: {
    type: String
  }
});

BreedingJobSchema.plugin(autoIncrement.plugin, 'BreedingJobs');
module.exports = mongoose.model('BreedingJobs', BreedingJobSchema);
