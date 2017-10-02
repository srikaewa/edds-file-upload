'use strict';
module.exports = function(app) {
  var eddsList = require('../controllers/eddsController');

  // todoList Routes
  /*app.route('/diseases')
    .get(diseaseList.list_all_breeding_jobs)
    .post(diseaseList.create_a_breeding_job_data);


  app.route('/disease/:jobId')
    .get(diseaseList.read_a_breeding_job_data)
    .put(diseaseList.update_a_breeding_job_data)
    .delete(diseaseList.delete_a_breeding_job_data);
    */

  app.route('/eutech/edds')
    .get(eddsList.eutech_edds_dashboard);

  app.route('/eutech/edds/chart')
    .get(eddsList.eutech_edds_chart);

  app.route('/eutech/edds/:eddsId')
    .get(eddsList.eutech_read_a_edds_data)
    //.delete(diseaseList.eutech_delete_a_disease_data);

  app.route('/eutech/edds/create')
    .post(eddsList.eutech_create_a_edds_data)

  app.route('/eutech/edds/:eddsId/delete')
    .post(eddsList.eutech_delete_a_edds_data);

  app.route('/eutech/edds/:eddsId/edit')
    .get(eddsList.eutech_edit_a_edds_data);

  app.route('/eutech/edds/:eddsId/update')
    .post(eddsList.eutech_update_a_edds_data);
  app.route('/eutech/edds/updatetoday')
    .post(eddsList.eutech_update_today_edds_data);
};
