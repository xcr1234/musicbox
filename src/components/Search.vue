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
            <tr class="music-row" v-for="song in songs"  v-on:click="play(song)">
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

    export default{
        name:"Search",
        data:function () {
            return {
                keys:["薛之谦","林忆莲","李宗盛","五月天","梁静茹","莫文蔚","陈梓童","刚好遇见你","周杰伦","张杰","漂洋过海来看你","三生三世","女儿情"],
                songs:[]
            }
        },
        methods:{
            search:function (key) {
                var $this = this;
                this.key = key;
                $.post("//route.showapi.com/213-1",{
                    showapi_appid:global.appid,
                    showapi_sign:global.sign,
                    keyword : key
                },function (res) {
                    if(res.showapi_res_code == 0){
                        $this.songs  = res.showapi_res_body.pagebean.contentlist;
                        page.setIndex(0);
                        page.setTotal(res.showapi_res_body.pagebean.allPages);
                        page.validate();
                    }else{
                        console.error(res.showapi_res_error);
                    }
                });
            },
            play:function (song) {
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

            window.bus.$on('page',function (page) {
                $.post("//route.showapi.com/213-1",{
                    showapi_appid:global.appid,
                    showapi_sign:global.sign,
                    keyword : $this.key,
                    page : page
                },function (res) {
                    if(res.showapi_res_code == 0){
                        $this.songs  = res.showapi_res_body.pagebean.contentlist;
                        page.setIndex(0);
                        page.setTotal(res.showapi_res_body.pagebean.allPages);
                        page.validate();
                    }else{
                        console.error(res.showapi_res_error);
                    }
                });
            })
        }
    }

</script>