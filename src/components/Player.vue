<!--音乐播放器组件-->
<template>
    <div class="panel">
        <audio ref="audio" v-bind:src="src" autoplay="autoplay" v-on:durationchange="onDuration" v-on:timeupdate="onTime"></audio>
        <div class="left-panel">
            <ul class="play-btn">
                <li class="prev">
                    <a class="prev-button wg-button" hidefocus="true" title="上一首[←]"></a>
                </li>
                <li class="play wg-button stop">
                    <a v-bind:class="playClass" id="playBtn" hidefocus="true" v-bind:title="playTitle" v-on:click="playPause"></a>
                </li>
                <li class="next">
                    <a class="next-button wg-button" hidefocus="true" title="上一首[←]"></a>
                </li>
            </ul>
        </div>
        <div class="right-panel">
            <ul class="playmod">
                <li class="random-mode">
                    <a href="javascript:;" hidefocus="true" title="随机播放" class="wg-button"></a>
                </li>
                <li class="single-mode">
                    <a hidefocus="true" title="单曲播放" class="wg-button" href="javascript:;"></a>
                </li>
                <li class="list-mode">
                    <a hidefocus="true" title="循环播放" class="wg-button" href="javascript:;"></a>
                </li>
            </ul>
            <div class="volume">
                <a  class="wg-button" v-bind:class="muteClass" id="volumeBtn" hidefocus="true" title="静音" href="javascript:;" v-on:click="mute"></a>
                <div class="vol-wrapper">
                    <div class="vol-slider">
                        <a href="javascript:;" hidefocus="true" class="vol-handler"></a>
                    </div>
                </div>
            </div>
            <div class="hq"></div>

        </div>
        <div class="main-panel">
            <div class="title-wrapper" id="playTitle">
                <div class="title-container">
                    <div class="title">
                        <marquee scrollamount="5" scrolldelay="100" direction="left" id="scroll" v-show=" songname != '' && singer != ''">
                            <span class="songname" href="javacript:;">{{ songname }}</span>
                            <span class="split" href="javacript:;">-</span>
                            <span class="singer" href="javacript:;">{{ singer }}</span>
                        </marquee>
                    </div>
                </div>
            </div>
            <div class="pane">
                <div class="time" id="timeWrap">
                    <span class="currentTime">{{ currentTime }}</span>
                    <span class="split">/</span>
                    <span class="totalTime">{{ totalTime }}</span>
                </div>
                <div class="progress-wrapper">
                    <div id="progressSlider">
                        <a href="javascript:;" hidefocus="true" class="pointer" id="progressToggler"></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    import drag from '../../static/js/drag';



    function padNumber(num, fill) {
        //改自：http://blog.csdn.net/aimingoo/article/details/4492592
        var len = ('' + num).length;
        return(Array(
            fill > len ? fill - len + 1 || 0 : 0
        ).join(0) + num);
    }

    function time2str(time) {
        var time = Math.floor(time);
        var min = Math.floor(time / 60);
        var second = time % 60;
        return min + ":" + padNumber(second, 2);
    }

    export default{
        name:'Player',
        data:function () {
            return{
                muteClass:'voice-button',
                playClass:'play-button',
                playTitle:'暂停[空格]',
                songname: '',
                singer: '',
                current: 0,
                duration: 0,
                src: ""
            };
        },
        computed:{
            totalTime:function () {
                return time2str(this.duration);
            },
            currentTime:function () {
                return time2str(this.current);
            }
        },
        methods:{
            onDuration: function(event) {
                this.duration = event.target.duration;
            },
            onTime: function(event) {
                var audio = event.target;
                var time = audio.currentTime;
                this.current = time;

                var percent = audio.currentTime / audio.duration;
                var $slider = $("#progressToggler");

                var mDown = $slider.data("mDown");
                if(!mDown) {
                    var $father = $slider.parent();
                    var left = $father.width() * percent;
                    $slider.css({
                        "left": left
                    });
                }
            },
            onDrag: function(percent) {
                var audio = this.$refs.audio;
                var time = percent * audio.duration;
                audio.currentTime = time;
                if(audio.paused) {
                    audio.play();
                }
            },
            onVolume:function(volume){
                var audio = this.$refs.audio;
                audio.volume = volume;
                if (audio.muted) {
                    audio.muted = false;
                    this.muteClass = 'voice-button';
                }
            },
            playPause:function(){
                var audio = this.$refs.audio;
                if(audio.src != ''){
                    if(audio.paused){
                        this.playClass = "play-button";
                        this.playTitle = "暂停[空格]";
                        audio.play();
                    }else{
                        this.playClass = "pause-button";
                        this.playTitle = "播放[空格]";
                        audio.pause();
                    }
                }
            },
            mute:function(){
                var audio = this.$refs.audio;
                if (audio.muted) {
                    audio.muted = false;
                    this.muteClass = 'voice-button';
                }else{
                    audio.muted = true;
                    this.muteClass = 'mute-button';
                }
            }
        },

        mounted: function() {
            var that = this;
            $("#progressToggler").dragging({
                move: "x",
                randomPosition: false
            }, function(percent) {
                that.onDrag(percent);
            });
            $(".vol-handler").dragging({
                move: "x",
                randomPosition: false
            }, function(percent) {
                that.onVolume(percent);
            });
            $(".vol-handler").css('left','75px');
            window.addEventListener('keyup',function(evt){
                if(evt.keyCode==32){
                    that.playPause();
                }
            });


            window.bus.$on('playMusic',function (song) {
                that.songname = song.songname;
                that.singer = song.singername;
                that.src = song.m4a;



                $.post("http://route.showapi.com/213-2",{
                    showapi_appid:global.appid,
                    showapi_sign:global.sign,
                    musicid:song.songid
                },function (res) {
                    if(res.showapi_res_code == 0){
                        var lyric = HTMLDecode(res.showapi_res_body.lyric);
                        console.log(lyric);
                        window.bus.$emit("lyric",song,lyric);
                    }else{
                        console.error(res.showapi_res_error);
                    }
                });

            });

        }
    }

    /**
     * @return {string}
     */
    function HTMLDecode(text)
    {
        var temp = document.createElement("div");
        temp.innerHTML = text;
        var output = temp.innerText || temp.textContent;
        temp = null;
        return output;
    }
</script>


