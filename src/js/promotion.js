;function promotion(ele, opts) {
    var self = this;
    self.width = opts.width || 950;
    self.height = opts.height || 80;
    self.source = opts.source || {
        src1: [1, "img/pic1.gif", "http://ele.me/activity/49-10-gz"]
    };
    self.duration = opts.duration || 1000;
    self.delay = opts.delay || 4000;

    var ul = ele.append('<ul></ul>').find('ul');
    var ol = ele.append('<ol></ol>').find("ol");
    var num = self.source;
    var nums = 0;
    var nowPic = 1;
    var time1;
    var loaded = 0;
    ele.css({
        'width': self.width,
        'height': self.height
    });
    for (each in num) {
        ul.append("<li class='picture'><a target='_blank' href='" + num[each][2] + "' alt=''><img class='preload' src='" + num[each][1] + "' alt='' /></a></li>");
        ol.append("<li class='number number" + (nums + 1) + "'>" + num[each][0] + "</li>");
        nums++;
    };
    ol.find('.number' + nowPic).addClass('selected');
    ele.find('.preload').each(function() {
        this.addEventListener('load', function() {
            loaded++;
            if (loaded === nums) {
                interval();
                ele.addClass('loaded');
            };
        });
    });
    ol.find('.number').on('click', function() {
        clearInterval(in1);
        clearTimeout(time1);
        ol.find('.number').removeClass('selected');
        nowPic = $(this).index() + 1;
        ol.find('.number' + nowPic).addClass('selected');
        ul.animate({
            'top': -(nowPic - 1) * self.height
        }, self.duration);
        time1 = setTimeout(function() {
            interval();
        }, 2000);
    });

    function interval() {
        in1 = setInterval(function() {
            if (nowPic === nums) {
                nowPic = 0;
            };
            ul.animate({
                'top': -nowPic * self.height
            }, self.duration);
            ol.find('.number').removeClass('selected');
            nowPic++;
            ol.find('.number' + nowPic).addClass('selected');
        }, self.delay);
    }
}