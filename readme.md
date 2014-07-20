###### 	杜小东 东南大学数学系 2014.7.19
######	邮箱： reduxiaodong@gmail.com
######	电话： +86 186-5189-2172

######	更新	: 2014.7.20
--	更改预加载loading实现方式，更能反映图片张数和json文件个数的加载情况
--	开始去学习node.js

### 文件说明
--	src里为源代码，使用jquery库(v1.11.1)

--	采用异步加载json数据的方法，需要在(本地)服务器下正常访问或者访问 http://duxiaodong.org/ele/
	--	loading时间过长请刷新页面

--	兼容性：	IE9/10/11 chrome(36.0.1985.125 m) firefox(30.0)
	--	IE8好像很崩溃应该要解决需要不少时间且小游戏需要canvas
	--	IE bug:	用鼠标滚轮滚动会使得position: fixed 定位的元素忽闪忽闪的，没有找到解决方案
		--	参考链接
			--	https://connect.microsoft.com/IE/feedback/details/821953/ie10-ie11-fixed-background-images-move-when-touched-scrolled
			--	http://stackoverflow.com/questions/22165129/issue-in-ie-11-fixed-background-move-up-down-with-scroll
			--	http://social.msdn.microsoft.com/Forums/ie/en-US/9567fc32-016e-48e9-86e2-5fe51fd67402/new-bug-in-ie11-scrolling-positionfixed-backgroundimage-elements-jitters-badly?forum=iewebdevelopment	

### ele网页
--	感叹号(!)标记的条目为相对重要

-- 	判断是否为桌面版本，如果为手机或者平板则直接链出 http://m.ele.me/

--	谁去拿外卖小游戏：

!!!	--	新小游戏，通过类似刮奖的方式决定谁去（暂时四个刮刮卡）
	--	自适应， 小游戏窗口在 宽度x高度 = (320px -- 1366px)x(370px -- 700px)显示良好
			-- 在宽度 = 768px(ipad)附近宽度改变

--	新增：

!!	--	由于页面数据较多，新增预加载loading页面。
		--	实现方式是判断json数据加载和幻灯片组件的图片加载(并不能完全反映页面真实加载情况)
		--	如果碰到loading时间过长，可能是json加载中计数器的问题。重新刷新页面即可

-- 	导航栏:

	--	将导航栏固定在窗口顶端，方便用户直接搜索和进行其他操作
		--	搜索输入框 采用$.ajax()，未能访问到数据，所以不具备搜索功能
		--	购物车不具备相应功能

--	背景：

	--	6月- 9月： 6：00 - 20：00 白天背景(太阳，浅色) 其余时间 夜晚背景(星星，月亮，深色)
	--	10月 - 5月： 7：00 - 18：00 白天背景(太阳，浅色) 其余时间 夜晚背景(星星，月亮，深色)
		--	好像页面有黄昏背景。。。

--	幻灯片切换组件： 

	--	使用方法： 
		--	var promotion = new promotion(ele, {
				width: ...,
				height: ...,
				source: {
					url1: ...,
					url2: ...,
					..........
				},
				duration: ...,
				delay: ...
			});
			其中 ele 为jquery对象

		--	幻灯片页数由source的url地址决定 
		--	每次切换时间和间隔时间分别由duration和delay决定
!		--	幻灯片循环播放
!		--	支持鼠标选择相应幻灯片，鼠标选择时，幻灯片停止播放，鼠标未做操作后2s幻灯片自动有当前页开始循环播放

--	我的收藏 不具备相应功能

--	主要部分：

	--	分为品牌馆(popRestaurant.json), 主要餐厅(mainRestaurant.json), 附近团购(tuangou.json), 更多餐厅(mamRestaurant.json) 四个部分
!	--	都采用$.getJSON()方法
!	--	json数据由自己根据给定url页面编写(真是一项体力活)，数据不完全和不准备难以避免

	--	取消原页面的鼠标悬停在送餐时间上的文字提示
		--	(原因： 页面信心量较大，布局较拥挤)

!	--	原页面详细信息悬浮窗的【维他】信息时有重复
		--	改为取消重复

