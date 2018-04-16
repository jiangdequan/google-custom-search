var express = require('express');
var router = express.Router();
var JSEncrypt = require('node-jsencrypt');
var request = require('request');
var Logger = require('../lib/log/logger');
var FileUtils = require('../lib/util/fileutils');
var Paging = require('../lib/util/paging');
var Util = require('../lib/util/util');

var config = FileUtils.loadJsonFile(__dirname + '/../config.json');

// 私钥
var private_key = process.env['PRIVATE_KEY'] || FileUtils.loadFile(__dirname + '/../private_key.perm');

var decrypt = new JSEncrypt();
decrypt.setPrivateKey(private_key);

var fixedUrl = FileUtils.spliceFixUrl(config);

/* . */
router.get('/', function (req, res, next) {
    var text = decodeURIComponent(req.query.id);
    Logger.debug(text, __filename);
    var uncrypt = decrypt.decrypt(text);
    Logger.debug(uncrypt, __filename);

    var start = req.query.start;
    var currentPageIndex = 1;
    if (null === start || undefined === start || '' === undefined) {
        start = 1;
    } else {
        currentPageIndex = Math.floor(start / config.num) + 1;
    }
    Logger.debug(currentPageIndex, __filename);

    var url = fixedUrl + encodeURIComponent(uncrypt) + '&start=' + start;
    Logger.debug(url, __filename);

     request(url, function (err, response, body) {
         if (!err && response.statusCode == 200) {
             var searchResult = JSON.parse(body);
             if (searchResult.error) {
                 Logger.error(searchResult, __filename);
                 res.render('index', {title: 'Google'});
             } else {
                 var paging = Paging.paging(searchResult.searchInformation.totalResults, config.num, currentPageIndex);
                 var result = searchResult;
                 result.paging = paging;
                 result.id = req.query.id;
                 var test = Util.filterResult(result);
                 res.render('search', {title: uncrypt + ' - Google 搜索', test: test});
             }
         } else {
             Logger.error('error occured when invoke api!', __filename)
             Logger.error(err, __filename);
             res.render('index', {title: 'Google'});
         }
     });
});

module.exports = router;
