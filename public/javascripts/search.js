$(function () {
    $('#btn-search').click(function () {
        request();
    });

    $("#input-search-text").bind("keydown", function (e) {
        var theEvent = e || window.event;
        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
        if (code == 13) {
            // 回车执行查询
            request();
            return false;
        }
    });
    loadItems();
});

/**
 * 发起搜索请求.
 */
function request() {
    // 公钥
    var public_key = "-----BEGIN PUBLIC KEY-----\n" +
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC2s1jNEI45HuQGdIaNlrxi+GQp\n" +
        "rZrzVEtxWD1Nq3s4899qkJIiFQr+MYRwCfRWvYn/xLRt/i1UqbtUvjkYOkyqFHu1\n" +
        "svxZMAbGIUQqdFDkAIQcVYt5Ux2aUH/DJvBRsIF68TO7XTvImi6flJtle92rIsev\n" +
        "qH+4kv82Txfa68nWnQIDAQAB\n" +
        "-----END PUBLIC KEY-----";

    var crypt = new JSEncrypt();
    crypt.setPublicKey(public_key);

    // 获取搜索内容
    var keywords = $('#input-search-text').val();

    // 搜索内容为空
    if (keywords === '' || keywords === undefined || keywords === null) {
        return;
    }

    // 加密搜索内容
    var encrypted = crypt.encrypt(keywords);

    // 修改地址栏地址,发起get请求
    window.location.href = '/search?id=' + encodeURIComponent(encrypted);
}

/**
 * 加载搜索结果.
 */
function loadItems() {
    // 获取搜索的结果
    var q = $("#q").val();
    // 搜索结果为空
    if (undefined === q || '' === q || null === q) {
        return;
    }
    // 解密搜索结果
    var result = decrypto(q, 123, 25);
    // 解析为JSON数据
    var resultJson = JSON.parse(result);

    // 页面标题
    window.document.title = resultJson.queries.request[0].searchTerms + ' ' + window.document.title;
    // 搜索内容写入搜索框
    $("#input-search-text").val(resultJson.queries.request[0].searchTerms);

    // 拼接搜索结果
    var html = "<div class=\"container\"><p style=\"color: grey\"><small>找到约 ";
    html += resultJson.searchInformation.formattedTotalResults + " 条结果(用时";
    html += resultJson.searchInformation.formattedSearchTime + "秒)</small></p>";
    for (var i = 0; i < resultJson.items.length; i++) {
        html += "<div class=\"row\"><div class=\"col-md-8\"><h6>";
        html += "<a href=\"" + resultJson.items[i].link + "\" target=\"_blank\">";
        html += resultJson.items[i].title + "</a></h6><small class=\"small-link\">";
        if (resultJson.items[i].formattedUrl.length > 80) {
            html += resultJson.items[i].formattedUrl.substring(0, 80) + '...';
        } else {
            html += resultJson.items[i].formattedUrl;
        }
        html += "</small><p class=\"p-result-desc\">";
        html += resultJson.items[i].htmlSnippet + "</p></div></div>";
    }
    if (resultJson.paging.showPagingBar) {
        html += "<nav aria-label=\"Page navigation example\"><ul class=\"pagination\">";
        if (resultJson.paging.showPrevPage) {
            html += "<li class=\"page-item\"><a class=\"page-link\" href=\"/search?id=" + encodeURIComponent(resultJson.id) + "&start=";
            html += (resultJson.paging.currentPageIndex - 2) * 10 + 1 + "\" aria-label=\"Previous\"><span aria-hidden=\"true\">&laquo;</span><span class=\"sr-only\">Previous</span></a></li>";
        } else {
            html += "<li class=\"page-item disabled\"><a class=\"page-link\" href=\"#\" aria-label=\"Previous\"><span aria-hidden=\"true\">&laquo;</span><span class=\"sr-only\">Previous</span></a></li>";
        }
    }
    for (var i = 0, l = resultJson.paging.pages.length; i < l; i++) {
        if (resultJson.paging.pages[i].label == resultJson.paging.currentPageIndex) {
            html += "<li class=\"page-item active\"><a class=\"page-link\" href=\"#\" onclick=\"return false\">";
            html += resultJson.paging.pages[i].label + "</a></li>";
        } else {
            html += "<li class=\"page-item\"> <a class=\"page-link\" href=\"/search?id=" + encodeURIComponent(resultJson.id) + "&start=" + resultJson.paging.pages[i].start;
            html += "\">" + resultJson.paging.pages[i].label + "</a></li>";
        }
    }
    if (resultJson.paging.showNextPage) {
        html += "<li class=\"page-item\"><a class=\"page-link\" href=\"/search?id=" + encodeURIComponent(resultJson.id) + "&start=" + (resultJson.paging.currentPageIndex * 10 + 1) + "\" aria-label=\"Next\">";
        html += "<span aria-hidden=\"true\">&raquo;</span><span class=\"sr-only\">Next</span></a></li>";
    } else {
        html += "<li class=\"page-item disabled\"><a class=\"page-link\" href=\"#\" aria-label=\"Next\"><span aria-hidden=\"true\">&raquo;</span><span class=\"sr-only\">Next</span></a></li>";
    }

    $("nav").after($(html));
}

/**
 * decrypto 解密程序
 * @param {Strng} str 待加密字符串
 * @param {Number} xor 异或值
 * @param {Number} hex 加密后的进制数
 * @return {Strng} 加密后的字符串
 */
function decrypto(str, xor, hex) {
    if (typeof str !== 'string' || typeof xor !== 'number' || typeof hex !== 'number') {
        return;
    }
    var strCharList = [];
    var resultList = [];
    hex = hex <= 25 ? hex : hex % 25;
    // 解析出分割字符
    var splitStr = String.fromCharCode(hex + 97);
    // 分割出加密字符串的加密后的每个字符
    strCharList = str.split(splitStr);

    for (var i = 0; i < strCharList.length; i++) {
        // 将加密后的每个字符转成加密后的ascll码
        var charCode = parseInt(strCharList[i], hex);
        // 异或解密出原字符的ascll码
        charCode = (charCode * 1) ^ xor;
        var strChar = String.fromCharCode(charCode);
        resultList.push(strChar);
    }
    var resultStr = resultList.join('');
    return resultStr;
}
