/**
 * Created by sveshnikov on 12.01.2015.
 */


var cheerio = require('cheerio');
var req = require('./req');
var helper = require('./helper');



var reItemId = /\/(\d+).html/g;


var root = "http://www.aliexpress.com";
req.getHtml(root + "/category/200003482/dresses.html?g=y", function (err, page) {
    var items = page("ul.son-list li.list-item");
    console.log('items len:', items.length);

    items.each(function(i, elem) {
        if (i > 0) return;

        var item = cheerio.load(page(this).html());
        var caption = item(".info a.product").attr("title");
        var pic = item(".pic img.picCore").attr("src");
        var price = item(".price .value").text();
        var itemUrl = item(".info a.product").attr("href");
        console.log(i, caption, pic, price, itemUrl, '\n');

        var itemId = reItemId.exec(itemUrl)[1];
        var itemDescUrl = 'http://desc.aliexpress.com/getDescModuleAjax.htm?productId=' + itemId;

        console.log(itemDescUrl);
        req.getText(itemDescUrl, function (err, html) {
            var itemDesc = cheerio.load(helper.normalizeAjaxData(html));
            //console.log(itemDesc.html());
            var imgList = [];
            var pics = itemDesc("img");
            pics.each(function (i, pic) {
                imgList.push(itemDesc(this).attr("src"));
            });
            console.log('pics.length:', pics.length);
        });
    });
});