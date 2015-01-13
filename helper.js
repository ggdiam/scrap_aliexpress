var ajaxRe = /window.productDescription='(.*)';/g;

module.exports = {
    normalizeAjaxData: function (text) {
        var res = '';
        var match = ajaxRe.exec(text);
        if (match) {
            res = match[1];
        }
        return res;
    }
}