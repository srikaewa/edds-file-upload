'use strict';
module.exports = function(app) {
  var breedingJobList = require('../controllers/breedingJobController');

  // todoList Routes
  /*app.route('/breedingJobs')
    .get(breedingJobList.list_all_breeding_jobs)
    .post(breedingJobList.create_a_breeding_job_data);


  app.route('/breedingJob/:jobId')
    .get(breedingJobList.read_a_breeding_job_data)
    .put(breedingJobList.update_a_breeding_job_data)
    .delete(breedingJobList.delete_a_breeding_job_data);
    */

  app.route('/eutech/breedingJob/:photographer/create')
    .post(breedingJobList.eutech_create_a_breeding_job_data)

  app.route('/eutech/breedingJob/getNextBreedingJobId')
    .get(breedingJobList.eutech_get_next_breeding_job_id)

  app.route('/eutech/jobCount/:photographer')
    .get(breedingJobList.get_breeding_job_count);

  app.route('/eutech/breedingJobs')
    .get(breedingJobList.eutech_list_all_breeding_jobs);

  app.route('/eutech/breedingJob/:jobId')
    .get(breedingJobList.eutech_read_a_breeding_job_data)
    .put(breedingJobList.eutech_update_a_breeding_job_data);

  app.route('/eutech/breedingJob/:jobId/delete')
    .post(breedingJobList.eutech_delete_a_breeding_job_data);

  app.route('/eutech/breedingJob/:jobId/edit')
    .get(breedingJobList.eutech_edit_a_breeding_job_data);

  app.route('/eutech/breedingJob/:jobId/update')
    .post(breedingJobList.eutech_update_a_breeding_job_data);
};
