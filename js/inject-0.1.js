(function () {
    function parseUri(href) {
        var l = document.createElement("a");
        l.href = href;
        return l;
    }

    function hideElementByClassName(className) {
        var elements = document.getElementsByClassName(className);
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.display = "none";
        }
    }

    const shouldShowFacebookPage = Math.random() > 0.8; // 20% 
    console.log('Show YMusic page: ' + shouldShowFacebookPage);

    function checkAndHideElement() {
        if (location.hostname.endsWith("shazam.com")) {
            if (location.pathname == "/") {
                hideElementByClassName("getshazam");
                hideElementByClassName("shazamoffers");
                hideElementByClassName("get-verified");
                hideElementByClassName("get-verified-btn");
            } else {
                if (shouldShowFacebookPage) {
                    var elements = document.getElementsByClassName("shz-frame-money");
                    for (let i = 0; i < elements.length; i++) {
                        const fbLikeContainer = elements[i];
                        if (fbLikeContainer.className.indexOf('added-fb-like') < 0) {
                            fbLikeContainer.className += ' added-fb-like';
                            fbLikeContainer.style.textAlign = 'center';
                            fbLikeContainer.innerHTML = `
                            <iframe src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fymusic.android%2F&tabs&width=340&height=214&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=1526211714125837" width="340" height="214" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true"></iframe>
                            `;
                        }
                    }
                } else {
                    hideElementByClassName('shz-frame-money');
                }
            }
        }
        setTimeout(checkAndHideElement, 1000);
    }

    checkAndHideElement();

    console.log("script ===============");
    var trackIdSet = new Set();
    var trackInPage = [];
    var trackInPageInvalidate = true;

    function parseArtistCarousel(data) {
        for (let index = 0; index < data.length; index++) {
            const trackData = data[index].track;
            if (trackData) parseTrack(trackData);
        }
    }

    function parseChart(data) {
        for (let index = 0; index < data.chart.length; index++) {
            const trackData = data.chart[index];
            parseTrack(trackData);
        }
    }

    function parseShazamAccountData(data) {
        let tags = data.tags;
        if (tags) {
            for (let i = 0; i < tags.length; i++) {
                const tag = tags[i];
                let trackData = tag.track;
                if (trackData) parseTrack(trackData);
            }
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
        if (!track.thumbnail) {
            track.thumbnail = 'https://images.shazam.com/coverart/t' + track.id + '_s400.jpg';
        }
        if (!trackIdSet.has(track.id)) {
            trackIdSet.add(track.id);
            trackInPage.push(track);
            window.sessionStorage.setItem('track:' + track.id, JSON.stringify(track));
            if (!trackInPageInvalidate) {
                trackInPageInvalidate = true;
                console.log("Mark track in page invalidate");
            }
        }
    }

    (function (send) {
        XMLHttpRequest.prototype.send = function (data) {
            let originCallback = this.onreadystatechange;
            this.onreadystatechange = function () {
                if (originCallback) {
                    originCallback();
                }
                if (this.readyState == 4 && this.status == 200) {
                    const regexAristTopTract = /\/artisttoptracks_\d+$/g;
                    const regexTrackData = /\/track\/\d+$/g;
                    const regexChart = /\/tracks\/\w+chart\w+$/g;
                    const regexRecommendation = /\/tracks\/recommendations_\d+$/g;
                    const regexArtistCarousel = /\/artistfollow\.json$/g;
                    const regexShazamAccount = /\/tag\/([A-Z0-9a-z]+-?)+$/g;

                    let uri = parseUri(this.responseURL);
                    if (regexAristTopTract.test(uri.pathname) ||
                        regexChart.test(uri.pathname) ||
                        regexRecommendation.test(uri.pathname)) {
                        parseChart(JSON.parse(this.responseText));
                    } else if (regexTrackData.test(uri.pathname)) {
                        parseTrack(JSON.parse(this.responseText));
                        console.log(this.responseText);
                    } else if (regexArtistCarousel.test(uri.pathname)) {
                        parseArtistCarousel(JSON.parse(this.responseText));
                    } else if (regexShazamAccount.test(uri.pathname)) {
                        parseShazamAccountData(JSON.parse(this.responseText));
                    }
                }
            };
            send.call(this, data);
        };
    })(XMLHttpRequest.prototype.send);

    function onPlayShazam(trackId = undefined) {
        let index = 0;
        if (trackId) {
            index = trackInPage.findIndex(track => track.id == trackId);
        }
        if (index < 0) {
            let trackInStorage = window.sessionStorage.getItem('track:' + trackId);
            if (trackInStorage) {
                trackInPage.unshift(JSON.parse(trackInStorage));
                trackIdSet.add(trackId);
                index = 0;
            }
        }
        console.log('track: ' + trackId + ' index = ' + index);
        if (index < 0 || trackInPage.length === 0) {
            return;
        }
        let eventPayload = {
            position: index,
            tracks: trackInPage
        };
        console.log("doPlayShazam:" + JSON.stringify(eventPayload));
    }

    function onPlayYoutubeVideo(videoId) {
        console.log("doPlayYouTube:" + videoId);
    }

    function replaceClass(e, className, newClass) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        e.className = e.className.replace(reg, ' ' + newClass + ' ');
    }

    function hasClass(e, className) {
        var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
        return reg.test(e.className);
    }

    function makeShazamEventClick(trackId, stopPropagation) {
        return function (e) {
            onPlayShazam(trackId);
            if (stopPropagation) {
                e.stopPropagation();
            }
        };
    }

    function makeYouTubeEventClick(videoId, stopPropagation) {
        return function (e) {
            onPlayYoutubeVideo(videoId);
            if (stopPropagation) {
                e.stopPropagation();
            }
        };
    }

    function findYouTubeVideoId(data) {
        let regex = /\/ux\/youtube\/([a-zA-Z0-9-_]{11})/g;
        let m = regex.exec(data);
        if (m) return m[1];

        regex = /(\?|&)v=([a-zA-Z0-9-_]{11})(&|$)/g;
        m = regex.exec(data);
        if (m) return m[2];

        regex = /youtu\.be\/([a-zA-Z0-9-_]{11})/g;
        m = regex.exec(data);
        if (m) return m[1];
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
        const audioPlayElements = document.getElementsByClassName("audio-play");
        for (let i = 0; i < audioPlayElements.length; i++) {
            let audioPlayElement = audioPlayElements[i];
            let trackId = audioPlayElement.getAttribute('data-track-id');
            if (!trackId) {
                // try find in parent node
                trackId = audioPlayElement.parentNode.getAttribute('data-track-id');
                if (!trackId) continue;
            }
            replaceClass(audioPlayElement, "audio-play", "audio-play-overrided");
            if (audioPlayElement.tagName.toUpperCase() == "A") {
                audioPlayElement.href = '#play_shazam_' + trackId;
            } else {
                audioPlayElement.addEventListener('click', makeShazamEventClick(trackId, true), true);
            }
        }

        let playElements = findElementByAttr("a", "data-shz-cmd", "play");
        for (let i = 0; i < playElements.length; i++) {
            const playElement = playElements[i];
            playElement.attributes.removeNamedItem("data-shz-cmd");
            if (playElement.tagName.toUpperCase() == "A") {
                playElement.href = "#play_shazam_0";
            } else if (!hasClass(playElement, "set-onclick")) {
                playElement.className += " set-onclick";
                playElement.addEventListener('click', makeShazamEventClick(null, true), true);
            }
        }

        const popupElements = document.getElementsByClassName("popup-btn");
        for (let i = 0; i < popupElements.length; i++) {
            const popupElement = popupElements[i];
            if (!popupElement.hasAttribute("data-href")) {
                continue;
            }
            const dataHref = popupElement.getAttribute("data-href");
            const videoId = findYouTubeVideoId(dataHref);
            if (!videoId) continue;

            replaceClass(popupElement, "popup-btn", '');
            replaceClass(popupElement, "popup-takeover", '');
            popupElement.attributes.removeNamedItem("data-href");

            if (popupElement.tagName.toUpperCase() == "A") {
                popupElement.href = "#play_youtube_" + videoId;
            } else {
                popupElement.addEventListener("click", makeYouTubeEventClick(videoId, true), true);
            }
        }

        trackInPageInvalidate &= audioPlayElements.length === 0;
        setTimeout(overrideAudioPlay, trackInPageInvalidate ? 50 : 500);
    }

    overrideAudioPlay();

    (function (history) {
        var pushState = history.pushState;
        history.pushState = function (state, title, url) {
            let uri = parseUri(url);
            if (uri.hash.startsWith('#play_shazam_')) {
                let trackId = uri.hash.substring(13);
                if (trackId == "0") {
                    trackId = null;
                }
                console.log("#play_shazam - track ID: " + trackId);
                onPlayShazam(trackId);
                return;
            } else if (uri.hash.startsWith('#play_youtube_')) {
                let videoId = uri.hash.substring(14);
                console.log("#play_youtube - video ID: " + videoId);
                onPlayYoutubeVideo(videoId);
                return;
            }
            console.log(url);
            window.location.href = url;
            pushState(state, title, url);
        };
    })(window.history);
})();