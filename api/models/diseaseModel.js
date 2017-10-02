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
  lastedited: {
    type: Date,
    default: new Date(new Date().getTime() - new Date().getTimezoneOffset()*60*1000).toISOString()
  }
});

module.exports = mongoose.model('Diseases', DiseaseSchema);
