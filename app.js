/**
 * Created by sveshnikov on 12.01.2015.
 */


var cheerio = require('cheerio');
var req = require('./req');
var helper = require('./helper');
var csv = require('csv');


/*function myObj (){
    this.field1 = 'ffffff';
    this.field2 = 2222;
}

var input = new myObj();
csv.stringify([input, input], function(err, output){
    process.stdout.write(output);
});*/


var reItemId = /\/(\d+).html/g;


var root = "http://www.aliexpress.com";
req.getHtml(root + "/category/200003482/dresses.html?g=y", function (err, page) {
    var items = page("ul.son-list li.list-item");
    console.log('items len:', items.length);

    items.each(function(i, elem) {
        if (i > 0) return;

        var obj = {};
        var item = cheerio.load(page(this).html());
        obj.caption = item(".info a.product").attr("title");
        obj.pic = item(".pic img.picCore").attr("src");
        obj.price = item(".price .value").text();
        obj.itemUrl = item(".info a.product").attr("href");
        //console.log(i, caption, pic, price, itemUrl, '\n');

        var itemId = reItemId.exec(obj.itemUrl)[1];
        var itemDescUrl = 'http://desc.aliexpress.com/getDescModuleAjax.htm?productId=' + itemId;

        //console.log(itemDescUrl);
        req.getText(itemDescUrl, function (err, html) {
            var itemDesc = cheerio.load(helper.normalizeAjaxData(html));
            //console.log(itemDesc.html());
            obj.imgList = [];
            var pics = itemDesc("img");
            pics.each(function (i, pic) {
                obj.imgList.push(itemDesc(this).attr("src"));
            });
            console.log('pics.length:', pics.length);

            csv.stringify([obj], function(err, output){
                console.log(output+'\n');

                console.log(JSON.stringify([obj])+'\n');

                csv.parse(output, function (err, data) {
                    console.log(data+'\n');
                });
            });
        });
    });
});