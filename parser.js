/**
 * Created by wuxingyu on 15/7/27.
 */
var cheerio = require("cheerio");
var html_downloader = require("./htmlDownloader");
var database = require("./database");

// 处理照片详情页
function parseDetail(html, prefix, db) {
    var $ = cheerio.load(html);

    // 照片的地址
    $("#photo_pic > a > img").each(function(i, v){
        var image_url = prefix + $(v).attr("src");
        console.log("the Image url is " + image_url);
    });
}

// 处理相册、下一页
function parseAlbum(html, prefix, db) {
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
function parseHome(html, prefix, db) {
    var $ = cheerio.load(html);

    // 遍历本页的 album
    var albums = [];

    $("#tiles li").each(function(i,v){
        var album_url = prefix + $(v).find("a").attr("href");
        var album_name = $(v).find("img").attr("alt");

        var album_obj = new Object();
        album_obj.name = album_name;
        album_obj.url = album_url;

        albums.push(album_obj);
    });

    var nxt_url = null;

    // 是否还有下一页
    $(".nxt").each(function(i, v){
        nxt_url = prefix + $(v).attr("href");
    });

    database.saveAlbum(albums, db, function(){
        // albums 中的已经处理完了
        if (nxt_url) {
            // 还有下一页
            console.log("the next page is " + nxt_url);
            html_downloader.download(nxt_url, parseHome, db);
        }
        else {
            // 全部处理完了
            console.log("Finished !!");
        }
    });
}

exports.parseHome = parseHome;
exports.parseAlbum = parseAlbum;
exports.parseDetail = parseDetail;
