var _window = $(window),
		ww = _window.width(),
		wh = _window.height(),
		_body = $('body'),
		_header = $('.header'),
		_menu = _header.find('.menu'),
		hh = _header.outerHeight(true),
		_search = $('.search'),
		_footer = $('.footer'),
		wwNormal = 1000,
		wwMedium = 800,
		wwSmall = 600,
		wwxs = 420;

$( '.main' ).append( '<div class="overlay"></div>' );//產生遮罩
var _overlay = $('.overlay');


$(document).ready(function(){

	$('html').removeClass('no-js');
 
	//gotop
	var _goTop = $('.goTop');
	_goTop.click(function(){
		$('html,body').stop(true,false).animate({scrollTop:0},700);
	});
	_window.scroll(function() {
		if ( $(this).scrollTop() > 250){
			_goTop.stop(true,false).fadeIn('fast');
		} else {
			_goTop.stop(true,false).fadeOut('fast');
		}
	});

	$('a.goCenter').keydown(function(e){
		if(e.which == 13) { 
			$('a#aC').focus();
		}
	});

	webSiteMenu();
	fixHeader();
	fatfootCtrl();
	share();	
	popMessage();

	mobileSearch();	
	mobileCategory();

	clickToSlide();
	photoShow();
	qa();
	tabSet();
	evenColH();

	if (ww <= wwMedium ) {
		$('.list, .thumbnail').jscroll({
			contentSelector: '.list, .thumbnail'
		});
	}
	rwdTable();
});



var resizeTimer1;
$(window).resize(function(){
	clearTimeout(resizeTimer1);
	resizeTimer1 = setTimeout(function(){
		ww = $(window).width();
		tabSet();
		evenColH();
		searchTop();
 	} , 250);
});

