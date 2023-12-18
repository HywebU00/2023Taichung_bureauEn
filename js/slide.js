$(document).ready(function(){
		var ww = $(window).width();	

	// 大圖輪播
	$('.slide').each(function(){

		var _slide = $(this),
				_slideBox = _slide.find('.box'),
				_slideItem = _slideBox.find('li'),
				imgWidth = _slide.width(),
				count = _slideItem.length,
				boxRatio = .76 ,
				_dots = '',
				_arrowLeft = _slide.find('.arbtn.left'),
				_arrowRight = _slide.find('.arbtn.right'),
				speed = 1000,
				timer = 4000;
				
		if (_slide.hasClass('bb1')){boxRatio = .76};
		if (_slide.hasClass('bb2')){boxRatio = .25};
		if (_slide.hasClass('bb3')){boxRatio = .5};
		if (_slide.hasClass('albumType3')){boxRatio = .75};
		_slideItem.find('img').width(imgWidth);
		_slideBox.height(imgWidth*boxRatio);

		_slide.find('.dots').append('<ul></ul>');
		for(var i=0; i<count; i++){
			_dots = _dots +'<li></li>';
		};
		_slide.find('.dots>ul').append(_dots).children('li').first().addClass('active');

		slideH();
		function slideH(){			
			if(ww >= 1000 && _slide.height() >= _slide.siblings().innerHeight()){
				_slide.siblings().innerHeight(_slide.height());
			}
		}


	  var resizeTimer;
	 	$(window).resize(function(){
	  	clearTimeout(resizeTimer);
	  	resizeTimer = setTimeout(function(){
	  		var ww2 = $(window).width();
	  		if(ww2<=1000 || ww<=1000){
	  			if(ww2!=ww){
		  			ww=ww2;
			  		imgWidth = _slideItem.width();
			  		_slideBox.height(imgWidth*boxRatio);
			  		_slideItem.find('img').width(imgWidth);
			  		if( count > 1){
				  		_slideItem.not(':animated').css('left' , imgWidth);
				  		photoSlide();
				  	}
					}
			  }
	  	} , 200);

	  });



		if( count > 1){
			var tt = setInterval(autoSlide, timer),
					index = 0, i1 = 0, i2;
			_slideItem.not(':first').css('left' , imgWidth);

			_arrowRight.click(function(){
				i1 = index % count;
				i2 = (index+1) % count;
				photoSlide();
				index++;
			});
			_arrowLeft.click(function(){
				i1 = index % count;
				i2 = (index-1) % count;
				photoSlideRev();
				index = i2;
			});

			hoverSlide();

			_slideItem.find('a').focus(function(){
				clearInterval(tt);
				_slideItem.stop().css('left',0);
				$(this).parent().css('z-index',99).siblings().css('z-index',0);
				i2 = $(this).parent().index();
				dotActive(i2);
				_slide.off('mouseenter mouseleave');
			});

			_slideItem.find('a').keydown(function(ev){
				var tabCode = ev.which || ev.keyCode;

				if(ev.shiftKey==0 && i2==count-1 && tabCode==9){
					_slideItem.removeAttr('style');
					_slideItem.not(':last').css('left',imgWidth);
					index = count-1;
					tt = setInterval(autoSlide, timer);
					hoverSlide();
				} 
				if(ev.shiftKey==1 && i2==0 && tabCode==9){
					_slideItem.removeAttr('style');
					_slideItem.not(':first').css('left',imgWidth);
					index = 0;
					tt = setInterval(autoSlide, timer);
					hoverSlide();
				}
			});
		} else {
			_arrowLeft.add(_arrowRight).hide();
		}

		function autoSlide(){
			i1 = index % count;
			i2 = (index+1) % count;
			photoSlide();
			index++;
		}
		function photoSlide(){
			_slideItem.eq(i1).stop(true,true).animate({'left':imgWidth * -1} , speed,
				function(){
					$(this).css('left', imgWidth);
				});
			_slideItem.eq(i2).stop(true,true).animate({'left':0}, speed, dotActive);
		}
		function photoSlideRev(){
			_slideItem.eq(i2).css('left', imgWidth * -1).stop().animate({'left':0}, speed, dotActive);
			_slideItem.eq(i1).stop(true,true).animate({'left':imgWidth} , speed);
		}
		function dotActive(){
			 _slide.find('.dots li').removeClass('active').eq(i2).addClass('active');
		}
		function hoverSlide(){
			_slide.hover(
				function(){clearInterval(tt);},
				function(){tt = setInterval(autoSlide, timer);}
			);			
		}

	});

	// 小廣告輪播，水平
	$('.adSlide, .photoQuickView').each(function(){

		var _adSlide = $(this),
				_showBox = _adSlide.find('.box'),
				_adSlideItem = _showBox.find('li'),
				_adSlideGroup = _adSlideItem.parent(),
				itemWidth = _adSlideItem.outerWidth(true),
				count = _adSlideItem.length,
				_arrowLeft = _adSlide.find('.arbtn.left'),
				_arrowRight = _adSlide.find('.arbtn.right'),
				_pauseArea = _adSlideGroup.add(_arrowLeft).add(_arrowRight),
				speed = 600,
				timer = 4000,
				autoAdSlide ;				

		_arrowLeft.add(_arrowRight).css('top', _showBox.position().top + _showBox.innerHeight()*.5);
		_adSlideGroup.width(itemWidth*count);

		var slideTotalWidth = _adSlideGroup.width() + _arrowLeft.width()*2;

		if( slideTotalWidth > $('.main').width()){
			autoAdSlide = setInterval(slideForward, timer);

			var i = 0;
			_arrowRight.click(function(){
				slideForward();
			});
			_arrowLeft.click(function(){
				i = (i-1)%count;
				_adSlideItem.eq(i).prependTo(_adSlideGroup);
				_adSlideGroup.css('left', -1*itemWidth );
				_adSlideGroup.stop().animate({'left': 0}, speed);
			});
			_pauseArea.hover(
				function(){ clearInterval(autoAdSlide);},
				function(){	autoAdSlide = setInterval(slideForward, timer);}
			);
			
			var tabCode, ix=0;

			_adSlideItem.find('a').focus(function(){
				clearInterval(autoAdSlide);
				_pauseArea.off("mouseenter mouseleave");
			});

			_adSlideItem.find('a').keydown(function(event){
				clearInterval(autoAdSlide);
				_pauseArea.off("mouseenter mouseleave");

				ix = $(this).parent('li').index();
				tabCode = event.which || event.keyCode;

				if(event.shiftKey==0 && tabCode==9){
					_adSlideGroup.css('right','auto').stop(true,true).animate({'left': -1*ix*itemWidth});
					if(ix==count-1){
						_adSlideGroup.removeAttr('style').css('width' , itemWidth*count);
						slideRestart();
					}
				}
				if(event.shiftKey==1 && tabCode==9){
					_adSlideGroup.css({'left':'auto', 'right':(ix-count)*itemWidth });
					if(ix == 0){
						_adSlideGroup.removeAttr('style').css('width' , itemWidth*count);
						slideRestart();
					}
				}
			});
		} else {
			_adSlideGroup.css({'position':'static','margin-left':'auto','margin-right':'auto'});
			_arrowLeft.add(_arrowRight).hide();
		}

		function slideForward(){
			_adSlideGroup.stop(true,false).animate({'left': -1*itemWidth}, speed, 
			function(){
				_adSlideItem.eq(i).appendTo(_adSlideGroup);
				_adSlideGroup.css('left',0);
				i = (i+1)%count;
			});			
		}
		function slideRestart(){
			autoAdSlide = setInterval(slideForward, timer);
			_pauseArea.hover(
				function(){ clearInterval(autoAdSlide);},
				function(){	autoAdSlide = setInterval(slideForward, timer);}
			);			
		}		
	});

	// 小廣告輪播，垂直款
	$('.adSlideV').each(function(){

		var _adSlideV = $(this),
				_showBox = _adSlideV.find('.box'),
				_adSlideItem = _showBox.find('li'),
				_adSlideGroup = _adSlideItem.parent(),
				itemHeight = _adSlideItem.outerHeight(true),
				count = _adSlideItem.length,
				_arrowTop = _adSlideV.find('.arbtn.top'),
				_arrowBottom = _adSlideV.find('.arbtn.bottom'),
				_pauseArea = _adSlideGroup.add(_arrowTop).add(_arrowBottom),
				speed = 600,
				timer = 4000,
				autoAdSlideV = setInterval(slideUpward, timer);

		_adSlideGroup.height(itemHeight*count);

		var i = 0;
		_arrowBottom.click(function(){
			slideUpward();
		});
		_arrowTop.click(function(){
			i = (i-1)%count;
			_adSlideItem.eq(i).prependTo(_adSlideGroup);
			_adSlideGroup.css('top', -1*itemHeight );
			_adSlideGroup.stop().animate({'top': 0}, speed);
		});
		_pauseArea.hover(
			function(){ clearInterval(autoAdSlideV);},
			function(){	autoAdSlideV = setInterval(slideUpward, timer);}
		);

		var y = 0;
		_adSlideItem.find('a').focus(function(){
			clearInterval(autoAdSlideV);
			_adSlideGroup.stop().css('top', 0 );
			var x = $(this).parent('li').index();
			if (x != 0 && y < count ){
				$(this).parent('li').prev().appendTo(_adSlideGroup);
				y++;
			}
			if (y == count) {
				_adSlideGroup.find('a').blur();
				_showBox.nextAll().find('a').focus();
				autoAdSlideV = setInterval(slideUpward, timer);
			}
		});

		function slideUpward(){
			_adSlideGroup.stop(true,false).animate({'top': -1*itemHeight}, speed, 
				function(){
					_adSlideItem.eq(i).appendTo(_adSlideGroup);
					_adSlideGroup.css('top',0);
					i = (i+1)%count;
				});			
		}

	});


	marqueeB2T();
	marqueeR2L();
	function marqueeB2T(){//跑馬燈：垂直		
		$('.marquee.B2T').each(function(){
			var _mq = $(this),
					_mqItem = $(this).find('li'),
					_box = $(this).find('.box'),
					count = _mqItem.length,
					mqH = _mqItem.outerHeight(),
					speed = 600,
					timer = 4000,
					i = 0, j,
					marqueeGo,
					_button = _mq.find('button');
			
			_box.innerHeight(mqH);
			_mqItem.css({'top': mqH});
			_mqItem.eq(i).css({'top':0, 'left':0});

			if(count>1){
				marqueeGo = setInterval(mqLoop, timer);
				_button.innerHeight(mqH).innerWidth(mqH).show();
				mqHover();

				_button.click(function(){
					$(this).toggleClass('pause');
					if($(this).hasClass('pause')){
						clearInterval(marqueeGo);
					} else {
						marqueeGo = setInterval(mqLoop, timer);
					}
				});

				_mqItem.find('a').focus(function(){
					clearInterval(marqueeGo);
					_mqItem.css({'top':'0','z-index':'-1'});
					$(this).parent().css('z-index','99');
					_mqItem.off('mouseenter mouseleave');
				});

				_mqItem.find('a').keydown(function(ev){
					var keyX = ev.which || ev.keyCode;
					i= $(this).parent().index();
					if(keyX==9 && i==count-1 && ev.shiftKey==0){
						_mqItem.removeAttr('style');
						_mqItem.not(':last').css('top', mqH);
						marqueeGo = setInterval(mqLoop, timer);
						mqHover();
					}
					if(keyX==9 && i==0 && ev.shiftKey==1){
						_mqItem.removeAttr('style');
						_mqItem.not(':first').css('top', mqH);						
						marqueeGo = setInterval(mqLoop, timer);
						mqHover();
					}
				});
			}

			function mqHover(){
				_mqItem.hover(
					function(){clearInterval(marqueeGo); },
					function(){
						if ( _button.hasClass('pause')) {return;}
						else { marqueeGo = setInterval(mqLoop, timer); }
					}
				);
			}

			function mqLoop(){
				j = (i+1)%count;
				_mqItem.eq(j).stop(true,false).animate({'top': 0}, speed, 'linear');
				_mqItem.eq(i).stop(true,false).animate({'top': -1*mqH}, speed, 'linear',
					function(){
						$(this).css('top', mqH);
						i = j;
					}
				);
			}
		});
	}

	function marqueeR2L(){//跑馬燈：水平
		$('.marquee.R2L').each(function(){
			var _mq = $(this),
					_mqItem = _mq.find('li'),
					_box = _mq.find('.box'),
					count = _mqItem.length,
					mqH = _mqItem.outerHeight(),
					mqW = _box.width(),
					speed = 1500,
					timer = 5000,
					i = 0, j,
					marqueeGo,
					_button = _mq.find('button');
							
			_box.innerHeight(mqH);

			_box.innerHeight(mqH);
			_mqItem.css({'left': mqW});
			_mqItem.eq(i).css('left', 0);

			if (count>1){
				marqueeGo = setInterval(mqLoopR2L, timer);
				_button.innerHeight(mqH).innerWidth(mqH).show();
				mqHhover()

				_button.click(function(){
					$(this).toggleClass('pause');
					if($(this).hasClass('pause')){
						clearInterval(marqueeGo);
					} else {
						marqueeGo = setInterval(mqLoopR2L, timer);
					}
				});

				_mqItem.find('a').focus(function(){
					clearInterval(marqueeGo);
					_mqItem.stop(true,false).css({'left':'0', 'z-index':'-1'});
					$(this).parent().css('z-index','99');
					_mqItem.off('mouseenter mouseleave');
				});

				_mqItem.find('a').keydown(function(ev){
					var keyX = ev.which || ev.keyCode;
					i= $(this).parent().index();
					if(keyX==9 && i==count-1 && ev.shiftKey==0){
						_mqItem.removeAttr('style');
						_mqItem.not(':last').css('left', mqW);
						marqueeGo = setInterval(mqLoopR2L, timer);
						mqHhover();
					}
					if(keyX==9 && i==0 && ev.shiftKey==1){
						_mqItem.removeAttr('style');
						_mqItem.not(':first').css('left', mqW);
						marqueeGo = setInterval(mqLoopR2L, timer);
						mqHhover();
					}
				});
			}

			function mqHhover(){
				_mqItem.hover(
					function(){clearInterval(marqueeGo);},
					function(){
						if ( _button.hasClass('pause')){ return;}
						else { marqueeGo = setInterval(mqLoopR2L, timer);}
					}
				);
			}
			
			function mqLoopR2L(){
				j = (i+1)%count;
				_mqItem.eq(j).stop(true,true).animate({'left': 0}, speed);
				_mqItem.eq(i).stop(true,true).animate({'left': -1*mqW }, speed,
					function(){ 
						$(this).css('left', mqW );
						i = j;
					}
				);
			}
		});
	}

})