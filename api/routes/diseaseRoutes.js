'use strict';
module.exports = function(app) {
  var diseaseList = require('../controllers/diseaseController');

  // todoList Routes
  /*app.route('/diseases')
    .get(diseaseList.list_all_breeding_jobs)
    .post(diseaseList.create_a_breeding_job_data);


  app.route('/disease/:jobId')
    .get(diseaseList.read_a_breeding_job_data)
    .put(diseaseList.update_a_breeding_job_data)
    .delete(diseaseList.delete_a_breeding_job_data);
    */

  app.route('/eutech/diseases')
    .get(diseaseList.eutech_list_all_diseases);

  app.route('/eutech/disease/list')
    .get(diseaseList.eutech_get_disease_list);

  app.route('/eutech/disease/:diseaseId')
    .get(diseaseList.eutech_read_a_disease_data)
    //.delete(diseaseList.eutech_delete_a_disease_data);

  app.route('/eutech/disease/create')
    .post(diseaseList.eutech_create_a_disease_data)

  app.route('/eutech/disease/:diseaseId/delete')
    .post(diseaseList.eutech_delete_a_disease_data);

  app.route('/eutech/disease/:diseaseId/edit')
    .get(diseaseList.eutech_edit_a_disease_data);

  app.route('/eutech/disease/:diseaseId/update')
    .post(diseaseList.eutech_update_a_disease_data);
};
