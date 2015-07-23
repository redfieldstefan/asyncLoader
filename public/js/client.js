'use strict';

var masterUploader = new plupload.Uploader({
  browse_button: 'browseFiles',
  url: '/upload',
  dragdrop: true,
  drop_element: 'drop'
});

masterUploader.init();

var filesUploading = 0;
var filesUploaded = 0;
var workerCount = document.getElementById('workerCount').value;
var workerIndex = 0;
var uploaders = [];

masterUploader.bind('FilesAdded', function(up, files) {
  if(uploaders.length === 0) {
    buildWorkers(workerCount);
  }
  for(var i = 0; i < files.length; i++) {
    if(workerIndex === workerCount) {
      workerIndex = 0;
    }
    if(!uploaders[workerIndex]){
      workerIndex = 0;
    }
    var currentWorker = uploaders[workerIndex];
    currentWorker.files.push(files[i]);
    displayFile(currentWorker, 'fileList');
    filesUploading++;
    workerIndex++;
  }
});

var buildWorkers = function(count) {
  for(var i = 0; i < count; i++) {
    var newUploader = new plupload.Uploader({
      browse_button: 'hidden',
      url: '/upload'
    });
    newUploader.init();
    configUploader(newUploader);
    uploaders.push(newUploader);
  };
};

var displayFile = function(worker,listID) {
  var newFile = (worker.files.length - 1);
  var html = '';
  html += '<li id="' + worker.files[newFile].id + '">' + worker.files[newFile].name + ' (' + plupload.formatSize(worker.files[newFile].size) + ') <b></b></li>';
  document.getElementById(listID).innerHTML += html;
}

var configUploader = function(newUploader) {

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
};

masterUploader.bind('Error', function(up, err) {
  document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
});

document.getElementById('start-upload').onclick = function() {
  for(var i = 0; i < uploaders.length; i ++) {
    document.getElementById('uploading').innerHTML = 'files uploading: ' + filesUploading;
    uploaders[i].start();
  }
};
