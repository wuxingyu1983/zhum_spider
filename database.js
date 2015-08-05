/**
 * Created by wuxingyu on 15/7/28.
 */

function saveAlbum(obj, db, callback) {
    var collection = db.collection('album');

    collection.findOne({name: obj.name, url: obj.url}, {limit: 1}, function (err, result) {
        if (null == result) {
            collection.insertOne({name: obj.name, url: obj.url}, null, function (err, result) {
                if (err) {
                    console.log("insert data error!!");
                }
                else {
                    console.log("save ablum name is " + obj.name + " url is " + obj.url);
                }
                callback();
            });
        }
        else {
            callback();
        }
    });
}

function saveImage(obj, db, callback) {
    var collection = db.collection('image');

    collection.findOne({ablum: obj.album, url: obj.url}, {limit: 1}, function (err, result) {
        if (null == result) {
            collection.insertOne({ablum: obj.album, url: obj.url, download:0}, null, function (err, result) {
                if (err) {
                    console.log("insert data error!!");
                }
                else {
                    console.log("insert ablum: " + obj.album + " image url:" + obj.url);
                }
                callback();
            });
        }
        else {
            console.log("already exist!! ablum: " + obj.album + " image url:" + obj.url);
            callback();
        }
    });
}

exports.saveAlbum = saveAlbum;
exports.saveImage = saveImage;
