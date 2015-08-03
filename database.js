/**
 * Created by wuxingyu on 15/7/28.
 */

function saveAlbum(albums, db, callback) {
    if (0 < albums.length) {
        var collection = db.collection('album');

        var obj = albums.shift();
        collection.findOne({name: obj.name, url: obj.url}, {limit: 1}, function (err, result) {
            if (null == result) {
                collection.insertOne({name: obj.name, url: obj.url}, null, function (err, result) {
                    if (err) {
                        console.log("insert data error!!");
                    }
                    else {
                        console.log("save ablum name is " + obj.name + " url is " + obj.url);
                    }
                    saveAlbum(albums, db, callback);
                });
            }
            else {
                saveAlbum(albums, db, callback);
            }
        });
    }
    else {
        callback();
    }
}

function saveImage() {

}

exports.saveAlbum = saveAlbum;
exports.saveImage = saveImage;
