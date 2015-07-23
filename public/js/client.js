'use strict';

var uploader = new plupload.Uploader({
  browse_button: 'browseFiles',
  url: '/upload',
  dragdrop: true,
  drop_element: 'drop'
});

uploader.init();

var filesUploading = 0;
var filesUploaded = 0;
var uploaders = [];

uploader.bind('FilesAdded', function(up, files) {
  for(var i = 0; i<files.length; i++) {
    var newUploader = new plupload.Uploader({
      browse_button: 'hidden',
      url: '/upload',
    });
    newUploader.init();
    newUploader.files.push(files[i]);
    uploaders.push(newUploader);
    filesUploading ++;
    configUploader(newUploader);
  };
});

var configUploader = function(newUploader) {
  var html = '';
  html += '<li id="' + newUploader.files[0].id + '">' + newUploader.files[0].name + ' (' + plupload.formatSize(newUploader.files[0].size) + ') <b></b></li>';
  document.getElementById('fileList').innerHTML += html;

  newUploader.bind('UploadProgress', function(up, file) {
    document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
  });

  newUploader.bind('FileUploaded', function(up) {
    filesUploaded ++;
    filesUploading --;
    document.getElementById('uploaded').innerHTML = 'files uploaded: <em>' + filesUploaded + '</em>';
    document.getElementById('uploading').innerHTML = 'files uploading: <em> ' + filesUploading + '</em>';
  });

  newUploader.bind('Error', function(up, err) {
    document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
  });

  newUploader.bind('Error', function(up, err) {
      document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
  });
};

document.getElementById('start-upload').onclick = function() {
  for(var i = 0; i < uploaders.length; i ++) {
    document.getElementById('uploading').innerHTML = 'files uploading: ' + filesUploading;
    uploaders[i].start();
  }
};













// uploader.bind('UploadProgress', function(up, file) {
//   document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
// });

// uploader.bind('StateChanged', function(up) {
//   document.getElementById('queued').innerHTML = 'Files Queued: ' + uploader.total.queued;
//   document.getElementById('uploaded').innerHTML = 'uploaded: ' + uploader.total.uploaded;
// });

// uploader.bind('Error', function(up, err) {
//   document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
// });

// document.getElementById('start-upload').onclick = function() {
//   uploader.start();
// };
