(function() {
    window.H5 = window.$ || {};
    H5.cookie = H5.cookie || {};
    H5.cookie.get = function(key) {
        var value = null;
        var reg = new RegExp('(^| )' + key + '=([^;]*)(;|\x24)'), result = reg
                .exec(document.cookie);
        if (result) {
            value = result[2] || '';
        }
        if ('string' == typeof value) {
            value = decodeURIComponent(value);
            return value;
        }
        return '';
    };
    H5.cookie.set = function(key, value, options) {
        options = options || {};
        value = encodeURIComponent(value);
        var expires = options.expires;
        if ('number' == typeof options.expires) {
            expires = new Date();
            expires.setTime(expires.getTime() + options.expires);
        }

        document.cookie = key + '=' + value
                + (options.path ? '; path=' + options.path : '')
                + (expires ? '; expires=' + expires.toGMTString() : '')
                + (options.domain ? '; domain=' + options.domain : '')
                + (options.secure ? '; secure' : '');
    };
    function get_uid() {
        var uid = H5.cookie.get('QC006');
        if (!uid) {
            uid = 'u' + new Date().getTime();
            H5.cookie.set('QC006', uid, {
                expires : 365 * 24 * 3600 * 1000,
                path : '/',
                domain : 'iqiyi.com'
            });
        }
        return uid;
    }

    function get_weid() {
        var weid = H5.cookie.get('QC112');
        if (!weid) {
            weid = 'weid' + new Date().getTime();
            H5.cookie.set('QC112', weid, {
                path : '/',
                domain : 'iqiyi.com'
            });
        }
        return weid;
    }

    function get_lrfr() {
        var lrfr = H5.cookie.get('QC007');
        if (!lrfr) {
            lrfr = document.referrer ? document.referrer : 'DIRECT';
        }
        return lrfr;
    }

    function get_ppuid() {
        return JSON.parse(H5.cookie.get('P00002') || '{}').uid || '';
    }

    function get_msrc() {
        var m = location.href.match(/msrc=([^=&#]*)/i);
        return m ? m[1] : H5.cookie.get('QC015');
    }

    function sendPingback(options, url) {
        var arr = [];
        for ( var i in options) {
            arr.push(encodeURIComponent(i) + '='
                    + encodeURIComponent(options[i]));
        }
        var image = new Image();
        url = url || '//msg.video.qiyi.com/jpb.gif';
        image.src = url + '?' + arr.join('&');
    }

    var fvArr = location.href.match(/fv=([^=&#]*)/i);
    var fv = fvArr ? fvArr[1] : '';
    if(fv) {
        sendPingback({
            rdm : new Date().getTime(),
            qtcurl : location.href,
            rfr : document.referrer,
            flshuid : get_uid(),
            lrfr : get_lrfr(),
            ppuid : get_ppuid(),
            platform : 31,
            weid : get_weid(),
            msrc : get_msrc(),
            bstp : 56,
            v_plf : '97ae2982356f69d8',
            as: $.crypto.md5('31' + get_uid() + get_weid() + 'ChEnYH0415dadrrEDFf2016'),
            v_fv : fv
        });
    } else {
        sendPingback({
            rdm : new Date().getTime(),
            qtcurl : location.href,
            rfr : document.referrer,
            flshuid : get_uid(),
            lrfr : get_lrfr(),
            ppuid : get_ppuid(),
            platform : 31,
            weid : get_weid(),
            msrc : get_msrc(),
            as: $.crypto.md5('31' + get_uid() + get_weid() + 'ChEnYH0415dadrrEDFf2016')
        });
    }
    
    $(document).on('click', function(e) {
        e.preventDefault();

        var target = $(e.target);
        var rseat = target.attr('rseat');
        var block = target.attr('block');
        if (rseat) {
            sendPingback({
                t : 20,
                pf : 2,
                p : 20,
                p1 : 201,
                rseat : rseat,
                u : get_uid(),
                pu : get_ppuid(),
                rn : new Date().getTime(),
                block : block
            }, '//msg.iqiyi.com/b');
        }

        var url = target.attr('href');
        if (url && !/javascript\:/i.test(url)) {
            setTimeout(function() {
                location.href = url;
            }, 500);
        }
    });
})();