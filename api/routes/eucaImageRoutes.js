'use strict';
module.exports = function(app) {
  var eucaImageList = require('../controllers/eucaImageController');


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

};
