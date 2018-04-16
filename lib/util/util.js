/**
 * encrypto 加密程序
 * @param {Strng} str 待加密字符串
 * @param {Number} xor 异或值
 * @param {Number} hex 加密后的进制数
 * @return {Strng} 加密后的字符串
 */
function encrypto(str, xor, hex) {
    if (typeof str !== 'string' || typeof xor !== 'number' || typeof hex !== 'number') {
        return;
    }

    var resultList = [];
    hex = hex <= 25 ? hex : hex % 25;

    for (var i = 0; i < str.length; i++) {
        // 提取字符串每个字符的ascll码
        var charCode = str.charCodeAt(i);
        // 进行异或加密
        charCode = (charCode * 1) ^ xor;
        // 异或加密后的字符转成 hex 位数的字符串
        charCode = charCode.toString(hex);
        resultList.push(charCode);
    }

    var splitStr = String.fromCharCode(hex + 97);
    var resultStr = resultList.join(splitStr);
    return resultStr;
}

exports.filterResult = function (result) {
    var filterResult = {};
    var items = new Array();
    for (var i = 0; i < result.items.length; i++) {
        var item = {};
        item.link = result.items[i].link;
        item.formattedUrl = result.items[i].formattedUrl;
        item.htmlSnippet = result.items[i].htmlSnippet;
        item.title = result.items[i].title;
        items[i] = item;
    }
    filterResult.items = items;
    filterResult.queries = result.queries;
    filterResult.searchInformation = result.searchInformation;
    filterResult.paging = result.paging;
    filterResult.id = result.id;
    return encrypto(JSON.stringify(filterResult), 123, 25);
}