function webSiteMenu(){//主選單
	_menu.find('li').has('ul').addClass('hasChild');
	var liHasChild = _menu.find('li.hasChild'),
			subMenuWidth = liHasChild.first().children('ul').outerWidth();

	liHasChild.hover(
		function(){
			var _showing = $(this).children('ul');
			_showing.stop().fadeIn(200);
			showingMenu(_showing);
		},
		function(){$(this).children('ul').stop().fadeOut(200);}
	);
	liHasChild.keyup(
		function(){
			var _showing = $(this).children('ul');
			_showing.show();
			showingMenu(_showing);
			$(this).siblings().focus(function(){$(this).hide();});
	});

	function showingMenu(_showing){
		var  showingOffset = _showing.offset().left;
		if (showingOffset+subMenuWidth > ww) {
			_showing.css({left: -1*subMenuWidth+5, top:5});
		}
	}

	_menu.find('li').keyup(	
		function(){
			$(this).siblings().children('ul').hide();
		});
	_menu.find('li:last>a').focusout(
		function(){
			_menu.find('li ul').hide();
	});


	var _megaMenu = $('.header .megaMenu>ul'),
			maxH = wh-hh-40;
	
	_megaMenu.find('li:has(ul)').addClass('hasChild');

	var _megaSubMenu = _megaMenu.children('li.hasChild').children('ul');
	_megaSubMenu.css('max-height',maxH);

	_megaMenu.children('li.hasChild').hover(
		function(){$(this).children().stop().fadeIn(200)},
		function(){$(this).children('ul').stop().fadeOut(200)}
	)
	_megaMenu.children('li.hasChild').keyup(
		function(){
			$(this).children().show();
			$(this).siblings().focus(function(){
				$(this).hide()
			});
		});
	_megaMenu.children('li').keyup(	
		function(){
			$(this).siblings().children('ul').hide();
		});
	$('.header .megaMenu li:last>a').focusout(function(){
		$('.header .megaMenu li ul').hide();}
	)

	//複製所需區塊到.sidebar
  var _sidebar = $('.sidebar');	
	$('.navigation').clone().prependTo( _sidebar );
	_menu.clone().prependTo( _sidebar);
	_megaMenu.parent().clone().prependTo( _sidebar);
	_sidebar.find('.megaMenu').addClass('menu');


	//行動版 menu
	_sidebar.find('.menu').find('li.hasChild>a').click(function(){
		$(this).next().slideToggle();
		$(this).parent().toggleClass('closeThis');
	});
	
    function showSidebar(){
        _sidebar.css({'margin-left':0,'transition':'.5s'});
        _overlay.show(0, function(){
            _overlay.fadeTo('500', 0.5);
        });   
    }
    function hideSidebar(){
        _sidebar.css('margin-left', _sidebar.width() * -1 + 'px');
        _overlay.fadeTo('500', 0, function(){
            _overlay.hide();
        });
    }

    var _sidebarClose = $('.sidebarClose'),
    	_sidebarCtrl = $('.sidebarCtrl');	
		_overlay.parent().css('min-height', 'inherit');

    _sidebar.css('margin-left', _sidebar.width() * -1 + 'px');

    _sidebarCtrl.click(function() {				
        if (_overlay.is(':visible')) {
            hideSidebar();
        } else {
            showSidebar();
        }
    });

    _overlay.add(_sidebarClose).click(function() {
        hideSidebar();
    });
}
function fixHeader(){//固定版頭
	var menuH = _menu.outerHeight(),
			navH = $('.navbar').height();

	_window.scroll(function(){
		if (ww>wwNormal && $(this).scrollTop() > hh-menuH ){
			$('.header').addClass('fixed');
			$('.center').css('margin-top', menuH );
		} else if ( ww<=wwNormal && $(this).scrollTop() > 0 ){
			$('.header').addClass('fixed');
			$('.navi , .navbar , .center').css('margin-top', hh);
			$('.navi , .navbar').next('.center').css('margin-top', 0);
		} else {
			$('.header').removeClass('fixed');
			$('.navi , .navbar , .center').css('margin-top', 0);
		}
	});
}
function fatfootCtrl(){// Fatfooter 開合
	var	_ffCtrl = _footer.find('.fatfootCtrl'),
			_fatfooter = _footer.find('nav>ul>li>ul, .qrcode, .deco ');
	
	_ffCtrl.after('<span class="hint">按enter鍵可展開或收合次選單，按tab鍵往下游走</span>');

	_ffCtrl.click(fatfootSlide);
	 _ffCtrl.focus(function(){
	 	$(this).keydown(function(e){
	 		if(e.which==13){fatfootSlide}
	 	});
	 	$(this).next('.hint').fadeIn(200).delay(4000).fadeOut(600);
	 });

	function fatfootSlide(e){
		if($(this).hasClass('close')){
				_fatfooter.slideDown(function(){
					_ffCtrl.removeClass('close').text('展開');
				});
			} else {
				_fatfooter.slideUp(function(){
					_ffCtrl.addClass('close').text('收合');
				});
			}
		e.preventDefault();
	}
}
function mobileSearch(){//行動版查詢
	var _searchCtrl = $('.searchCtrl');

	// if(ww<wwNormal){_search.css('top', hh);}
	searchTop();

	_searchCtrl.click(function(){
		_search.slideToggle();
		_searchCtrl.toggleClass('close');
	});
}

function searchTop(){
	ww = _window.width();
	hh = _header.outerHeight(true);
	if(ww<wwNormal){_search.css('top', hh);}
	else {_search.attr('style','');}
}

