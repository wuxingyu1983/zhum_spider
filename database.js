/**
 * Created by wuxingyu on 15/7/28.
 */

//var mongoClient = require('mongodb').MongoClient;

function saveAlbum(name, url, db) {
    var collection = db.collection('album');

    collection.findOne({name: name, url: url}, {limit: 1}, function (err, result) {
        if (null == result) {
            collection.insertOne({name: name, url: url}, null, function (err, result) {
                if (err) {
                    console.log("insert data error!!");
                }
            });
        }
        else {
        }
    });
}

function saveImage() {

}

exports.saveAlbum = saveAlbum;
exports.saveImage = saveImage;
