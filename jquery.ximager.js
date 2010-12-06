;(function($) {

        $.fn.xImager = function( options ) {
                var defaults = {
                url: '',
                        container: '',
                        triggerMouseWheel: false,
                        connectWith: '',
                init: function() {
                        
                },
                mousewheel: function(ui) {
                        
                }
                };

                var opts = $.extend( {}, defaults, options || {} ),
                        self = this;
                
                return this.each(function(){
                        var $this = $(this);
                        var o = $.meta ? $.extend({}, opts, $this.data()) : opts;
                        
                        // set src
                        $this.attr('src', o.url);
                        // 1. check browser 
                        //              firefox: DOMMouseScroll & detail
                        //              others: mousewheel & wheelDelta
                        this.addEventListener( $.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel', function(e){
                                if(o.triggerMouseWheel) {
                                        var times = e.wheelDelta ? e.wheelDelta / (-120) : (e.detail || 0) / 3;         
                                        doMouseWheel(times);
                                        e.preventDefault();
                                }
                        }, false);

                        function doMouseWheel( times ) {
                                var now_w = self.width(), now_h = self.height(), 
                                        now_l = parseInt($(o.container).css('left'), 10), now_t = parseInt($(o.container).css('top'), 10), 
                                        rate = 1-times*0.05;
                                var new_w = now_w*rate, new_h = now_h*rate,
                                        new_l = now_l+now_w*times*(0.025), new_t = now_t+now_h*times*(0.025);

                                self.moveTo(new_l, new_t);
                                self.resizeTo(new_w, new_h);

                                if( '' !== o.connectWith ) {
                                        $.each( o.connectWith, function( i, v ) {
                                                v.moveTo(new_l, new_t);
                                                v.resizeTo(new_w, new_h);
                                        });
                                }
                                
                                var ui = {
                                        position: {
                                                left: new_l,
                                                top: new_t
                                        },
                                        size: {
                                                width: new_w,
                                                height: new_h
                                        }
                                };
                                
                                o.mousewheel(ui);
                        }

                        // moveTo ...
                        self.moveTo = function( left, top ) {
                                if( o.container !== '' ) { // move container if it has a container
                                        $(o.container).css({
                                                left: left+'px',
                                                top: top+'px'
                                        });
                                } else { // move images
                                        $(this).css({
                                                marginLeft: left+'px',
                                                marginTop: top+'px'
                                        });
                                }
                        };
                        
                        // resizeTo ...
                        self.resizeTo = function( width, height ) {
                                $(this).css({
                                        width: width+'px',
                                        height: height+'px'
                                });
                                if( o.container !== '' ) {
                                        $(o.container).css({
                                                width: width+'px',
                                                height: height+'px'
                                        });
                                }
                        }
                        
                        // set Options ..
                        self.setOption = function( option, value ) {
                                o[option] = value;
                        }
                });
                        
        };

})(jQuery);