<template>
    <div id="app">
        <div class="main-container">
            <Search ref="search"></Search>
            <Lrc></Lrc>
        </div>
        <Player ref="player"></Player>
        <a href="https://github.com/xcr1234/musicbox" target="_blank"><img style="position: fixed; top: 0; right: 0; border: 0;" src="./../static/img/fork.png"></a>
    </div>
</template>

<script>

    import Vue from 'vue';
    import Search from './components/Search';
    import Lrc from './components/Lrc';
    import Player from './components/Player';

    import "native-toast/dist/native-toast.css";

    window.bus = new Vue(); //在window上维护一个bus（总线），用于传递自定义消息。

    export default{
        name:'App',
        components: { Search,Lrc,Player },
        mounted:function () {
            function setSize() {
                var height = parseFloat($(window).height());
                $(".main-container").height(height - 75);
            }

            //动态设定main-container的高度
            setSize();
            $(window).resize(setSize);



        }
    }
</script>



<style scoped>
    @import "./../static/css/pure.css";
    @import './../static/css/player.css';
    @import './../static/css/main.css';
</style>