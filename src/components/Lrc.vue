<!--右边显示歌词的面板-->

<template>
    <div class="right-container">
        <div class="header">
            <img v-bind:src="album" class="album">
            <a class="album-name">{{name}}</a>
        </div>
        <div class="album-split"></div>
        <div class="lrc-container">
            <div class="lrc" style="margin-top: 80px">
            </div>
        </div>

    </div>
</template>

<script>

    import lrc from './../../static/js/lrc';

    export default{
        name:'Lrc',
        data:function () {
            return{
                name:"《初学者》",
                album:"static/img/mt1.jpg"
            }
        },
        mounted:function () {

            window.lrcCtrl.active = function(p) {
                $(p).addClass("active");
            };
            window.lrcCtrl.normal = function(p) {
                $(p).removeClass("active");
            };

            var initMargin = $(".lrc").css("margin-top");
            var that = this;
            var audio = that.$parent.$refs.player.$refs.audio;
            window.bus.$on("lyric",function (song,lryic) {
                if(song.albumname){
                    that.name = song.albumname;
                }else{
                    that.name = "";
                }
                if(song.albumpic_small){
                    that.album = song.albumpic_small;
                }else{
                    that.album = "static/img/mt1.jpg";
                }
                handleLrc(audio,lryic,initMargin);
            });
        }
    }

    function handleLrc(audio, lrc, margin){
        var $lrc = $(".lrc").empty().css("margin-top", margin);
        var obj = window.loadLrc($lrc[0], function() {
            return lrc;
        });
        obj.fix = 38;
        window.activeAudio(audio, obj);
    }

</script>