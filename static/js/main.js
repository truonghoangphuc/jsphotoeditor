function encode64(e){e=escape(e);var t,r,n,i,o,a="",d="",c="",l=0;do t=e.charCodeAt(l++),r=e.charCodeAt(l++),d=e.charCodeAt(l++),n=t>>2,i=(3&t)<<4|r>>4,o=(15&r)<<2|d>>6,c=63&d,isNaN(r)?o=c=64:isNaN(d)&&(c=64),a=a+keyStr.charAt(n)+keyStr.charAt(i)+keyStr.charAt(o)+keyStr.charAt(c),t=r=d="",n=i=o=c="";while(l<e.length);return a}
function getParameterByName(e){e=e.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var t=new RegExp("[\\?&]"+e+"=([^&#]*)"),r=t.exec(location.search);return null==r?"":decodeURIComponent(r[1].replace(/\+/g," "))}
function getCookie(e){var t=document.cookie,r=t.indexOf(" "+e+"=");if(-1==r&&(r=t.indexOf(e+"=")),-1==r)t=null;else{r=t.indexOf("=",r)+1;var n=t.indexOf(";",r);-1==n&&(n=t.length),t=unescape(t.substring(r,n))}return t}
function getRandomArrayElements(e,t){for(var r,n=[],i=e.slice(0),o=0;t>o;++o)r=Math.floor(Math.random()*i.length),n.push(i[r]),i[r]=i.pop();return n}
function convertTime(e){e=e.replace("/Date(","").replace(")/","");var t=new Date(parseFloat(e)),r=[t.getDate(),t.getMonth()+1,t.getFullYear()],n=[t.getHours(),curr_m=t.getMinutes(),curr_s=t.getSeconds()];return r.join("-")+" "+n.join(":")}
function getInternetExplorerVersion(){var e=-1;if("Microsoft Internet Explorer"==navigator.appName){var t=navigator.userAgent,r=new RegExp("MSIE ([0-9]{1,}[.0-9]{0,})");null!=r.exec(t)&&(e=parseFloat(RegExp.$1))}else if("Netscape"==navigator.appName){var t=navigator.userAgent,r=new RegExp("Trident/.*rv:([0-9]{1,}[.0-9]{0,})");null!=r.exec(t)&&(e=parseFloat(RegExp.$1))}return e}
function arrayShuffle(e){for(var t,r,n=e.length;0!==n;)r=Math.floor(Math.random()*n),n-=1,t=e[n],e[n]=e[r],e[r]=t;return e}
var keyStr="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
var validation = {
    isEmailAddress:function(str) {
        var pattern =/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return pattern.test(str);  // returns a boolean
    },
    isNotEmpty:function (str) {
        var pattern =/\S+/;
        return pattern.test(str);  // returns a boolean
    },
    isNumber:function(str) {
        var pattern = /^\d+$/;
        return pattern.test(str);  // returns a boolean
    },
    isSame:function(str1,str2){
        return str1 === str2;
    },
    isNotSpecial: function(e){
        var t=/^[a-zA-Z0-9]+$/;
        return!!t.test(e)
    },
    isPhonenumber: function(e){
        var t=/(\(?(\d|(\d[- ]\d))\)?[-. ]?)?(\d\.?\d\.?\d.?\d.?\d.?\d.?\d.?\d.?\d.?\d)/;
        return!(""==e||!t.test(e))
    }
};  

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
String.prototype.replaceAll=function(e,t){var r=this;return r.replace(new RegExp(e.replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&"),"g"),t)},
Array.prototype.getRandom=function(e,t){var r=t?this:this.slice(0);return r.sort(function(){return.5-Math.random()}),r.splice(0,e)},
Number.prototype.format=function(e,t,r,n){var i="\\d(?=(\\d{"+(t||3)+"})+"+(e>0?"\\D":"$")+")",o=this.toFixed(Math.max(0,~~e));return(n?o.replace(".",n):o).replace(new RegExp(i,"g"),"$&"+(r||","))},
!function(e){var t=/iPhone/i,r=/iPod/i,n=/iPad/i,i=/(?=.*\bAndroid\b)(?=.*\bMobile\b)/i,o=/Android/i,a=/IEMobile/i,d=/(?=.*\bWindows\b)(?=.*\bARM\b)/i,c=/BlackBerry/i,l=/BB10/i,s=/Opera Mini/i,u=/(?=.*\bFirefox\b)(?=.*\bMobile\b)/i,p=new RegExp("(?:Nexus 7|BNTV250|Kindle Fire|Silk|GT-P1000)","i"),h=function(e,t){return e.test(t)},f=function(e){var f=e||navigator.userAgent;return this.apple={phone:h(t,f),ipod:h(r,f),tablet:h(n,f),device:h(t,f)||h(r,f)||h(n,f)},this.android={phone:h(i,f),tablet:!h(i,f)&&h(o,f),device:h(i,f)||h(o,f)},this.windows={phone:h(a,f),tablet:h(d,f),device:h(a,f)||h(d,f)},this.other={blackberry:h(c,f),blackberry10:h(l,f),opera:h(s,f),firefox:h(u,f),device:h(c,f)||h(l,f)||h(s,f)||h(u,f)},this.seven_inch=h(p,f),this.any=this.apple.device||this.android.device||this.windows.device||this.other.device||this.seven_inch,this.phone=this.apple.phone||this.android.phone||this.windows.phone,this.tablet=this.apple.tablet||this.android.tablet||this.windows.tablet,"undefined"==typeof window?this:void 0},g=function(){var e=new f;return e.Class=f,e};"undefined"!=typeof module&&module.exports&&"undefined"==typeof window?module.exports=f:"undefined"!=typeof module&&module.exports&&"undefined"!=typeof window?module.exports=g():"function"==typeof define&&define.amd?define("isMobile",[],e.isMobile=g()):e.isMobile=g()}(this);
jQuery.uaMatch=function(a){a=a.toLowerCase();var b=/(chrome)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||/(trident)[\/]([\w.]+)/.exec(a)||a.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||[];return{browser:b[1]||"",version:b[2]||"0"}},matched=jQuery.uaMatch(navigator.userAgent),browser={},matched.browser&&(browser[matched.browser]=!0,browser.version=matched.version),browser.chrome?browser.webkit=!0:browser.webkit&&(browser.safari=!0),jQuery.browser=browser;
function getRandomInt(min, max) {return Math.floor(Math.random() * (max - min + 1)) + min;}
function storageAvailable(type) {try {var storage = window[type],x = '__storage_test__';storage.setItem(x, x);storage.removeItem(x);return true;}catch(e) {return false;}};
var $viewport=0, windowWidth,windowHeight;
;jQuery(function($){
    $(document).ready(function(){
        if($.browser.msie){
            if(parseInt($.browser.version)>=10){
                $('html').addClass('ie10');
            }else if(parseInt($.browser.version)==9){
                $('html').addClass('ie9');
            }else if(parseInt($.browser.version)<=8){
                $('html').addClass('ie8');
            }
        }else if ($.browser.trident){
            var i = 'ie'+getInternetExplorerVersion();
            $('html').addClass(i);
        }
        if($.browser.safari)$('html').addClass('safari');
        if($.browser.chrome)$('html').addClass('chrome');
        if(isMobile.phone){
            $('html').addClass('mode-phone');
            if(isMobile.apple.device){
                $('html').addClass('mode-iOS');
                if(isMobile.apple.phone){
                    $('html').addClass('mode-iPhone');
                }
            }
            if(isMobile.android.device){
                $('html').addClass('mode-Android');
            }
        }else if(isMobile.tablet) {
            $('html').addClass('mode-tablet');
            if(isMobile.apple.tablet){
                $('html').addClass('mode-iPad');
            }
            if(isMobile.android.device){
                $('html').addClass('mode-Android');
            }
        }else {
            $('html').addClass('mode-desktop');
        }

        WebFontConfig = {
            google: {families: ['Roboto:300,400,500,600,700','Material Icons:400']}
        };
        (function() {
            var wf = document.createElement('script');
            wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
              '://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js';
            wf.type = 'text/javascript';
            wf.async = 'true';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(wf, s);
        })();

        function getDocHeight() {
            var D = document;
            return Math.max(
                D.body.scrollHeight, D.documentElement.scrollHeight,
                D.body.offsetHeight, D.documentElement.offsetHeight,
                D.body.clientHeight, D.documentElement.clientHeight
            );
        }
        windowWidth = $(window).width();
        windowHeight = $(window).height();
        
    });

    $(window).load(function() {
        var m = $('#main'),
        h = $('#header'),
        f = $('#footer');

        m.css('height',$(window).height()-h.outerHeight()-f.outerHeight());
        $('#stage').css('height',m.height()-$('.toolbar-wrapper').outerHeight());
    });
    var resizeMainWindow = function(e){
        var windowWidthNew = $(window).width();
        var windowHeightNew = $(window).height();
        if(windowWidth != windowWidthNew || windowHeight != windowHeightNew){
            windowWidth = windowWidthNew;
            windowHeight = windowHeightNew;
            var m = $('#main'),
            h = $('#header'),
            f = $('#footer');

            m.css('height',$(window).height()-h.outerHeight()-f.outerHeight());
            $('#stage').css('height',m.height()-$('.toolbar-wrapper').outerHeight());   
        }
    };
    $(window).bind('resize', resizeMainWindow);
});
function getNodeIndex(node) {
    var index = 0;
    while ( (node = node.previousSibling) ) {
        if (node.nodeType != 3 || !/^\s*$/.test(node.data)) {
            index++;
        }
    }
    return index;
}
