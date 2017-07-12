var express	=	require("express");
var multer	=	require('multer');
var app	=	express();
var storage	=	multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, '../../uploads');
  },
  filename: function (req, file, callback) {
    //callback(null, file.fieldname + '-' + Date.now());
    callback(null, file.originalname);
  }
});
var upload = multer({ storage : storage}).single('userPhoto');

app.get('/',function(req,res){
      res.sendFile(__dirname + "/index.html");
});

app.get('/checkFileServer',function(req,res){
      res.end("200");
});


app.post('/api/photo',function(req,res){
  console.log("Upload POSTing....");
	upload(req,res,function(err) {
		if(err) {
      console.log("Error uploading file.");
			return res.end("Error uploading file.");
		}
    console.log("File " + req.file.originalname + " upload successfully!");
    console.log("Uploading at time " + new Date());

    /*** returning info about uploaded file ***/
		res.end('{"status":"201","uploadedFilename":"' + req.file.originalname + '"}');
	});
});

app.listen(3009,function(){
  console.log("Eucalyptus Disease Diagnosis System - Backend");
  console.log("Server running on port 3009");
});
