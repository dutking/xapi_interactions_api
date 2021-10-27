export class YTVideo extends HTMLElement {
    constructor() {
        super();
    }

    init(placeholder, interaction, db, stateData = {}) {
        this.placeholder = placeholder;
        this.parentId = config.id;
        this.data = interaction;
        this.player;
        this.viewId = ADL.ruuid();
        this.ranges = [];
        this.score = 0;

        this.playerStates = {
            prev: {
                state: -1,
                time: 0,
            },
            current: {
                state: -1,
                time: 0,
            },
        };
        this.state = stateData;
        this.completed = false;
        this.passed = false;
        this.lastPlayDuration = 0;
        this.vidData = {};

        this.divId = this.data.id
            .split('/')
            .filter((str) => str.includes('ytvideo'))[0];

        this.innerHTML = `<div id="${this.divId}" data-vid="${this.data.videoId}"></div>`;

        if ('completed' in this.state) {
            this.passed = this.state.passed;
            this.completed = this.state.completed;
        }

        this.placeholder.append(this);
    }

    setPlayer() {
        this.player = new YT.Player(`${this.divId}`, {
            height: '480',
            width: '854',
            videoId: this.data.videoId,
            playerVars: {
                autoplay: '0',
                disablekb: '1',
                // origin: 'https://cloud.scorm.com'
            },
            events: {
                onReady: this.onPlayerReady,
                onStateChange: this.onPlayerStateChange,
                onPlaybackRateChange: this.onPlayerPlaybackRateChange,
            },
        });
    }

    setState() {
        let date = new Date();
        this.state.id = this.data.id;
        this.state.completed = this.completed;
        this.state.passed = this.passed;
        this.state.result = this.result;

        if (this.state?.date) {
            this.state.date.push(date);
        } else {
            this.state.date = [date];
        }

        this.emitEvent('state_changed');
    }

    get calculatedRanges(){
        const sorting = (a,b) => {
            if(a[0] < b[0]){
                return -1
            }
        
            if(a[0] > b[0]) {
                return 1
            }
        
            if(a[0] === b[0]){
                if(a[1] > b[1]) {
                    return -1
                }
        
                if(a[1] < b[1]) {
                    return 1
                }
            }
        
            return 0
        }

        const calculateRanges = (arr, startingIndex) => {
            let start = 0
            let end = 0
            let newArr = []
            let newIndex = 0
        
            if(startingIndex + 1 === arr.length){
                return arr
            }
        
            if(arr[startingIndex+1][0] >= arr[startingIndex][0] && arr[startingIndex+1][0] <= arr[startingIndex][1]){
                start = arr[startingIndex][0]
                if(arr[startingIndex][1] >= arr[startingIndex+1][1]) {
                    end = arr[startingIndex][1]
                }
                if(arr[startingIndex][1] < arr[startingIndex+1][1]) {
                    end = arr[startingIndex+1][1]
                }
                newArr = arr.slice(startingIndex + 2)
                newArr.unshift([start,end])
                newArr.unshift(...arr.slice(0, startingIndex))
                return calculateRanges(newArr, startingIndex)
            } else {
                return calculateRanges(arr, startingIndex+1)
            } 
        }

        let currentRanges = Array.from(this.ranges).sort(sorting)

        return calculateRanges(currentRanges, 0)
    }

    get viewedDuration(){
        return this.calculatedRanges.reduce((accum, item) => accum+(item[1] - item[0]), 0)
    }

    get passed(){
        return (this.viewedDuration >= this.player.getDuration - 5) || this.state?.passed
    }

    get result() {
        switch (this.data.required) {
            case 'passed':
                if (this.passed) {
                    return true;
                } else {
                    return false;
                }
                break;
            case 'completed':
                if (this.completed) {
                    return true;
                } else {
                    return false;
                }
                break;
            case 'none':
                return true;
                break;
            default:
                break;
        }
    }

    get maxScore() {
        return 1;
    }

    get weight() {
        return 1;
    }

    emitEvent(eventName) {
        let that = this;
        let event = new CustomEvent(eventName, {
            bubbles: true,
            composed: true,
            detail: {
                obj: that,
            },
        });
        console.log(`Event "${eventName}" was dispatched by ${this.data.id}`);
        this.dispatchEvent(event);
    }

    onPlayerReady(event) {
        let ytvideoUnit = event.target.getIframe().parentElement;
        // event.target.playVideo()
        ytvideoUnit.getVidData();
    }

    onPlayerPlaybackRateChange(event) {
        let ytvideoUnit = event.target.getIframe().parentElement;
        ytvideoUnit.getVidData();
        ytvideoUnit.emitEvent('interacted');
    }

    onPlayerStateChange(event) {
        let ytvideoUnit = event.target.getIframe().parentElement;
        if (event.data === 0 || event.data === 1 || event.data === 2) {
            ytvideoUnit.playerStates.prev.state =
                ytvideoUnit.playerStates.current.state;
            ytvideoUnit.playerStates.prev.time =
                ytvideoUnit.playerStates.current.time;
            ytvideoUnit.playerStates.current.state = event.data;
            ytvideoUnit.playerStates.current.time = Math.floor(
                event.target.getCurrentTime()
            );
            console.log(
                `Старое состояние: ${ytvideoUnit.playerStates.prev.state} / Старое время: ${ytvideoUnit.playerStates.prev.time} |`,
                `Новое состояние: ${ytvideoUnit.playerStates.current.state} / Новое вермя: ${ytvideoUnit.playerStates.current.time}`
            );
        }
        switch (event.data) {
            case -1:
                console.log(`${event.data} – воспроизведение не началось.`);
                break;
            case 0:
                console.log(`${event.data} – воспроизведение завершено.`);
                break;
            case 1:
                console.log(`${event.data} – воспроизведение.`);
                break;
            case 2:
                console.log(`${event.data} – пауза.`);
                break;
            case 3:
                console.log(`${event.data} – буферизация.`);
                break;
            case 5:
                console.log(`${event.data} – видео в очереди.`);
                break;
            default:
                break;
        }
        if (event.data === -1) {
            ytvideoUnit.getVidData();
            ytvideoUnit.emitEvent('interacted');
        } else if (event.data === 1) {
            if (ytvideoUnit.playerStates.prev.state === 0) {
                ytvideoUnit.viewId = ADL.ruuid();
                ytvideoUnit.ranges = [];
            }

            let otherVids = Array.from(
                document.querySelectorAll('ytvideo-unit')
            ).filter(
                (vid) =>
                    event.target.getVideoData().video_id !== vid.data.videoId
            );

            otherVids.forEach((vid) => {
                console.log('PAUSING OTHER VIDEOS');
                vid.player.pauseVideo();
            });

            ytvideoUnit.lastPlayDuration = 0;
            ytvideoUnit.timer = setInterval(function () {
                ytvideoUnit.lastPlayDuration += 1;
            }, 1000);
        } else if (event.data === 2) {
            let seeked = false;
            clearInterval(ytvideoUnit.timer);
            if (
                ytvideoUnit.playerStates.current.time !==
                ytvideoUnit.playerStates.prev.time
            ) {
                if (ytvideoUnit.playerStates.prev.state === 1) {
                    if (
                        Math.abs(
                            ytvideoUnit.playerStates.current.time -
                                (ytvideoUnit.playerStates.prev.time +
                                    ytvideoUnit.lastPlayDuration)
                        ) > 1
                    ) {
                        console.log('Video was seeked during playback!');
                        seeked = true;

                        ytvideoUnit.ranges.push([
                            ytvideoUnit.playerStates.prev.time,
                            ytvideoUnit.playerStates.prev.time +
                                ytvideoUnit.lastPlayDuration,
                        ]);
                    } else {
                        ytvideoUnit.ranges.push([
                            ytvideoUnit.playerStates.prev.time,
                            ytvideoUnit.playerStates.current.time,
                        ]);
                    }

                    if (ytvideoUnit.checkSeeked(ytvideoUnit.ranges)) {
                        ytvideoUnit.getVidData();
                        ytvideoUnit.emitEvent('seeked');
                    }

                    ytvideoUnit.getVidData();
                    ytvideoUnit.emitEvent('played');
                    if (!seeked) {
                        ytvideoUnit.getVidData();
                        ytvideoUnit.emitEvent('paused');
                    }
                }
            }
        } else if (event.data === 0) {
            clearInterval(ytvideoUnit.timer);
            if (ytvideoUnit.playerStates.prev.state === 1) {
                ytvideoUnit.ranges.push([
                    ytvideoUnit.playerStates.prev.time,
                    ytvideoUnit.playerStates.current.time,
                ]);

                if (ytvideoUnit.checkSeeked(ytvideoUnit.ranges)) {
                    ytvideoUnit.getVidData();
                    ytvideoUnit.emitEvent('seeked');
                }

                ytvideoUnit.getVidData();
                ytvideoUnit.emitEvent('played');
            }

            ytvideoUnit.passed = true;
            ytvideoUnit.completed = true;

            ytvideoUnit.getVidData();
            ytvideoUnit.setState();
            ytvideoUnit.emitEvent('completed');
            ytvideoUnit.emitEvent('passed');
        }
    }

    get isInViewport() {
        let bounding = this.getBoundingClientRect();
        return bounding.top - 50 <= window.innerHeight;
    }

    getVidData() {
        let vidData = {};

        vidData.vidId = this.data.videoId;
        vidData.viewId = this.viewId;
        vidData.vidName = this.player.getVideoData().title;
        vidData.duration = moment
            .duration(Math.floor(this.player.getDuration()), 'seconds')
            .toISOString();
        vidData.currentTime = this.formatNum(this.player.getCurrentTime());
        vidData.screenSize = `${this.player.getIframe().width}x${
            this.player.getIframe().height
        }`;
        vidData.quality = this.player.getVideoData().video_quality;
        vidData.volume = this.player.getVolume();
        vidData.width = this.player.getIframe().width;
        vidData.height = this.player.getIframe().height;
        vidData.speed = this.player.getPlaybackRate();
        vidData.focus = this.isInViewport;
        vidData.fullscreen =
            document.fullscreenElement !== null &&
            document.fullscreenElement.tagName &&
            document.fullscreenElement.tagName === 'IFRAME'
                ? true
                : false;
        vidData.ranges = this.formatRanges(this.ranges);
        vidData.resumed = this.getResumed(this.ranges);
        vidData.isSeeked = this.checkSeeked(this.ranges);
        if (vidData.isSeeked === true) {
            vidData.seekedData = this.getSeekedData(this.ranges);
        } else {
            vidData.seekedData = this.getSeekedData([
                [0, 0],
                [0, 0],
            ]);
        }

        this.vidData = vidData;
    }

    formatNum(num) {
        return moment.duration(Math.floor(num), 'seconds').toISOString();
    }

    formatRanges(arr) {
        let that = this;
        if (arr.length > 0) {
            return arr.map(function (item) {
                return item.map(function (num) {
                    return that.formatNum(num);
                });
            });
        } else {
            return arr;
        }
    }

    getResumed(arr) {
        if (arr.length > 0) {
            return this.formatNum(arr[arr.length - 1][0]);
        } else {
            return 'P0D';
        }
    }

    checkSeeked(arr) {
        if (arr.length > 1) {
            let difference = Math.abs(
                arr[arr.length - 1][0] - arr[arr.length - 2][1]
            );
            if (difference > 1) {
                return true;
            } else if (difference <= 1) {
                return false;
            }
        } else {
            return false;
        }
    }

    getSeekedData(arr) {
        return [
            this.formatNum(arr[arr.length - 2][1]),
            this.formatNum(arr[arr.length - 1][0]),
        ];
    }
}

window.customElements.define('ytvideo-unit', YTVideo);
