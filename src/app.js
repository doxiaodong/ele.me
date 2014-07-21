"use strict";
/* built by duxiaodong: Fri Jul 19 2014 14:30:28 */
/* mail: reduxiaodong@gmail.com */

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());

var isTouchScreen = function(){
    return 'ontouchstart' in document.documentElement;
};
var defaultSet = {
	click: isTouchScreen() ? 'touchstart' : 'click'
};
var $window = $(window),
	$html = $('html'),
	$body = $('body'),
	bgStars = $(".bg-stars"),
	starType = bgStars.find(".star-type"),
	tsearchForm = $("#tsearch-form"),
	tsearchInput = $("#tsearch-input"),
	tsClear = $("#ts-clear"),
	background = $(".background"),
	contentWrapper = $(".content-wrapper"),
	backTop = $(".back-top"),
	deliverSlider = $(".deliver-slider-wrapper"),
	sliderTotal = deliverSlider.find(".total"),
	sliderActual = deliverSlider.find(".actual"),
	pointControl = deliverSlider.find(".point"),
	deliverLevel = deliverSlider.find(".deliver-level"),
	flavor = $(".flavor"),
	flavorMenu = flavor.find(".flavor-menu"),
	checkBtn = $(".check-btn"),
	tgRestaurants = $(".near-restaurants"),
	mainRestaurants = $(".restaurants"),
	popRestaurants = $(".more-restaurants"),
	mamRestaurants = $(".more-and-more");

var starsNumber = {
	"1-big": 4,
	"1-normal": 6,
	"1-small": 6,
	"2-big": 4,
	"2-normal": 6,
	"2-small": 6
}

var timeNow = new Date();
var monthNow = timeNow.getMonth();
var hourNow, day;
var minNow = timeNow.getMinutes();
var dayNow = 'night';
var dayTime = (monthNow < 10 && monthNow > 5) ? [6, 20] : [7, 18];

