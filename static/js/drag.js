/*
 * jquery 拖动插件
 $("div").dragging({
 move: 'both', //拖动方向，x y both
 randomPosition: true, //初始位置是否随机
 hander: '.hander' //拖手，如果没有就不需要。
 },func);
 这里的func是回调函数，参数是percent（当前比例，返回0-1）。
 当drag拖动或点击时，触发该回调函数。只有x,y拖动时才生效
 */

(function($) {

    var drag = function(data,ondrag){

        var $this = $(this);
        var xPage;
        var yPage;
        var X; //
        var Y; //
        var xRand = 0; //
        var yRand = 0; //
        var father = $this.parent();
        var defaults = {
            move: 'both',
            randomPosition: true,
            hander: 1,
            click:true
        }
        var opt = $.extend({}, defaults, data);
        var movePosition = opt.move;
        var random = opt.randomPosition;

        var hander = opt.hander;

        if (hander == 1) {
            hander = $this;
        } else {
            hander = $this.find(opt.hander);
        }

        //---初始化
        father.css({
            "position": "relative"
            //,"overflow": "hidden"
        });
        $this.css({
            "position": "absolute"
        });
        /*hander.css({
         "cursor": "move"
         });*/

        var faWidth = father.width()+$this.width();
        var faHeight = father.height();
        var thisWidth = $this.width() + parseInt($this.css('padding-left')) + parseInt($this.css('padding-right'));
        var thisHeight = $this.height() + parseInt($this.css('padding-top')) + parseInt($this.css('padding-bottom'));

        var mDown = false; //
        var positionX;
        var positionY;
        var moveX;
        var moveY;

        if (random) {
            $thisRandom();
        }

        function $thisRandom() { //随机函数
            $this.each(function(index) {
                var randY = parseInt(Math.random() * (faHeight - thisHeight)); ///
                var randX = parseInt(Math.random() * (faWidth - thisWidth)); ///
                if (movePosition.toLowerCase() == 'x') {
                    $(this).css({
                        left: randX
                    });
                } else if (movePosition.toLowerCase() == 'y') {
                    $(this).css({
                        top: randY
                    });
                } else if (movePosition.toLowerCase() == 'both') {
                    $(this).css({
                        top: randY,
                        left: randX
                    });
                }

            });

        }



        hander.mousedown(function(e) {
            father.children().css({
                "zIndex": "0"
            });

            mDown = true;
            $this.data("mDown",mDown);
            X = e.pageX;
            Y = e.pageY;
            positionX = $this.position().left;
            positionY = $this.position().top;

            return false;
        });

        $(document).mouseup(function(e) {
            mDown = false;
            $this.data("mDown",mDown);
        });

        $(document).mousemove(function(e) {
            xPage = e.pageX; //--
            moveX = positionX + xPage - X;

            yPage = e.pageY; //--
            moveY = positionY + yPage - Y;

            function thisXMove() { //x轴移动
                if (mDown == true) {
                    $this.css({
                        "left": moveX
                    });


                } else {
                    return;
                }
                if (moveX < 0) {
                    $this.css({
                        "left": "0"
                    });


                }
                if (moveX > (faWidth - thisWidth)) {
                    $this.css({
                        "left": faWidth - thisWidth
                    });


                }

                if(mDown == false){

                    if(typeof ondrag == "function"){
                        ondrag(percent0($this,father));
                    }
                }


                return moveX;
            }

            function thisYMove() { //y轴移动
                if (mDown == true) {
                    $this.css({
                        "top": moveY
                    });

                } else {
                    return;
                }
                if (moveY < 0) {
                    $this.css({
                        "top": "0"
                    });

                }
                if (moveY > (faHeight - thisHeight)) {
                    $this.css({
                        "top": faHeight - thisHeight
                    });

                }
                if(mDown == false){

                    if(typeof ondrag == "function"){
                        ondrag(percent0($this,father));
                    }
                }

                return moveY;
            }

            function thisAllMove() { //全部移动
                if (mDown == true) {
                    $this.css({
                        "left": moveX,
                        "top": moveY
                    });
                } else {
                    return;
                }
                if (moveX < 0) {
                    $this.css({
                        "left": "0"
                    });
                }
                if (moveX > (faWidth - thisWidth)) {
                    $this.css({
                        "left": faWidth - thisWidth
                    });
                }

                if (moveY < 0) {
                    $this.css({
                        "top": "0"
                    });
                }
                if (moveY > (faHeight - thisHeight)) {
                    $this.css({
                        "top": faHeight - thisHeight
                    });
                }
            }
            if (movePosition.toLowerCase() == "x") {
                thisXMove();
            } else if (movePosition.toLowerCase() == "y") {
                thisYMove();
            } else if (movePosition.toLowerCase() == 'both') {
                thisAllMove();
            }



        });
        if(opt.click){
            father.click(function(e){

                var x=e.clientX-$(this).offset().left+1.5;
                $this.css("left",x);
                if(typeof ondrag == "function"){
                    ondrag(percent0($this,father));
                }
                e.preventDefault();
            });
        }

    };

    function percent0($this,father){

        var left = parseFloat($this.css("left"));
        var faLeft = father.width();
        var percent = left/faLeft;
        if(percent<0){
            return 0;
        }
        if(percent>1){
            return 1;
        }
        return left/faLeft;
    }

    function percent(){
        var $this = $(this);
        return percent0($this,$this.parent());
    }



    $.fn.extend({
        //---元素拖动插件
        dragging: drag,
        dragPercent:percent,
    });
})(jQuery);