function mobileCategory(){//行動版資料大類開合
	if(ww<=wwMedium){
		var _category = $('.category'),
				_cateList = _category.find('ul');
		_category.find('.here a').clone().insertBefore(_cateList).addClass('here');
		_category.append('<button class="cateCtrl"></button>');
		var _cateCtrl = _category.find('.cateCtrl'),
				_cateHere = _category.find('a.here');

		_cateCtrl.add(_cateHere).click(function(){
			_cateCtrl.toggleClass('close');
			_cateList.add(_cateHere).slideToggle();
		});
		_cateList.find('li>a').click(function(){
			_cateList.find('.here').removeClass('here');
			$(this).parent('li').addClass('here');
			_cateHere.text($(this).text());
			if(_cateList.is(':visible')){
				_cateList.slideUp();
				_cateHere.slideDown()};
				_cateCtrl.removeClass('close');
		});
	}
}
function share(){//分享

	var _share = $('.share'),
			_shareHead = _share.find('span').first();
	$('.shareThis').click(function(){
		_share.show();
		_overlay.show().fadeTo('300', 0.5);
	});

	var svt;
	_share.append('<span class="after">《</span>');
	_share.find('.after').hide();
	_shareHead.wrap('<a href="#"></a>');

	function miniShare(){
		_share.stop(true, false).animate({ "width":".8em"}, 600).find('ul').stop(true, false).slideUp(600, function(){
			_share.find('.after').show(200);
			_share.addClass('mini');
		});
	}
	function showShare(){
		_share.removeClass('mini').find('.after').hide();
		_share.stop(true, false).animate({ "width":"48px"},300).find('ul').stop(true, false).slideDown(300);
	}
	if (ww > 1000) {
		svt = setTimeout(miniShare , 2000);		
		_share.hover(showShare,miniShare);
		_share.children('a').focusin(showShare);
		_share.find('li').last().children('a').focusout(miniShare);
	}
	if (ww <= 1000) {
		clearTimeout(svt);
		_share.find('ul').append( '<li class="close">Close</li>' );
		_share.find('li').click(function(){
			_share.hide();
			_overlay.fadeTo('300', 0, function(){$(this).hide();});
		});
		_overlay.click(function() {
			_share.hide();
		});
	}
}
function tabSet(){//頁籤

	$('.tabs').each(function(){

		var _tab = $(this),
				_tabItem = _tab.find('.tabItem'),
				_tabItemA = _tabItem.children('a'),
				_tabContent = _tab.find('.tabContent'),
				tabwidth = _tab.width(),
				tabItemHeight = _tabItem.outerHeight(),
				tabContentHeight = _tab.find('.active').next().innerHeight();
				tabItemLength = _tabItem.length,
				tabItemWidth = tabwidth / tabItemLength;

		_tab.find('.active').next('.tabContent').show();

		if(ww > wwSmall ){
			_tabContent.css('top' , tabItemHeight );
			_tab.height(tabContentHeight + tabItemHeight);
			_tabItem.width(tabItemWidth);
			_tabItem.last().css({position:"absolute", top:"0", right:"0"}).width(tabItemWidth+1);
		} else {
			_tab.css('height','auto');
			_tabItem.width(tabwidth);
			_tabItem.last().css('position','relative');
		}

		_tabItemA.focus(tabs);
		_tabItemA.click(tabs);
	
		function tabs(e){
			var	_tabItemNow = $(this).parent(),
					tvp = _tab.offset().top,
					tabIndex = _tabItemNow.index()/2,
					scollDistance = tvp + tabItemHeight*tabIndex -hh;

			_tabItem.removeClass('active');
			_tabItemNow.addClass('active');

			if(ww <= wwSmall){
				if(! $(this).parents('.tabs').hasClass('albumType4')){// .albumType4.tab 另外處理
					_tabItem.not('.active').next().slideUp();
					_tabItemNow.next().slideDown();
					$("html,body").stop(true,false).animate({scrollTop:scollDistance});
				}
			} else {
				_tabItem.not('.active').next().hide();
				_tabItemNow.next().show();
				tabContentHeight = _tabItemNow.next().innerHeight();
				_tab.height(tabContentHeight + tabItemHeight);
			}
		    e.preventDefault();
			}
	});
}

function qa(){//QA 常見問答
	var _qaList = $('.qa').find('li'),
			_iniShowAns = _qaList.slice(0, 2),
			_qq = _qaList.find('.question>a');

	_qaList.addClass('hiddenAns');
	_iniShowAns.removeClass('hiddenAns');

	_qq.click(qaSlide);
	_qq.focus(qaSlide);

	function qaSlide(e){
		if($(this).parents('li').hasClass('hiddenAns')){
			$(this).parent().next('.answer').slideDown(function(){
				$(this).parent('li').removeClass('hiddenAns');
			})
		} else {
			$(this).parent().next('.answer').slideUp(function(){
				$(this).parent('li').addClass('hiddenAns');
			});
		}
			e.preventDefault();
	}
}

