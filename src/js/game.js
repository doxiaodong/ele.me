;function whoIsTheOne(ele, number, opts) {
	width = opts.width || 300;
	height = opts.height || 150;
	var back = [];
	for (var i = 0; i < number; i++) {
		back[i] = opts.back1;
	};
	back[Math.floor(Math.random()*number)] = opts.back2;
	var iskeydown = false,
		radius = 16,
		isTouchScreen = function(){
		    return 'ontouchstart' in document.documentElement;
		};
		for (var i = 0; i < back.length; i++) {
			ele.append('<canvas class="canvas' + i + '" width="' + width + '" height="' + height + '">换换新浏览器啦~</canvas>');
			$('.canvas' + i)[0].style.backgroundColor = back[i][0];
			$('.canvas' + i)[0].style.backgroundImage = 'url(' + back[i][1] + ')';
			setAnimation($('.canvas' + i)[0]);
		};
	function setAnimation (canvas) {
		if(canvas.getContext('2d')) {
			var ctx = canvas.getContext('2d');
			ctx.fillStyle = '#999';
			ctx.fillRect(0, 0, width, height);

			ctx.font = 'bold ' + 1/6*$(canvas).width() + 'px 宋体, 黑体, Aria';
			ctx.fillStyle = '#333';
			ctx.textAlign = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillText('使劲刮开我', width * 0.5, height * 0.5);
			if (isTouchScreen()) {
				document.addEventListener('touchstart', function () {
					iskeydown = true;
				});
				document.addEventListener('touchend', function () {
					iskeydown = false;
				});
				document.addEventListener('touchmove', function (e) {
					e.preventDefault();
				});
				document.addEventListener('touchmove', function (e) {
				
					if (iskeydown) {
						var x = e.touches[0].pageX - $(canvas).offset().left;
						var y = e.touches[0].pageY - $(canvas).offset().top;
						ctx.save();
						ctx.globalCompositeOperation = 'destination-out';
						ctx.beginPath();
						ctx.arc(x, y, radius, 0, Math.PI * 2, true);
						ctx.fill();
						ctx.restore();
					}
				}, false);
			} else {
				window.onmousedown = function () {
					iskeydown = true;
				}
				window.onmouseup = function () {
					iskeydown = false;
				}
				canvas.onmousemove = function (e) {
					if (iskeydown) {
						var x = e.pageX - $(canvas).offset().left;
						var y = e.pageY - $(canvas).offset().top;
						ctx.save();
						ctx.globalCompositeOperation = 'destination-out';
						ctx.beginPath();
						ctx.arc(x, y, radius, 0, Math.PI * 2, true);
						ctx.fill();
						ctx.restore();
					}
				}
			}
		}
	}
}