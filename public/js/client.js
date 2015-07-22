'use strict';

var uploader = new plupload.Uploader({
  browse_button: 'browseFiles',
  url: '/upload'
});

uploader.init();

uploader.bind('FilesAdded', function(up, files) {
  var html = '';
  plupload.each(files, function(file) {
    html += '<li id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></li>';
  });
  document.getElementById('fileList').innerHTML += html;
  document.getElementById('queued').innerHTML = 'Files Queued: ' + uploader.total.queued;
});

uploader.bind('UploadProgress', function(up, file) {
  document.getElementById(file.id).getElementsByTagName('b')[0].innerHTML = '<span>' + file.percent + "%</span>";
});

uploader.bind('StateChanged', function(up) {
  document.getElementById('queued').innerHTML = 'Files Queued: ' + uploader.total.queued;
  document.getElementById('uploaded').innerHTML = 'uploaded: ' + uploader.total.uploaded;
});

uploader.bind('Error', function(up, err) {
  document.getElementById('console').innerHTML += "\nError #" + err.code + ": " + err.message;
});

document.getElementById('start-upload').onclick = function() {
  uploader.start();
};

 // if(file.percent === 100) {
 //    var fileLi = document.getElementById(file.id);
 //    fileLi.parentNode.removeChild(fileLi);
 //    html = '<li id="' + file.id + '">' + file.name + ' (' + plupload.formatSize(file.size) + ') <b></b></li>';
 //    document.getElementById('doneFileList').innerHTML += html;
 //  };
