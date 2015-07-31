"use strict";

var masterUploader = new plupload.Uploader({
    browse_button: "browseFiles",
    url: "/upload",
    dragdrop: true,
    drop_element: "drop"
});

masterUploader.init();

var filesUploading = 0;
var filesUploaded = 0;
var uploaders = [];

masterUploader.bind("FilesAdded", function(up, files) {
    var workerCount = document.getElementById("workerCount").value;
    if(uploaders.length === 0) {
        build_Workers(workerCount);
    }
    for(var i = 0; i < files.length; i++ ) {
        var html = "";
        html += "<li>" + files[i].name + " (" + plupload.formatSize(files[i].size) + ") <b></b></li>";
        document.getElementById("fileList").innerHTML += html;
    }
});

var build_Workers = function(count) {
    for(var i = 0; i < count; i++) {
        var newUploader = new plupload.Uploader({
            browse_button: "hidden",
            url: "/upload"
        });
        newUploader.init();
        configUploader(newUploader);
        uploaders.push(newUploader);
    }
};

var start_uploader = function(uploader) {
    uploader.files.push(masterUploader.files.shift());
    display_File(uploader, "uploadList");
    uploader.start();
    filesUploading++;
};

var display_File = function(worker,listID) {
    var newFile = (worker.files.length - 1);
    var html = "";
    html += "<li id='" + worker.files[newFile].id + "'>" + worker.files[newFile].name + " (" + plupload.formatSize(worker.files[newFile].size) + ") <b></b></li>";
    document.getElementById(listID).innerHTML += html;
};

var configUploader = function(newUploader) {

    newUploader.bind("UploadProgress", function(up, file) {
        document.getElementById(file.id).getElementsByTagName("b")[0].innerHTML = "<span>" + file.percent + "%</span>";
    });

    newUploader.bind("FileUploaded", function(up) {
        filesUploaded ++;
        filesUploading --;
        document.getElementById("uploaded").innerHTML = "files uploaded: <em>" + filesUploaded + "</em>";
        document.getElementById("uploading").innerHTML = "files uploading: <em> " + filesUploading + "</em>";
    });

    newUploader.bind("UploadComplete", function(up) {
        if(masterUploader.files.length) {
            start_uploader(up);
        }
    });

    newUploader.bind("Error", function(up, err) {
        document.getElementById("console").innerHTML += "\nError #" + err.code + ": " + err.message;
    });
};

masterUploader.bind("Error", function(up, err) {
    document.getElementById("console").innerHTML += "\nError #" + err.code + ": " + err.message;
});

document.getElementById("start-upload").onclick = function() {
    for(var i = 0; i < uploaders.length; i++){
        start_uploader(uploaders[i]);
    }
};


