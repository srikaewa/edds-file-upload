'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// auto-increment
var connection = mongoose.createConnection("mongodb://localhost/EucaImageDb");

var DiseaseSchema = new Schema({
  disease_number: {
    type: String
  },
  disease_label: {
    type: String
  },
  disease_color:{
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  },
  lastedited: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Diseases', DiseaseSchema);
