
function showPrevOrNextPage(left, right, current, paging) {
    if (left < current && current < right) {
        paging.showPrevPage = true;
        paging.showNextPage = true;
        return;
    }
    if (left === right) {
        paging.showPrevPage = false;
        paging.showNextPage = false;
        return;
    }
    if (left === current) {
        paging.showPrevPage = false;
        paging.showNextPage = true;
        return;
    }
    if (right === current) {
        paging.showPrevPage = true;
        paging.showNextPage = false;
        return;
    }
}

exports.paging = function (totalResults, num, currentPageIndex) {
    var paging = {};
    paging.currentPageIndex = currentPageIndex;

    var totalPage = Math.floor(totalResults / num);
    if (totalResults % num !== 0) {
        totalPage += 1;
    }
    paging.showPagingBar = (totalPage === 1) ? false : true;
    if (!paging.showPagingBar) {
        return paging;
    }

    var pages = new Array();
    if (totalPage <= 10) {
        for (var i = 1; i <= totalPage; i++) {
            var page = {};
            page.start = (i - 1) * 10 + 1;
            page.label = i;
            pages[i - 1] = page;
        }
        showPrevOrNextPage(1, totalPage, currentPageIndex, paging);
        paging.pages = pages;
        return paging;
    }

    var left = 0;
    var right = 0;
    if (currentPageIndex < 10) {
        for (var i = 1; i <= 10; i++) {
            var page = {};
            page.start = (i - 1) * 10 + 1;
            page.label = i;
            pages[i - 1] = page;
        }
        left = 1;
        right = 10;
    } else {
        left = currentPageIndex - 5;
        right = currentPageIndex + 4;
        if (right > totalPage) {
            right = totalPage;
        }
        var index = 0;
        for (var i = left; i <= right; i++) {
            var page = {};
            page.start = (i - 1) * 10 + 1;
            page.label = i;
            pages[index] = page;
            index++;
        }
    }
    showPrevOrNextPage(left, right, currentPageIndex, paging);
    paging.pages = pages;
    return paging;
}