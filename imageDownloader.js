/**
 * Created by wuxingyu on 15/7/26.
 */

var database = require("./database");
var fs = require("fs");
var http = require("http");

function download(db) {
    database.getImages(db, function(images) {
        if (images) {
            downloadImage(images, db, function() {
               console.log("download finished!!");
            });
        }
        else {
            console.log("download query error")
        }
    });
}

function downloadImage(images, db, callback) {
    if (0 == images.length) {
        callback();
    }
    else {
        var obj = images.shift();

        // 先判断目录是否已经建立
        var path = "./download/" + obj.ablum;

        fs.exists(path, function (exists) {
            if (exists) {
                http.get(obj.url, function(res){
                    if (res.statusCode == 200) {
                        var writestream = fs.createWriteStream(path + "/" + Math.floor(Math.random()*100000) + obj.url.substr(-4,4));
                        res.pipe(writestream);
                        writestream.on('finish', function(){
                            // 记录已经下载过了
                            database.imageSaved(obj, db, function(){
                                downloadImage(images, db, callback);
                            });
                        });
                        writestream.on('error', function(){
                            console.log("writestream error");
                            downloadImage(images, db, callback);
                        });
                    }
                    else {
                        console.log("statusCode: " + res.statusCode);
                        downloadImage(images, db, callback);
                    }
                }).on('error', function(e) {
                    console.log("Got error: " + e.message);
                    downloadImage(images, db, callback);
                });
            }
            else {
                fs.mkdir(path, 0777, function (err) {
                    if (err) {
                        downloadImage(images, db, callback);
                    }
                    else {
                        http.get(obj.url, function(res){
                            if (res.statusCode == 200) {
                                var writestream = fs.createWriteStream(path + "/" + Math.floor(Math.random()*100000) + obj.url.substr(-4,4));
                                res.pipe(writestream);
                                writestream.on('finish', function(){
                                    // 记录已经下载过了
                                    database.imageSaved(obj, db, function(){
                                        downloadImage(images, db, callback);
                                    });
                                });
                                writestream.on('error', function(){
                                    console.log("writestream error");
                                    downloadImage(images, db, callback);
                                });
                            }
                            else {
                                console.log("statusCode: " + res.statusCode);
                                downloadImage(images, db, callback);
                            }
                        }).on('error', function(e) {
                            console.log("Got error: " + e.message);
                            downloadImage(images, db, callback);
                        });
                    }
                });
            }
        });
    }
}

exports.download = download;