!	--	原页面详细信息悬浮窗的信息经常出现被浏览器下端切，且由于鼠标置于悬浮窗上信息消失导致无法查看
		--	1.与原方案相同(超级难看到被切部分); 2.鼠标置于悬浮窗上信息不消失(很难选到被悬浮窗遮挡的餐厅);
		--	最终选择方案1(通过在src/js/app.js里616行添加或者删除 initMoreInfo($myRestaurant); 语句切换)

!	--	取消餐厅名字前的【维他】字样，并未曲线详细信息悬浮窗里餐厅名字前的
		--	(原因： 文字占用面积大，餐厅名称难以辨识)

	--	主要餐厅：
		--	原页面热门餐厅和营业中只能二选其一
			--	改为可以同时选中

		--	原页面四个选择框在口味为非全部的时候 不能全部取消
			--	改为可以全部取消，若全取消则显示所有餐厅

		--	原页面在选择全部口味的时候 四个选择框若都未被选中， 则默认选择热门餐厅
			--	改为显示所有餐厅

!		--	原页面起送价滑块三级跳跃跳动显得比较突兀
			--	改为平滑滑动


###	个人建议

--	ele.me 	
!!!	--	页面整体设计比较拥挤，用户密集恐惧，选择困难
		--	建议去除更多更多餐厅板块，直接将其隐藏在主要餐厅板块后，通过交互可以显示出来
			--	太晚想到，未能实现

!!!	--	把每个餐厅的占用面积调大，做成自适应的撑满整个网页；
		--	这样既能做到对大分辨率屏幕不浪费空间，也能照顾到小分辨率的屏幕，由于每个格子的面积增大了，用户体验上也有所加强
			--	需要更改大部分图片尺寸且需要专业设计师设计，我是程序，未能实现

!!	--	采用自适应的好处还有mobile版和desktop版可以统一在一起，这样能增加统一性。

--	m.ele.me
	--	点击区域的文字较小，难以点击精确
		--	建议将每个点击区域调大到47x47;
			--	美帝某知名大学研究得出的结论，基于手指平均宽度为55px左右

!!!	--	页面分页显示难以接受，改为单页显示(像APP一样)
		--	这个原因好奇怪，大家都习惯了滑动而非点击； 并且滑动还能滑回去，避免页面跳转中可能会有的无法显示给用户带来不安。


###	为什么是前端

--	我是个比较新的人，第一次听说‘前端’这个次也比较晚，大三时候在阿里巴巴的宣讲会上知道了网页工作有前端和后端的分别。
--	后来感到大学里什么也没学到有点捉急以后怎么办的情况下‘很感兴趣’的去了解了前端。
--	后来我还真的来了兴趣，主要有3点：
	--	1.为了生计，javascript比较容易上手
	--	2.网页相对于客户端的跨越性简直好到令人发指，而前端相对于后端的多种的语言来讲相对统一
	--	3.最最重要的，前端的未来是很巨大的。现在整个前端技术都还在2.45D时代，却已经能做到很多高大上，炫酷的事情，如谷歌地图(map.google.com),哎呀，瑞士航空那个掉渣天的网站不见了。 
	--	3.以后网速给劲，消灭客户端程序不是梦想。


###	补充

--	贵公司真是财大气粗，一下子就深深地吸引了我。
--	我有过半年html5程序实习经历(南京酷都软件公司http://www.fancypantsgroup.com/)
--	虽然绝大部分时间内都是自己玩自己的，但也接触了不少高大的东西，多种广告平台(undertone, doubleclick等)
--	自适应的练习做的比较多，整个网页从大屏过渡到iphone4的320x373的小屏幕。都是desktop, tablet, mobile一体平缓过渡。

--	只是我大学经历不怎么光彩，这个在简历里有说明，为了让这个文档看起来好看，我还是再说一下吧。。
--	现在应该算留级生了， (COMPLEX ANALYSIS)真是难玩

--	好像有什么重要的内容忘记了
--	外卖这块真是太有钱途了，对于我这样贪吃的人来讲，要是能在这样的公司上班真是天赐的缘分啊。。 
--	等这块管理更合理，创新，线上线下很有感觉。 未来，ele.me账户必将成为类似支付宝那样的必要存在。
--	凑一行到150吧， 我好饿，给点吃的吧~~~ 求面试-->工作机会