/**
 * Created by wuxingyu on 15/7/26.
 */

var http = require("http"),
    urlm = require("url"),
    iconv = require("iconv-lite"),
    BufferHelper = require('bufferhelper');

function download(url, parserFunc) {
    var url_obj = urlm.parse(url);
    var prefix = url_obj.protocol + "//" + url_obj.host + "/";
    http.get(url, function(res) {
        var bufferHelper = new BufferHelper();
        res.on('data', function(chunk){
            bufferHelper.concat(chunk);
        });
        res.on('end', function(){
            var html = iconv.decode(bufferHelper.toBuffer(), 'gbk');

//            console.log("the html is " + html);

            parserFunc(html, prefix);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
}

exports.download = download;