var json = 0;
var imgn = 0;
window.addEventListener('load', function() {
	// day or night
	dayOrNight();
	setInterval(function() {
		dayOrNight();
	}, 1000);

	// new stars
	starType.each(function() {
		var $this = $(this);
		var type = $this.data("type");
		for (var i = 0; i < starsNumber[type]; i++) {
			$this.append("<div class='bg-star star" + type + "-" + (i + 1) + "'></div>");
		};
	});

	// search input
	var interval, 
		keyword = tsearchInput.val();
	tsearchInput.on('focus', function() {
		tsearchForm.addClass("focus");
		interval = setInterval(function() {
			if (tsearchInput.val() !== '' && tsClear.hasClass('hide')) {
				tsClear.removeClass('hide');
			};
			if (tsearchInput.val() !== '') {
				if (keyword !== tsearchInput.val()) {
					keyword = tsearchInput.val();
					$.ajax({
						url: "http://ele.me/search/autocomplete?_s=1405479033387&keyword=" + keyword
					}).done(function(msg){
						console.log(msg);
					}).fail(function(){
						console.log('ajax requst error');
					})
				};
			};
		}, 1);
		tsClear.on(defaultSet.click, function() {
			$(this).addClass('hide');
			tsearchInput.val('');
			tsearchInput.trigger('blur');
		})
	}).on('blur', function() {
		clearInterval(interval);
		if (tsearchInput.val() === '') {
			tsearchForm.removeClass("focus");
			tsClear.addClass('hide')
		};
	});

	// banner promotion
	var promotion1 = new promotion($("#promotion"), {
		width: 950,
		height: 80,
		source: {
			src1: [1, "img/pic1.gif", "http://ele.me/activity/49-10-gz"],
			src2: [2, "img/pic2.gif", "http://ele.me/activity/59-gztianhe1"],
			src3: [3, "img/pic3.jpeg", "http://vote.weibo.com/vid=2693128&source=feed_info"]
		},
		duration: 1000,
		delay: 4000
	});

	// game
	$('.activity').find('.who').on(defaultSet.click, function() {
		if ($window.width() < 320) {
			alert('窗口太窄');
			return;
		};
		$('.g-game').removeClass('hidden scale');
		addCanvasGame();
	});
	$('.g-game').find('.close-game').on(defaultSet.click, function() {
		$('.g-game').addClass('scale');
		setTimeout(function() {
			$('.g-game').addClass('hidden');
			$('.c-game').find('canvas').remove();
		}, 300);
	})

	// site fixed
	backTop.css({
		'visibility': 'hidden'
	});
	$window.scroll(function() {
		if ($window.scrollTop() > 100) {
			backTop.css('visibility', 'visible');
		} else {
			backTop.css({
				'visibility': 'hidden'
			});
		}
	});
	backTop.on(defaultSet.click, function() {
		$("html,body").animate({
			scrollTop: 0
		}, 500);
	});

	// restaurants
	// add tuangou
	var myTg = tgRestaurants.find('.my-restaurants');
	$.getJSON("json/tuangou.json").done(function(results) {
		json++;
		$.each(results, function(i, obj) {
			myTg.append('<a class="my-restaurant" target="_blank" href="' + obj.dataHref + '"><div class="picture"><img src="' + obj.picture + '" title="' + obj.restaurant + '" alt="" /><div class="count"><span>' + obj.count + '</span>人购买</div></div><div class="right"><h4 class="restaurant">' + obj.restaurant + '</h4><em class="price">' + obj.price + '</em><em class="old-price">' + obj.oldPrice + '</em><div class="btn">立即抢购</div></div></a>');
		});
	});

	// add main
	var myMain = mainRestaurants.find(".my-restaurants");
	var mainHeader = mainRestaurants.find(".restaurant-header");
	$.getJSON("json/mainRestaurant.json").done(function(results) {
		json++;
		$.each(results, function(i, obj) {
			addRestaurant(myMain, i, obj);
		});
		myMain.find('.my-restaurant').css('display', 'none');
		myMain.find('.my-restaurant.tuijian').css('display', 'block');
		if (!isTouchScreen()) {
			mouseenterAndOut(myMain);
		};
	});

	// add popular
	var myPop = popRestaurants.find(".my-restaurants");
	$.getJSON("json/popRestaurant.json").done(function(results) {
		json++;
		popRestaurants.find(".restaurant-header").find('span').text(results.length);
		$.each(results, function(i, obj) {
			addRestaurant(myPop, i, obj);
		});
		if (!isTouchScreen()) {
			mouseenterAndOut(myPop);
		};
	});

	// add more and more
	var myMam = mamRestaurants.find(".my-restaurants");
	$.getJSON("json/mamRestaurant.json").done(function(results) {
		json++;
		$.each(results, function(i, obj) {
			addRestaurant(myMam, i, obj);
		});
		if (!isTouchScreen()) {
			mouseenterAndOut(myMam);
		};
	});
	
	var blockStore = '.my-restaurant.tuijian',
		blockStoreSlider = '',
		blockStoreFlavor = '';
	// deliver slider wrapper
	pointControl.on('mousedown', function() {
		var actualWidth,
			totalWidth = sliderTotal.width() - 10,
			level = 'all';
		deliverSlider.addClass("active");
		$html.on('mousemove', function(e) {
			actualWidth = e.pageX - sliderTotal.offset().left;
			if(actualWidth < 0) {
				actualWidth = 0;
			} else if(actualWidth > totalWidth) {
				actualWidth = totalWidth;
			}
			$(".active .point").css('left', actualWidth);
			$(".active .actual").css('width', actualWidth);
			switch(true) {
				case actualWidth < (1/3-1/6)*totalWidth:
					if (level !== '10') {
						$(".active .deliver-level").text("10元以下");
						$(".active.deliver-slider-wrapper").attr('level', 'level-10');
						level = '10';
					};
					break;
				case actualWidth < (2/3-1/6)*totalWidth:
					if (level !== '20') {
						$(".active .deliver-level").text("20元以下");
						$(".active.deliver-slider-wrapper").attr('level', 'level-20');
						level = '20';
					};
					break;
				case actualWidth < (1-1/6)*totalWidth:
					if (level !== '30') {
						$(".active .deliver-level").text("30元以下");
						$(".active.deliver-slider-wrapper").attr('level', 'level-30');
						level = '30';
					};
					break;
				default:
					if (level !== 'all') {
						$(".active .deliver-level").text("全部");
						$(".active.deliver-slider-wrapper").attr('level', 'level-all');
						level = 'all';
					};
			}
			blockStoreSlider = $(".deliver-slider-wrapper").attr('level') === 'level-all' ? '' : '.' + $(".deliver-slider-wrapper").attr('level');
			myMain.find('.my-restaurant').css('display', 'none');
			myMain.find(blockStore + blockStoreSlider + blockStoreFlavor).css('display', 'block');
			getMoreInfoPos();
		});
		$html.on('mouseup', function() {
			deliverSlider.removeClass("active");
			// // unknow bug
			// switch(true) {
			// 	case actualWidth < (1/3-1/6)*totalWidth:
			// 		pointControl.animate({'left': 0}, 500);
			// 		sliderActual.animate({'width': 0}, 500);
			// 		break;
			// 	case actualWidth < (2/3-1/6)*totalWidth:
			// 		pointControl.animate({'left': 1/3*totalWidth}, 500);
			// 		sliderActual.animate({'width': 1/3*totalWidth}, 500);
			// 		break;
			// 	case actualWidth < (1-1/6)*totalWidth:
			// 		pointControl.animate({'left': 2/3*totalWidth}, 500);
			// 		sliderActual.animate({'width': 2/3*totalWidth}, 500);
			// 		break;
			// 	default:
			// 		pointControl.animate({'left': totalWidth}, 500);
			// 		sliderActual.animate({'width': totalWidth}, 500);
			// }
		});
	});

	// checkbox
	checkBtn.find('input').on(defaultSet.click, function(e) {
		e.stopPropagation();
	});
	checkBtn.on(defaultSet.click, function(e) {
		var isChecked = false;
		var arrayCheck = [];
		blockStore = '.my-restaurant';
		var $self = $(this);
		$self.find('input').trigger(defaultSet.click);
		if ($self.find('input')[0].checked) {
			$self.addClass('checked');
		} else {
			$self.removeClass('checked');
		};
		checkBtn.each(function() {
			if ($(this).hasClass('checked')) {
				isChecked = true;
			};
		});
		if (isChecked) {
			myMain.find('.my-restaurant').css('display', 'none');
			$(".check-btn.checked").each(function() {
				var $this = $(this);
				arrayCheck.push($this.find('input').attr('value'));
			});
		};
		for (var i = 0, il = arrayCheck.length; i < il; i++) {
			blockStore += '.' + arrayCheck[i];
		};
		myMain.find(blockStore + blockStoreSlider + blockStoreFlavor).css('display', 'block');
		getMoreInfoPos();
	});

	// flavor
	flavor.on(defaultSet.click, function(e) {
		flavorMenu.addClass('active')
		.css('visibility', 'visible')
		.animate({
			height: 400
		}, 1000);

		e.stopPropagation();
	});
	$body.on(defaultSet.click, function() {
		if (flavorMenu.hasClass('active')) {
			flavorMenu.animate({
				height: 0
			}, 500, function() {
				flavorMenu.css('visibility', 'hidden');
			});
			flavorMenu.removeClass('active');
		};
	});
	flavorMenu.find('li').on(defaultSet.click, function(e) {
		var pinyin = $(this).attr('class'),
			hanzi = $(this).find('a').text() === '全部' ? '口味' : $(this).find('a').text();
		flavor.attr('pinyin', pinyin);
		flavorMenu.animate({
			height: 0
		}, 500, function() {
			flavorMenu.css('visibility', 'hidden');
		});
		flavorMenu.removeClass('active');
		flavor.find('.hanzi').text(hanzi);

		blockStoreFlavor = flavor.attr('pinyin') === 'all' ? '' : '.' + flavor.attr('pinyin');
		myMain.find('.my-restaurant').css('display', 'none');
		myMain.find(blockStore + blockStoreSlider + blockStoreFlavor).css('display', 'block');
		getMoreInfoPos();

		e.stopPropagation();
	});

	// loading...
	requstLoading();




	

	$window.resize(function() {
		getMoreInfoPos();
		// redraw canvas
		if (!$('.g-game').hasClass('hidden')) {
			console.log("===redraw canvas===")
			$('.c-game').find('canvas').remove();
			addCanvasGame();
		};
	});
	
});