function clickToSlide(){//click 左右箭頭滑動
	if (ww >= 200) {
		$('.ckSlide').each(function(){

			var _ckSlide = $(this),
					_ckSlideList = _ckSlide.find('ul'),
					_ckSlideItem = _ckSlideList.find('li'),
					length = _ckSlideItem.length,
					boxHeight = _ckSlideItem.innerHeight(),
					itemWidth = _ckSlideItem.outerWidth(true),
					_arLeft = _ckSlide.find('.arbtn.left'),
					_arRight = _ckSlide.find('.arbtn.right'),
					listLeft = 0,
					ic = 0;

			_ckSlideList.width(itemWidth * length).wrap('<div class="showArea"></div>');

			var _showArea = _ckSlide.find('.showArea');
			_showArea.height(boxHeight);
			
			_arLeft.add(_arRight).css('top', _showArea.position().top + boxHeight*.5);

			if(_ckSlideList.width() > _showArea.width() && length > 1){
				_ckSlideList.css({'position':'absolute','left':0,'top':0});
				_arRight.show();

				var rightLimit = _showArea.width() - _ckSlideList.width() + itemWidth;

				_arRight.click(function(){
					_arLeft.fadeIn();
					if ( parseInt(_ckSlideList.css('left')) <= rightLimit ){$(this).fadeOut();}
					_ckSlideList.stop(true,false).animate({	'left': listLeft-itemWidth },500,function(){
						listLeft = listLeft-itemWidth;
					});
				});

				_arLeft.click(function(){
					_arRight.fadeIn();
					if ( parseInt(_ckSlideList.css('left')) >= -1*itemWidth ){$(this).fadeOut()};
					_ckSlideList.stop(true,false).animate({	'left': listLeft+itemWidth },500,function(){
						listLeft = listLeft+itemWidth;
					});

				});


			}





		});
	}
}

function evenColH(){//並排直欄設為等高

	if(ww > wwNormal){
		$('.row').each(function(){
			var _col = $(this).children('section').not('.slide, .tabs, .marquee');
			if( _col.length>1 ){colHeight(_col);}
		});
	} else if (ww > wwMedium) {
		$('.row').children('section').not('.slide, .tabs, .marquee').height('auto');
		$('.row').not('.cx3a, .cx3b, .cx3c, .cx2a, .cx2b').each(function(){			
				var _col = $(this).children('section').not('.slide, .tabs, .marquee');
				colHeight(_col);
		});
	} else {
		$('.row').children('section').not('.slide, .tabs, .marquee').height('auto');	
	} 

	if ( ww <= wwNormal && ww > wwSmall) {
		$('.cx4').each(function(){
			var _col = $(this).children('section').slice(0,2);
			colHeight(_col);
			var _col = $(this).children('section').slice(2);
			colHeight(_col);
		});
		$('.cx3a').each(function(){
			var _col = $(this).children('section').slice(1);
			colHeight(_col);
		});
		$('.cx3b').each(function(){
			var _col = $(this).children('section').slice(0,2);
			colHeight(_col);
		});	
	}


	function colHeight(_col){ //取並排直欄最大高
		var colH = [];
		_col.each(function(){
			colH.push($(this).innerHeight());
		});
		colH.sort(function(a, b){return b - a});
		_col.innerHeight(colH[0]);
	}

}

function popMessage(){//彈出訊息
  var _popMsg = $('.popMessage'),
  		_closePop = _popMsg.find('.closePop');

	_popMsg.before('<div class="popMask"></div>');
	var _popMask = $('.popMask');

	_popMsg.add(_popMask).show();

	_closePop.on('click focus' ,function(){
		_popMsg.add(_popMask).fadeOut(300);
	});

	_popMask.click(function(){
		$(this).add(_popMsg).fadeOut(300);
	})
}

