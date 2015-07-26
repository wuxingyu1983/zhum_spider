/**
 * Created by wuxingyu on 15/7/27.
 */
var cheerio = require("cheerio"),
    html_downloader = require("./htmlDownloader");

// 处理照片详情页
function parseDetail(html, prefix) {
    var $ = cheerio.load(html);

    // 照片的地址
    $("#photo_pic > a > img").each(function(i, v){
        var image_url = prefix + $(v).attr("src");
        console.log("the Image url is " + image_url);
    });
}

// 处理相册、下一页
function parseAlbum(html, prefix) {
    var $ = cheerio.load(html);

    // 遍历照片详情
    $("#tiles li").each(function(i,v){
        var detail_url = prefix + $(v).find("a").attr("href");
        console.log(i + ": the Detail url is " + detail_url);
        html_downloader.download(detail_url, parseDetail);
    });

    // 是否还有下一页
    $(".nxt").each(function(i, v){
        var nxt_url = prefix + $(v).attr("href");
        console.log("the next page is " + nxt_url);
        html_downloader.download(nxt_url, parseAlbum);
    });
}

// 处理首页列表、下一页
function parseHome(html, prefix) {

}

exports.parseHome = parseHome;
exports.parseAlbum = parseAlbum;
exports.parseDetail = parseDetail;