function getMoreInfoPos() {
	$('.my-restaurant').each(function() {
		var $self = $(this);
		$self.css('left', 0);
		if ($self.offset().left < ($window.width() - $self.offset().left - $self.width())) {
			$self.find('.more-info').css('left', 190);
		} else {
			$self.find('.more-info').css('left', -372);
		};
	});
}


function dayOrNight() {
	hourNow = timeNow.getHours();

	day = (hourNow < dayTime[1] && hourNow > dayTime[0]) ? 'day' : 'night';
	if (day !== dayNow) {
		background.removeClass(dayNow).addClass(day);
		contentWrapper.removeClass(dayNow).addClass(day);
		dayNow = day;
	};
}

// add "holiday" and "phone" when necessary//
// "holiday": "true",
// "phone": "true"
function addRestaurant(tar, i, obj){
	tar.append('<a class="my-restaurant res' + i + '" target="_blank" href="' + obj.dataHref + '"><div class="box"><div class="logo-wrapper"><div class="logo"><img src="'+ obj.logo + '" alt="' + obj.restaurant + '" /></div><div class="deliver-time"><span>' + obj.deliverTime + '</span>分钟</div></div><div class="right"><div class="name">' + obj.restaurant + '</div><div class="flavor">' + obj.flavor + '</div><div class="staus"><span>休息中</span></div><div class="staus-info"><span>已打烊</span></div><div class="rating"><div class="rating-star"></div><span class="rating-number">' + obj.ratingNumber + '<span>订单</span></span></div><div class="icons"></div><div class="book hide"><div class="add">收藏</div><div class="unadd hide">取消收藏</div></div></div></div><div class="more-info"><div class="name"></div></div></a>');
	var resI = tar.find('.res' + i);
	var rightRatingStar = resI.find('.rating-star');
	var rightRatingStarLevel = Math.floor(obj.ratingStar*2) === obj.ratingStar*2 ? Math.floor(obj.ratingStar*2) : (Math.floor(obj.ratingStar*2) + 1);
	rightRatingStar.addClass('r' + rightRatingStarLevel);
	var rightIcons = resI.find('.right').find('.icons');
	if ((minNow + hourNow*60) > ((obj.open.hour*60 - 0) + (obj.open.min - 0))&&(minNow + hourNow*60) < ((obj.close.hour*60 - 0) + (obj.close.min - 0))&&!resI.hasClass('closed-m')) {
		resI.removeClass('closed').addClass('open');
	} else {
		resI.removeClass('open').addClass('closed');
	};
	if (!Boolean(obj.deliverTime - 0) && obj.deliverTime !== '') {
		resI.find(".deliver-time").addClass('bgcolor');
	};
	if (obj.ratingNumber === '') {
		resI.find('.rating-number').text('');
	};
	if (obj.reserve === 'true' ) {
		resI.addClass('reserve');
		resI.find('.staus').find('span').text('接受预订');
	};
	if ((obj.ratingStar - 0) >= 4) {
		resI.addClass('tuijian');
	};
	if (obj.deliverTime === '') {
		resI.find('.deliver-time').text('');
	};
	if (obj.phone === 'true') {
		resI.find('.logo').append('<div class="phone-logo"></div>');
	};
	switch (true) {
		case obj.lowest < 10:
			resI.addClass('level-10');
			break;
		case obj.lowest < 20:
			resI.addClass('level-20');
			break;
		case obj.lowest < 30:
			resI.addClass('level-30');
			break;
		default:
			resI.addClass('level-all');
	};
	// flavor
	var objFlavors = {
		zhongshi: /中式/,
		xishi: /西式/,
		gangshi: /港式/,
		naicha: /奶茶/,
		rishi: /日式/,
		hanshi: /韩式/,
		tiandian: /甜点/,
		hanbao: /汉堡/,
		qingzhen: /清真/
	};
	for (var bttr in objFlavors) {
		if (objFlavors[bttr].test(obj.flavor)) {
			resI.addClass(bttr);
		};
	};

	//more info
	var moreInfo = resI.find(".more-info");
	var moreInfoName = obj.weita === 'true' ? ('【维他】' + obj.restaurant) : obj.restaurant;
	moreInfo.find('.name').text(moreInfoName);
	if (obj.holiday === 'true') {
		resI.removeClass('open').addClass('holiday busy closed');
		resI.find('.right').find('.staus-info').find('span').text('餐厅已休假');
		moreInfo.append('<p class="receive">餐厅已休假，暂不提供外卖服务</p>');
	};

	if (obj.receiveOrder !== 'true' && !resI.hasClass('holiday')) {
		resI.removeClass('open').addClass('busy closed');
		resI.find('.right').find('.staus-info').find('span').text('太忙暂不接收新订单');
		moreInfo.append('<p class="receive">餐厅太忙，暂时不接收新订单</p>');
	};
	if ((minNow + hourNow*60) < ((obj.openM.hour*60 - 0) + (obj.openM.min - 0))&&(minNow + hourNow*60) > ((obj.closeM.hour*60 - 0) + (obj.closeM.min - 0))) {
		resI.removeClass('open').addClass('closed closed-m');
	};
	var openHourString = obj.open.hour < 10 ? ('0' + obj.open.hour) : obj.open.hour,
		openMinString = obj.open.min < 10 ? ('0' + obj.open.min) : obj.open.min,
		closeHourString,
		closeMinString = obj.close.min < 10 ? ('0' + obj.close.min) : obj.close.min,
		mopenHourString, mopenMinString, mcloseHourString, mcloseMinString;
	if (obj.close.hour < 10) {
		closeHourString = '0' + obj.close.hour;
	} else if (obj.close.hour > 24) {
		closeHourString = '次日' + (obj.close.hour - 24);
	} else {
		closeHourString = obj.close.hour;
	};

	if (obj.openM.hour !=='' ) {
		mopenHourString = obj.openM.hour < 10 ? ('0' + obj.openM.hour) : obj.openM.hour;
		mopenMinString = obj.openM.min < 10 ? ('0' + obj.openM.min) : obj.openM.min;
		mcloseHourString = obj.closeM.hour < 10 ? ('0' + obj.closeM.hour) : obj.closeM.hour;
		mcloseMinString = obj.closeM.min < 10 ? ('0' + obj.closeM.min) : obj.closeM.min;
	};
	var openTimeString = openHourString + ':' + openMinString,
		closeTimeString = closeHourString + ':' + closeMinString,
		mopenTimeString = mopenHourString + ':' + mopenMinString,
		mcloseTimeString = mcloseHourString + ':' + mcloseMinString;
	if (!resI.hasClass('holiday') && resI.hasClass('closed') && !resI.hasClass('busy')) {
		if (resI.hasClass('reserve')) {
			if (resI.hasClass('closed-m')) {
				resI.find('.right').find('.staus-info').find('span').text('送餐时间' + mopenTimeString + '开始');
				moreInfo.append('<p class="info">接受预订，送餐时间在' + mopenTimeString + '开始</p>');
			} else {
				resI.find('.right').find('.staus-info').find('span').text('送餐时间' + openTimeString + '开始');
				moreInfo.append('<p class="info">接受预订，送餐时间在' + openTimeString + '开始</p>');
			};
		} else {
			if (resI.hasClass('closed-m')) {
				moreInfo.append('<p class="info">已打烊，今天' + mopenTimeString + '开始订餐</p>');
			} else {
				moreInfo.append('<p class="info">已打烊，明天' + openTimeString + '开始订餐</p>');
			};
		};
	};
	moreInfo.append('<div class="divider"></div>');
	moreInfo.append('<ul class="icons"></ul>');
	if (obj.onlinePay === 'true') {
		resI.addClass('online-pay');
		rightIcons.append('<span class="icon online-pay"></span>');
		moreInfo.find('.icons').append('<li class="online-pay"><span class="icon online-pay"></span><span class="desc">该餐厅支持在线支付</span></li>');
	};
	if (obj.packingFee !== '') {
		rightIcons.append('<span class="icon packing-fee"></span>');
		moreInfo.find('.icons').append('<li class="packing-fee"><span class="icon packing-fee"></span><span class="desc">该餐厅订餐需支付配送费' + obj.packingFee + '元</span></li>');
	};
	if (obj.weita === 'true') {
		resI.addClass('weita');
		rightIcons.append('<img class="icon" src="http://fuss10.elemecdn.com/3/ea/060c294de2d291c59c87357315111png.png" />');
		moreInfo.find('.icons').append('<li class="weita"><img class="icon weita" src="http://fuss10.elemecdn.com/3/ea/060c294de2d291c59c87357315111png.png" alt=""/><span class="desc">【订餐送清凉，加油饿了么】小饿君携万排维他柠檬茶来了。饿了么网上订餐继“益力多套餐”疯狂活动之后，又一波更猛、更劲爆心窝的大赠饮活动来了！每单满59元立送维他柠檬茶1排，满590元送10排。关注饿了么，精彩每一天！</span></li>');
	};
	if (obj.invoice !== '') {
		rightIcons.append('<span class="icon invoice"></span>');
		if (obj.invoice === 'true') {
			moreInfo.find('.icons').append('<li class="invoice"><span class="icon invoice"></span><span class="desc">该餐厅支持开发票，请在下单时填写好发票抬头</span></li>');
		} else {
			moreInfo.find('.icons').append('<li class="invoice"><span class="icon invoice"></span><span class="desc">该餐厅支持开发票，开票订单金额最低' + obj.invoice + '元起，请在下单时填写好发票抬头</span></li>');
		};
	};
	if (obj.compensate !== '') {
		rightIcons.append('<span class="icon compensate"></span>');
		moreInfo.find('.icons').append('<li class="compensate"><span class="icon compensate"></span><span class="desc">' + obj.compensate + '</span></li>');
	};
	if (obj.notice !== '') {
		moreInfo.append('<p class="notice"><strong>公告：</strong>' + obj.notice + '</p>');
	};
	if (obj.extra !== '') {
		moreInfo.append('<p class="low"><strong>起送价：</strong>到<span class="where">G餐厅</span><span class="lowest">' + obj.lowest + '</span>元。<span class="extra">（额外说明：' + obj.extra + '）</span></p>');
	} else {
		moreInfo.append('<p class="low"><strong>起送价：</strong>到<span class="where">G餐厅</span><span class="lowest">' + obj.lowest + '</span>元。</p>');
	};
	moreInfo.append('<p class="address"><strong>地址：</strong>' + obj.address + '</p>');

	if (obj.openM.hour !=='' ) {
		moreInfo.append('<p class="open-time"><strong>营业时间：</strong>' + openTimeString + ' - ' + mcloseTimeString + ' / ' + mopenTimeString + ' - ' + closeTimeString  + '</p>');
	} else {
		if (obj.close.hour - obj.open.hour == 24) {
			moreInfo.append('<p class="open-time"><strong>营业时间：</strong>24小时营业</p>');
		} else {
			moreInfo.append('<p class="open-time"><strong>营业时间：</strong>' + openTimeString + ' - ' + closeTimeString + '</p>');
		}
		
	};
	moreInfo.append('<p class="intro"><strong>简介：</strong>' + obj.intro + '</p>');

	if (resI.offset().left < ($window.width() - resI.offset().left - resI.width())) {
		moreInfo.css('left', 190);
	} else {
		moreInfo.css('left', -372);
	};
}

