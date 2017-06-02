<!--音乐播放器组件-->
<template>
    <div class="panel">
        <audio ref="audio" v-on:ended="playNext" v-on:error="playNext" autoplay="autoplay" v-on:durationchange="onDuration" v-on:timeupdate="onTime"></audio>
        <div class="left-panel">
            <ul class="play-btn">
                <li class="prev">
                    <a class="prev-button wg-button" hidefocus="true" title="上一首[←]" v-on:click="prev"></a>
                </li>
                <li class="play wg-button stop">
                    <a v-bind:class="playClass" id="playBtn" hidefocus="true" v-bind:title="playTitle" v-on:click="playPause"></a>
                </li>
                <li class="next">
                    <a class="next-button wg-button" hidefocus="true" title="下一首[→]" v-on:click="next"></a>
                </li>
            </ul>
        </div>
        <div class="right-panel">
            <ul class="playmod">
                <li class="random-mode">
                    <a href="javascript:;" hidefocus="true" title="随机播放" class="wg-button" v-on:click="randomMode"></a>
                </li>
                <li class="single-mode">
                    <a hidefocus="true" title="单曲播放" class="wg-button" href="javascript:;" v-on:click="singleMode"></a>
                </li>
                <li class="list-mode">
                    <a hidefocus="true" title="循环播放" class="wg-button" href="javascript:;" v-on:click="loopMode"></a>
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

    import './../../static/js/drag';
    import api from './../util/api';
    import nativeToast from 'native-toast';

    function info(message) {
        nativeToast({
            message:message,
            position : "bottom",
            timeout: 3000,
            type: "info"
        });
    }




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
                tip : true
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

                if(this.tip && Math.floor(this.duration - this.current) <= 5){
                    this.tip = false;
                    info("播放即将结束，切换下一首。")
                }



            },
            onDrag: function(percent) {
                var audio = this.$refs.audio;
                var time = percent * audio.duration;
                audio.currentTime = time;
                if(audio.paused) {
                    audio.play();
                }
                this.tip = true;
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
            },
            playNext:function () {
                window.bus.$emit('playNext');
            },
            randomMode:function () {
                window.bus.$emit('randomMode');
            },
            singleMode:function () {
                window.bus.$emit('singleMode');
            },
            loopMode:function () {
                window.bus.$emit('loopMode');
            },
            prev:function () {
                window.bus.$emit('prevPlay');
            },
            next:function () {
                window.bus.$emit('nextPlay');
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
                that.$refs.audio.src = song.m4a;

                that.tip = true;

                api.lyric(song.songid,function (lyric) {
                    window.bus.$emit("lyric",song,lyric);
                });

            });


        }
    }


</script>


