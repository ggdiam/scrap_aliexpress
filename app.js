/**
 * Created by sveshnikov on 12.01.2015.
 */

var req = require('./req');

req.getHtml('https://www.google.ru/', function (err, $) {
    if (err) {
        console.log('getHtml err', err);
        return;
    }

    var btn = $('button.gbqfba span#gbqfsa').text();
    console.log('btn', btn);
});