// mouseenter and out
function mouseenterAndOut(tar) {
	var $myRestaurant = tar.find('.my-restaurant');
	var timeoutMoreInfo;
	$myRestaurant.on('mouseenter', function() {
		var $self = $(this);
		initMoreInfo($myRestaurant);
		clearTimeout(timeoutMoreInfo);
		timeoutMoreInfo = setTimeout(function(){
			$self.find(".more-info").css('visibility', 'visible');
			$self.find(".book").removeClass('hide').find('div').css('color', '#0088c8');
			$self.find(".name").css('color', '#0088c8');
			$self.find(".staus-info").addClass('hide');
		}, 400);
		$self.on('mousemove', function(e) {
			e.stopPropagation();
		});
	});

	// look me
	// set moreInfo hidden when mouse on it if necessary
	$myRestaurant.find('.more-info').on('mousemove', function() {
		// release me hahah
		// initMoreInfo($myRestaurant);
	});
	$body.on('mousemove', function() {
		initMoreInfo($myRestaurant);
	});
	$myRestaurant.find(".book").find('div').on(defaultSet.click, function(e) {
		e.preventDefault();
		e.stopPropagation();
	});
}

function initMoreInfo(tar) {
	tar.find('.more-info').css('visibility', 'hidden');
	tar.find(".book").addClass('hide').find('div').css('color', '#999');
	tar.find(".name").css('color', '#999');
	tar.find(".staus-info").removeClass('hide');
}

