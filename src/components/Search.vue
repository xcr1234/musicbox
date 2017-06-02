<!-- 左边的搜索面板 -->

<template>
    <div class="left-container">
        <div class="top-bar">
            <div class="searcher">
                <div class="searcher-container">
                    <input type="text" id="searchText" class="searcher-input" placeholder="输入歌曲、歌手、专辑名" v-on:keyup="keyup">
                </div>
                <span class="searcher-btn" v-on:click="searchBtn"></span>
            </div>
            <div class="top-key">
                <ul class="keys">
                    <li v-for="key in keys">
                        <a href="javascript:void(0);" v-on:click="search(key)">{{key}}</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="table">
        <table class="main-table">
            <thead>
            <tr>
                <th style="width: 23%" class="c0">歌手</th>
                <th style="width: 23%" class="c1">歌曲</th>
                <th style="width: 23%" class="c2">专辑</th>
                <th style="width: 18%" class="c3"></th>
                <th style="width: 13%" class="c4"></th>
            </tr>
            </thead>
            <tbody id="musics">
            <tr class="music-row" v-for="(song,index) in songs"  v-on:click="play(song,index)">
                <td><a href="javascript:;" class="key" v-on:click.stop="search(song.singername)">{{song.singername}}</a></td>
                <td><a href="javascript:;" class="key"  v-on:click.stop="search(song.songname)">{{song.songname}}</a></td>
                <td><a href="javascript:;" class="key"   v-on:click.stop="search(song.albumname)">{{song.albumname}}</a></td>
                <td></td>
                <td><a v-bind:href="song.m4a" v-on:click.stop target="_blank" class="download-btn" hideFocus="true"  title="下载"></a></td>
            </tr>
            </tbody>
        </table>
        </div>
        <div class="page">
            <div class="counter"></div>
            <button class="paginate left"><i></i><i></i></button>
            <button class="paginate right"><i></i><i></i></button>
        </div>
    </div>
</template>

<script>


    import page from './../../static/js/page';
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


    //min ≤ r < max
    function RandomNum(Min, Max) {
        var Range = Max - Min;
        var Rand = Math.random();
        return Min + Math.floor(Rand * Range);
    }

    //随机播放的策略
    function randomPlay(index,size) {
        if(size == 1){
            return index;
        }
        if(size == 2){
            return index == 0 ? 1 : 0;
        }
        var rand = RandomNum(0,size);
        if(rand == index){
            return index == 0 ? 1 : index - 1;
        }
        return rand;
    }

    //单曲循环
    function singlePlay(index,size) {
        return index;
    }

    //顺序播放
    function linePlay(index,size) {
        return index == size - 1 ? 0 : index + 1;
    }

    export default{
        name:"Search",
        data:function () {
            return {
                keys:["薛之谦","林忆莲","李宗盛","五月天","梁静茹","莫文蔚","陈梓童","刚好遇见你","周杰伦","张杰","漂洋过海来看你","三生三世","女儿情"],
                songs:[],
                index : 0 ,  //当前播放的是列表中的第一个
                playMod : linePlay //播放策略，默认为顺序播放
            }
        },
        methods:{
            search:function (key) {
                var $this = this;
                this.key = key;

                api.search(key,function (list,total) {
                    $this.songs = list;
                    page.setIndex(0);
                    page.setTotal(total);
                    page.validate();
                });
            },
            play:function (song,index) {
                this.index = index;
                window.bus.$emit("playMusic",song);
            },
            keyup:function (evt) {
                var val = $("#searchText").val();
                if(evt.keyCode == 13 && val != ''){
                    this.search(val);
                }
            },
            searchBtn:function (str) {
                var val = $("#searchText").val();
                if(val != ''){
                    this.search(val);
                }
            }
        },
        mounted:function () {

            var $this = this;

            this.search('命运石之门');

            window.bus.$on('page',function (index) {
                api.search($this.key,function (list,total) {
                    $this.songs = list;
                    page.setTotal(total);
                    page.validate();
                },index);
            });
            window.bus.$on("prevPlay",function () {
                if($this.index > 0){
                    $this.index--;
                    window.bus.$emit("playMusic",$this.songs[$this.index]);
                }
            });
            window.bus.$on("nextPlay",function () {
                if($this.index < $this.songs.length - 1){
                    $this.index++;
                    window.bus.$emit("playMusic",$this.songs[$this.index]);
                }
            });
            window.bus.$on("playNext",function () {
                var nextIndex = $this.playMod($this.index,$this.songs.length);
                window.bus.$emit("playMusic",$this.songs[nextIndex]);
            });
            window.bus.$on("randomMode",function () {
                info("随机循环模式");
                $this.playMod = randomPlay;
            });
            window.bus.$on("singleMode",function () {
                info("单曲循环模式");
                $this.playMod = singlePlay;
            });
            window.bus.$on("loopMode",function () {
                info("顺序播放模式");
                $this.playMod = linePlay;
            });
        }
    }

</script>