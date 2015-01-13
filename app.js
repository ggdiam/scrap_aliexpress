/**
 * Created by sveshnikov on 12.01.2015.
 */


var cheerio = require('cheerio');
var req = require('./req');

/*req.getHtml('https://www.google.ru/', function (err, $) {
 if (err) {
 console.log('getHtml err', err);
 return;
 }

 var btn = $('button.gbqfba span#gbqfsa').text();
 console.log('btn', btn);
 });*/

function ajaxDataToHtml(html){
    html = html.replace('window.productDescription=&apos;', '');
    html = html.replace('&apos;;', '');
    return html;
}

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
        req.getHtml(itemDescUrl, function (err, iData) {
            var itemDesc = cheerio.load(ajaxDataToHtml(iData.html()));
            console.log(itemDesc.html());
            var imgList = [];
            var pics = itemDesc(".product-desc #custom-description .ui-box-body img");
            console.log(pics.length);
            //pics.forEach(function (i, pic) {
            //    imgList.push(itemDesc(pic).attr("src"));
            //});
            //console.log(pics);
        });
    });


    /*
    //http://www.aliexpress.com/item/2015-Fashion-Winter-autumn-long-sleeve-casual-OL-Lady-dress-slim-hip-leather-button-women-work/32256454430.html
    var match = reItemId.Match(itemUrl);
    var itemId = match.Groups[1].Value;

    var itemDescUrl = string.Format("http://desc.aliexpress.com/getDescModuleAjax.htm?productId={0}", itemId);
    var itemDesc = ItemDescAjaxToHtml(Parser.GetStringByUrl(itemUrl));
    var imgList = new List<string>();
    var pics = itemDesc[".product-desc #custom-description .ui-box-body img"];
    imgList = pics.Select(p => p.GetAttribute("src")).ToList();
    */
});