// request loading
function requstLoading() {
		var loading = $(".load").find('.container');
		var	imgNumberLoaded = 0;
		var $img = $('img');
		var imgLength = $img.length;
		if (json !== 4) {
			loading.stop();
			loading.animate({'width': json/4*1/5*$window.width()}, 500);
		};
		
	if (json === 4) {
		for (var i = 0; i < imgLength; i++) {
			if ($img[i].complete) {
				imgNumberLoaded++;
			};
		};
		loading.stop();
		loading.animate({'width': imgNumberLoaded/$img.length*$window.width()}, 500);
	};
	var requstId = window.requestAnimationFrame(requstLoading);
	if (imgNumberLoaded === imgLength) {
		loading.stop();
		loading.animate({'width': $window.width()}, 500, function() {
			loading.css('visibility', 'hidden');
			$body.removeClass('loading');
			getMoreInfoPos();
		});
		window.cancelAnimationFrame(requstId);
	};
}

function addCanvasGame() {
	if ($window.width() <= 751) {
		new whoIsTheOne($('.c-game'), 4, {
			back1: ['gray' ,'img/money.jpg'],
			back2: ['red' ,'img/wa.jpg'],
			width: 0.4*$window.width(),
			height: 1/4*$window.height()
		});
	} else {
		new whoIsTheOne($('.c-game'), 4, {
			back1: ['gray' ,'img/money.jpg'],
			back2: ['red' ,'img/wa.jpg'],
			width: 0.22*$window.width(),
			height: 1/4*$window.height()
		});
	}
}