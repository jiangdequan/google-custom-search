$(function () {

    var public_key = "-----BEGIN PUBLIC KEY-----\n" +
        "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC2s1jNEI45HuQGdIaNlrxi+GQp\n" +
        "rZrzVEtxWD1Nq3s4899qkJIiFQr+MYRwCfRWvYn/xLRt/i1UqbtUvjkYOkyqFHu1\n" +
        "svxZMAbGIUQqdFDkAIQcVYt5Ux2aUH/DJvBRsIF68TO7XTvImi6flJtle92rIsev\n" +
        "qH+4kv82Txfa68nWnQIDAQAB\n" +
        "-----END PUBLIC KEY-----";

    var crypt = new JSEncrypt();
    crypt.setPublicKey(public_key);

    function request() {
        var keywords = $('#input-search-text').val();

        if (keywords === '' || keywords === undefined || keywords === null) {
            return;
        }

        var encrypted = crypt.encrypt(keywords);
        window.location.href = '/search?id=' + encodeURIComponent(encrypted);
    }

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
});