'use strict';

var uploader = new plupload.Uploader({
  browse_button: 'browseFiles',
  url: '/upload',
  dragdrop: true,
  drop_element: 'drop'
});

uploader.init();

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
    uploader.files.pop();
  };
  configUploaders();
});

var configUploaders = function() {
  for(var i = 0; i < uploaders.length; i++) {
    var html = '';
    html += '<li id="' + uploaders[i].files[0].id + '">' + uploaders[i].files[0].name + ' (' + plupload.formatSize(uploaders[i].files[0].size) + ') <b></b></li>';
    document.getElementById('fileList').innerHTML += html;

    uploaders[i].bind('UploadProgress', function(up, file) {
      document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
    });

    uploaders[i].bind('StateChanged', function(up) {
      document.getElementById('queued').innerHTML = 'Files Queued: ' + uploader.total.queued;
      document.getElementById('uploaded').innerHTML = 'uploaded: ' + uploader.total.uploaded;
    });

    uploaders[i].bind('Error', function(up, err) {
      document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
    });
  };
};

uploader.bind('Error', function(up, err) {
      document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
    });

document.getElementById('start-upload').onclick = function() {
  for(var i = 0; i < uploaders.length; i ++) {
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
