const appid = 36320;
const sign = "ab25b71f4a8a4aba8f58c68f3b50de9b";

import nativeToast from 'native-toast';

import cache from './lru';



function error(message) {
    nativeToast({
        message:message,
        position : "bottom",
        timeout: 3000,
        type: "error"
    });
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

export default {
    

    /**
     * 获取歌词
     * @param songid 歌曲的id
     * @param callback 回调函数，格式callback（歌词字符串）
     */
    lyric:function (songid,callback) {

        var cacheKey = "lyric-" + songid;

        if(cache.hasKey(cacheKey)){
            var lyric = cache.get(cacheKey);
            callback(lyric);
            return;
        }


        $.ajax({
            url : "//route.showapi.com/213-2",
            type:"POST",
            data:{
                showapi_appid:appid,
                showapi_sign : sign,
                musicid:songid
            },
            success:function (res) {
                if(res.showapi_res_code == 0){
                    if(res.showapi_res_body && res.showapi_res_body.lyric){
                        var lyric = HTMLDecode(res.showapi_res_body.lyric);
                        cache.put(cacheKey,lyric);
                        callback(lyric);
                    }
                }else{
                    console.error(res);
                    error(res.showapi_res_error);
                }
            },
            error:function (xhr,status,err) {

            }
        });

    },
    /**
     * api搜索
     * @param key 关键字
     * @param callback 回调函数 callback(list,total)，list的数据类型请参考https://www.showapi.com/api/lookPoint/213/2，total为总页码数
     * @param page 分页
     */
    search:function (key,callback,page) {

        var cacheKey = "search-" + key + "-" + page;

        if(cache.hasKey(cacheKey)){
            var res = cache.get(cacheKey);
            callback(res.showapi_res_body.pagebean.contentlist,res.showapi_res_body.pagebean.allPages);
            return;
        }


        $.ajax({
            url:"//route.showapi.com/213-1",
            type:"POST",
            data:{
                showapi_appid:appid,
                showapi_sign : sign,
                keyword : key,
                page : page ? page : 1
            },
            success:function (res) {
                if(res.showapi_res_code == 0){
                    cache.put(cacheKey,res);
                    callback(res.showapi_res_body.pagebean.contentlist,res.showapi_res_body.pagebean.allPages);
                }else{
                    console.error(res);
                    error(res.showapi_res_error);
                }
            },
            error:function () {
                error("接口不稳定，请稍候再试吧!");
            }
        });
    }
    
    
}