function photoShow(){//相簿內頁

	$('.album').each(function(){

		var _album = $(this),
				_photoList = _album.find('.photoShow'),
				_photoShow = _photoList.find('li'),
				_photoThumb = _album.find('.photoThumb').find('li'),
				photoCount = _photoThumb.length,
				duration = 2500,
				tt = setInterval(autoShow, duration);
		
		_photoList.append('<span class="photoCount"><em>1'+ '</em> / ' +photoCount + '</span>');
		var _photoCounter =  _photoList.find('.photoCount').find('em');
		_photoList.append('<div title="previous" class="arbtn left"></div><div title="next" class="arbtn right"></div>');

		_photoThumb.first().addClass('active');
		_photoShow.find('.caption').hide().end().find('a').css('z-index', 0);
		_photoShow.first().find('img').show().parent('a').css('z-index', 88).next('.caption').show();

		_photoList.after('<div class="ppause"></div>');

		var ppCtrl = $('.ppause');
		if(ww <= wwSmall){
			var hini = _photoShow.first().height();
			$('.photoShow').height(hini);
			
			ppCtrl.click(function(){
				$(this).toggleClass('pplay')
				if (ppCtrl.hasClass('pplay')){
					clearInterval(tt);
				} else {
					tt = setInterval(autoShow, duration);
				}
			})
		};

		var i = 0;
		var _btnNext = _photoList.find('.right'),
				_btnPrev = _photoList.find('.left');

		_btnNext.click(function(){i = (i+1) % photoCount; showPhoto();});
		_btnPrev.click(function(){i = (i-1) % photoCount; showPhoto();});

		_photoThumb.find('a').click(function(e){
			i = $(this).parent('li').index();
			showPhoto();
			e.preventDefault();
		});
		_photoThumb.find('a').focus(function(){
			clearInterval(tt);
			i = $(this).parent('li').index();
			showPhoto();
		});
		_photoShow.find('a').focus(function(){
			clearInterval(tt);
			$(this).removeAttr('style');
			i = $(this).parent().index();
			showPhoto();
		});
		_photoShow.find('a').keydown(function(ev){
			var tabCode = ev.which || ev.keyCode;
			if(ev.shiftKey==1 && i==0 && tabCode==9){
		    tt = setInterval(autoShow, duration);
			}
		});
		_photoThumb.find('a').keydown(function(ev){
			var tabCode = ev.which || ev.keyCode;
			if(ev.shiftKey==0 && i==photoCount-1 && tabCode==9){
		    tt = setInterval(autoShow, duration);
			}
		});
		$('.photoShow, .photoThumb li').hover(
			function(){clearInterval(tt);},
			function(){
				if ( !(ppCtrl.hasClass('pplay')) ) {
					tt = setInterval(autoShow, duration);
				}
			}
		);
		function autoShow(){
			i = (i+1) % photoCount;
			showPhoto();
		}
		function showPhoto(){
			_photoThumb.eq(i).addClass('active').siblings().removeClass('active');
			_photoShow.find('.caption').hide().prev('a').css('z-index', 0);
			_photoShow.eq(i).find('img').stop(true,false).fadeIn().parent('a').css('z-index', 88).next('.caption').fadeIn();
			_photoShow.eq(i).siblings().find('img').stop(true,false).fadeOut();
			if(i <= -1){
				_photoCounter.text(i+photoCount+1);
			} else {
				_photoCounter.text(i+1);
			}			
			if(ww <= wwSmall){
				var	photoHeight = _photoShow.eq(i).height();
				$('.photoShow').animate({height:photoHeight});
			}
		}

	});


	//首頁大圖輪播參數
	$('.adloop').slick({
		accessibility:true,
		focusOnSelect: true,
		autoplay:true,
		dots:true,
		autoplaySpeed: 4000,
		speed: 1000,
		vertical:false,
	});
	//首頁大圖輪播下方dot tab移動時,無障礙人工檢測要求,按enter鍵需能直接連結圖檔網址
	$( ".slick-dots li button" ).keypress(function(e) {
			var txt = $(e.target).text();
			var achr = $(".slick-slide[data-slick-index="+txt+"] a");
			window.open(achr.attr('href'));
	}); 	



}