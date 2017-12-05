(function() {
    function hideElementByClassName(className) {
        var elements = document.getElementsByClassName(className);
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = "none";
        }
    }
    function checkAndHideElement() {
        if (location.hostname.endsWith("shazam.com")) {
            if (location.pathname == "/") {
                hideElementByClassName("getshazam");
                hideElementByClassName("shazamoffers");
                hideElementByClassName("get-verified");
                hideElementByClassName("get-verified-btn");
            } else {
                hideElementByClassName("shz-frame-money");
            }
        }
        setTimeout(checkAndHideElement, 1000);
    }
    checkAndHideElement();
    
    function parseUri(href) {
        var l = document.createElement("a");
        l.href = href;
        return l;
    }
    console.log("script ===============");
    var trackIdSet = new Set();
    var trackInPage = [];
    var trackInPageInvalidate = true;
    var regexAristTopTract = /\/artisttoptracks_\d+$/g;
    var regexTrackData = /\/track\/\d+$/g;
    var regexChart = /\/tracks\/\w+chart\w+$/g;
    var regexRecommendation = /\/tracks\/recommendations_\d+$/g;
    
    function parseChart(data) {
        for (let index = 0; index < data.chart.length; index++) {
            const trackData = data.chart[index];
            parseTrack(trackData);
        }
    }
    
    function parseTrack(data) {
        if (data.type != "MUSIC") return;
        let track = {
            id: data.key,
            title: data.heading.title,
            subtitle: data.heading.subtitle,
            thumbnail: data.images.default
        };
        if (!trackIdSet.has(track.id)) {
            trackIdSet.add(track.id);
            trackInPage.push(track);  
            if (!trackInPageInvalidate) {
                trackInPageInvalidate = true;
                console.log("Mark track in page invalidate");
            }
        }
    }
    
    (function(send) {
        XMLHttpRequest.prototype.send = function(data) {
            let originCallback = this.onreadystatechange;
            this.onreadystatechange = function() {
                if (originCallback) {
                    originCallback();
                }
                if(this.readyState == 4 && this.status == 200) {
                    let uri = parseUri(this.responseURL);
                    if (regexAristTopTract.test(uri.pathname) || 
                            regexChart.test(uri.pathname) || 
                            regexRecommendation.test(uri.pathname)) {
                        parseChart(JSON.parse(this.responseText));
                    } else if (regexTrackData.test(uri.pathname)) {
                        parseTrack(JSON.parse(this.responseText));
                    }
                }
            };
            send.call(this, data);
        };
    })(XMLHttpRequest.prototype.send);
    
    // override play event
    function onPlayShazam(trackId = undefined) {
        let index = 0;
        if (trackId) {
            index = trackInPage.findIndex(track => track.id == trackId);
        }
        if (index < 0 || trackInPage.length === 0) {
            return;
        }
        let eventPayload = {
            position: index,
            tracks: trackInPage
        };
        console.log("doPlayShazam:" + JSON.stringify(eventPayload));
    }

    function onPlayYoutubeVideo(dataHref) {
        const regex = /\/ux\/youtube\/([a-zA-Z0-9-_]{11})/g;
        let m = regex.exec(dataHref);
        if (m) {
            let videoId = m[1];
            console.log("doPlayYouTube:" + videoId);
        }
    }
    
    function replaceClass(e,className, newClass) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        e.className = e.className.replace(reg, ' ' + newClass + ' ');
    }
    
    function hasClass(e, className) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        return reg.test(e.className);
    }
    
    function makeShazamEventClick(trackId) {
        return function(e) {
            onPlayShazam(trackId);
        };
    }

    function makeYouTubeEventClick(dataHref) {
        return function(e) {
            onPlayYoutubeVideo(dataHref);
        };
    }

    function findElementByAttr(tag, attribute, attributeValue) {
        const elements = document.getElementsByTagName(tag);
        const result = [];
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.getAttribute(attribute) == attributeValue) {
                result.push(element);
            }
        }
        return result;
    }

    function overrideAudioPlay() {
        let audioPlayElements = document.getElementsByClassName("audio-play");
        for (let i = 0; i < audioPlayElements.length; i++) {
            const audioPlayElement = audioPlayElements[i];
            const trackId = audioPlayElement.getAttribute('data-track-id');
            if (!hasClass(audioPlayElement, "audio-play-overrided")) {
                replaceClass(audioPlayElement, "audio-play", "audio-play-overrided");
                audioPlayElement.addEventListener("click", makeShazamEventClick(trackId));
            }
            if (audioPlayElement.tagName.toUpperCase() == "A") {
                audioPlayElement.href = "#";
            }
        }
        let playElements = findElementByAttr("a", "data-shz-cmd", "play");
        for (let i = 0; i < playElements.length; i++) {
            const playElement = playElements[i];
            playElement.attributes.removeNamedItem("data-shz-cmd");
            if (!hasClass(playElement, "set-onclick")) {
                playElement.className += " set-onclick";
                playElement.addEventListener('pointerdown', makeShazamEventClick(null));
            }
        }
        let popupElements = document.getElementsByClassName("popup-btn");
        for (let i = 0; i < popupElements.length; i++) {
            const popupElement = popupElements[i];
            if (!popupElement.hasAttribute("data-href")) {
                continue;
            }
            replaceClass(popupElement, "popup-btn", '');
            replaceClass(popupElement, "popup-takeover", '');
            const dataHref = popupElement.getAttribute("data-href");
            popupElement.attributes.removeNamedItem("data-href");
            popupElement.addEventListener("pointerdown", makeYouTubeEventClick(dataHref));
        }

        trackInPageInvalidate &= audioPlayElements.length === 0;
        console.log(trackInPageInvalidate);
        setTimeout(overrideAudioPlay, trackInPageInvalidate ? 50 : 500);
    }
    
    overrideAudioPlay();
})();