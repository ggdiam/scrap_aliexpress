/**
 * Created by sveshnikov on 12.01.2015.
 */

var cheerio = require('cheerio');
var request = require('request');

var headers = {
    'User-Agent':'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.95 Safari/537.36'
};
var options = {
    url:'',
    headers:headers
};

module.exports = {
    getHtml: function (url, cb) {
        options.url = url;
        request(options, function (error, response, body) {
            if (error) {
                console.log('request err', error);
                if (cb){ cb(error); }
                return;
            }

            if (!error && response.statusCode == 200) {
                if (cb){
                    cb(null, cheerio.load(body));
                }
            }
        })
    }
};