!function(){function e(e){var t=document.createElement("a");return t.href=e,t}function t(e){for(var t=document.getElementsByClassName(e),a=0;a<t.length;a++)t[a].style.display="none"}function a(){var e;if(-1!=location.hostname.indexOf("shazam.com")){if("/"==location.pathname||3==location.pathname.length)t("getshazam"),t("shazamoffers"),t("get-verified"),t("get-verified-btn");else if(g){var n=document.getElementsByClassName("shz-frame-money");for(e=0;e<n.length;e++){var o=n[e];o.className.indexOf("added-fb-like")<0&&(o.className+=" added-fb-like",o.style.textAlign="center",o.innerHTML='<iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fymusic.android%2F&tabs&width=340&height=214&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=1526211714125837" width="340" height="214" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>')}}else t("shz-frame-money");var s=document.getElementsByTagName("footer");for(e=0;e<s.length;e++){var r=s[e];r.className.indexOf("footerstatic")>=0&&(r.style.display="none")}}setTimeout(a,1e3)}function n(e){for(var t=0;t<e.length;t++){var a=e[t].track;a&&r(a)}}function o(e){for(var t=0;t<e.chart.length;t++)r(e.chart[t])}function s(e){var t=e.tags;if(t)for(var a=0;a<t.length;a++){var n=t[a].track;n&&r(n)}}function r(e){if("MUSIC"==e.type){var t={id:e.key,title:e.heading.title,subtitle:e.heading.subtitle,thumbnail:e.images.default};t.thumbnail||(t.thumbnail="https://images.shazam.com/coverart/t"+t.id+"_s400.jpg"),v.indexOf(t.id)<0&&(v.push(t.id),y.push(t),window.sessionStorage.setItem("track:"+t.id,JSON.stringify(t)),b||(b=!0,console.log("Mark track in page invalidate")))}}function i(e){var t=0;if(e){for(;t<y.length&&y[t].id!=e;t++);t>=y.length&&(t=-1)}if(t<0){var a=window.sessionStorage.getItem("track:"+e);a&&(y.unshift(JSON.parse(a)),v.push(e),t=0)}if(console.log("track: "+e+" index = "+t),!(t<0||0===y.length)){var n={};n.position=t,n.tracks=y,console.log("doPlayShazam:"+JSON.stringify(n))}}function l(e){console.log("doPlayYouTube:"+e)}function c(e,t,a){var n=new RegExp("(\\s|^)"+t+"(\\s|$)");e.className=e.className.replace(n," "+a+" ")}function h(e,t){return new RegExp("(\\s|^)"+t+"(\\s|$)").test(e.className)}function u(e,t){return function(a){i(e),t&&a.stopPropagation()}}function d(e,t){return function(a){l(e),t&&a.stopPropagation()}}function f(e){var t=/\/ux\/youtube\/([a-zA-Z0-9-_]{11})/g,a=t.exec(e);return a?a[1]:(t=/(\?|&)v=([a-zA-Z0-9-_]{11})(&|$)/g,(a=t.exec(e))?a[2]:(t=/youtu\.be\/([a-zA-Z0-9-_]{11})/g,a=t.exec(e),a?a[1]:void 0))}function p(e,t,a){for(var n=document.getElementsByTagName(e),o=[],s=0;s<n.length;s++){var r=n[s];r.getAttribute(t)==a&&o.push(r)}return o}function m(){for(var e=document.getElementsByClassName("audio-play"),t=0;t<e.length;t++){var a=e[t],n=a.getAttribute("data-track-id");(n||(n=a.parentNode.getAttribute("data-track-id")))&&(c(a,"audio-play","audio-play-overrided"),"A"==a.tagName.toUpperCase()?a.href="#play_shazam_"+n:a.addEventListener("click",u(n,!0),!0))}var o=p("a","data-shz-cmd","play");for(t=0;t<o.length;t++){var s=o[t];s.attributes.removeNamedItem("data-shz-cmd"),"A"==s.tagName.toUpperCase()?s.href="#play_shazam_0":h(s,"set-onclick")||(s.className+=" set-onclick",s.addEventListener("click",u(null,!0),!0))}var r=document.getElementsByClassName("popup-btn");for(t=0;t<r.length;t++){var i=r[t];if(i.hasAttribute("data-href")){var l=f(i.getAttribute("data-href"));l&&(c(i,"popup-btn",""),c(i,"popup-takeover",""),i.attributes.removeNamedItem("data-href"),"A"==i.tagName.toUpperCase()?i.href="#play_youtube_"+l:i.addEventListener("click",d(l,!0),!0))}}b=b&&0===e.length,setTimeout(m,b?50:500)}var g=Math.random()>.7;console.log("Show YMusic page: "+g),a(),console.log("script ===============");var v=[],y=[],b=!0;!function(t){XMLHttpRequest.prototype.send=function(a){var i=this.onreadystatechange;this.onreadystatechange=function(){if(i&&i(),4==this.readyState&&200==this.status){var t=/\/artisttoptracks_\d+$/g,a=/\/track\/\d+$/g,l=/\/tracks\/\w+chart\w+$/g,c=/\/tracks\/recommendations_\d+$/g,h=/\/artistfollow\.json$/g,u=/\/tag\/([A-Z0-9a-z]+-?)+$/g,d=e(this.responseURL);t.test(d.pathname)||l.test(d.pathname)||c.test(d.pathname)?o(JSON.parse(this.responseText)):a.test(d.pathname)?(r(JSON.parse(this.responseText)),console.log(this.responseText)):h.test(d.pathname)?n(JSON.parse(this.responseText)):u.test(d.pathname)&&s(JSON.parse(this.responseText))}},t.call(this,a)}}(XMLHttpRequest.prototype.send),m(),function(t){var a=t.pushState;t.pushState=function(t,n,o){var s=e(o);if(0==s.hash.indexOf("#play_shazam_")){var r=s.hash.substring(13);return"0"==r&&(r=null),console.log("#play_shazam - track ID: "+r),void i(r)}if(0==s.hash.indexOf("#play_youtube_")){var c=s.hash.substring(14);return console.log("#play_youtube - video ID: "+c),void l(c)}console.log(o),window.location.href=o,a(t,n,o)}}(window.history)}();