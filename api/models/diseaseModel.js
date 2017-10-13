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
    default: new Date()
  },
  lastedited: {
    type: Date,
    default: new Date()
  }
});

module.exports = mongoose.model('Diseases', DiseaseSchema);
