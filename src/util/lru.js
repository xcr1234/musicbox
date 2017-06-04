// LRU - 2Q算法的实现
//2Q算法的命中率要高于LRU。代价是FIFO和LRU的代价之和。时间复杂度应该是o（n）。

function LRUCache() {
    if(typeof arguments[0] == "number"){
        if(arguments[0] < 0){
            throw new Error("the capacity < 0 !");
        }
        this.capacity = arguments[0];
        this.length = 0;
        this.lru = [];
        this.fifo = [];
        this.data = {};
        return;
    }
    if(typeof arguments[0] == "object"){
        this.capacity = arguments[0].capacity;
        this.fifo = arguments[0].fifo;
        this.lru = arguments[0].lru;
        this.length = arguments[0].length;
        this.data = arguments[0].data;
        return;
    }
    throw new TypeError("illegal argument!");
}

//访问节点的操作
LRUCache.prototype.visit = function (key) {
    for(var i=0;i<this.fifo.length;i++){
        if(this.fifo[i] == key){
            //数据在FIFO队列中被再次访问，将数据移到LRU队列头部；
            this.fifo.splice(i,1);
            this.lru.unshift(key);
            return;
        }
    }
    for(var i=0;i<this.lru.length;i++){
        if(this.lru[i] == key){
            //数据在LRU队列再次被访问，则将数据移到LRU队列头部；
            this.lru.splice(i,1);
            this.lru.unshift(key);
            return;
        }
    }
    this.fifo.unshift(key);
};

//保证缓存中数据容量不会超过限制
LRUCache.prototype.trim = function () {
    if(this.length > this.capacity){
        if(this.fifo.length > 0){
            var key = this.fifo.pop();
            delete this.data[key];
            this.length --;
        }else if(this.lru.length > 0){
            var key = this.lru.pop();
            delete this.data[key];
            this.length --;
        }
    }
};

LRUCache.prototype.put = function (key,value) {
    this.visit(key);
    this.data[key] = value;
    this.length ++ ;
    this.trim();
};

LRUCache.prototype.get = function (key) {
    this.visit(key);
    return this.data[key];
};

LRUCache.prototype.hasKey = function (key) {
    return this.data.hasOwnProperty(key);
};

LRUCache.prototype.clear = function () {
    this.data = {};
    this.length = 0;
    this.fifo = [];
    this.lru = [];
};

var cache = new LRUCache(10);

export default{

    put:function (key,value) {
        if(typeof key != "string"){
            throw new TypeError("illegal key!");
        }
        if(typeof value == "undefined"){
            throw new TypeError("illegal value!");
        }
        cache.put(key,value);
    },
    get : function (key) {
        if(typeof key != "string"){
            throw new TypeError("illegal key!");
        }
        return cache.get(key);
    },
    hasKey:function (key) {
        if(typeof key != "string"){
            throw new TypeError("illegal key!");
        }
        return cache.hasKey(key);
    },
    length:function (key) {
        return cache.length;
    },
    LRU : LRUCache

}