'use strict';
module.exports = function(app) {
  var eucaImageList = require('../controllers/eucaImageController');

  app.route('/table')
  .get(eucaImageList.table_summarize);

  // todoList Routes
  app.route('/eucaImages')
    .get(eucaImageList.list_all_images)
    .post(eucaImageList.create_a_image_data);


  app.route('/eucaImages/:imageId')
    .get(eucaImageList.read_a_image_data)
    .put(eucaImageList.update_a_image_data)
    .delete(eucaImageList.delete_a_image_data);


  app.route('/checkFileServer')
    .get(eucaImageList.check_file_server);

  app.route('/api/photo')
    .post(eucaImageList.upload_file);

  app.route('/runClassify/:imageId')
    .get(eucaImageList.run_classify);

  app.route('/getDiseaseType/:imageId')
    .get(eucaImageList.get_disease_type);

  app.route('/eutech/eucaImages')
    .get(eucaImageList.eutech_list_all_images);

  app.route('/eutech/eucaImages/:imageId')
    .get(eucaImageList.eutech_read_a_image_data)
    .put(eucaImageList.eutech_update_a_image_data);

  app.route('/eutech/eucaImages/:imageId/delete')
    .post(eucaImageList.eutech_delete_a_image_data);

  app.route('/eutech/eucaImages/:imageId/edit')
    .get(eucaImageList.eutech_edit_a_image_data);

  app.route('/eutech/eucaImages/:imageId/update')
    .post(eucaImageList.eutech_update_a_image_data);

  app.route('/eutech/eucaImages/:imageId/validate')
    .post(eucaImageList.eutech_validate_a_image_data);


};
