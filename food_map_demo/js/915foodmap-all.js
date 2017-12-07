var currentHeight = $(window).height();//当前浏览器高度
var Height = currentHeight-$("#showMoreBtn").height();
//console.log(Height)
$("#container").css("height",Height+"px");

var startY=293,//触摸时的坐标
y, //滑动的距离
aboveY=293; //设一个全局变量记录上一次内部块滑动的位置


//当点击展开更多结果
$("#showMoreBtn").on("click",function(){
	$("#showMoreBtn").hide();//展开更多结果
	$("#showListBox").show();//展示供货商列表
	$("#sidebarRight").hide();//侧边栏
	$("#showListUl").css("top","293px")
	console.log($(".mapListfooter ul").offset().top)
	Height = $(".mapListfooter ul").offset().top;
	$("#container").css("height",Height+"px");
	aboveY=293;
	y=0;
})

//监听用户拖动屏幕事件
document.getElementById("showListBox").addEventListener('touchstart', touchSatrt,false);//拖动开始
document.getElementById("showListBox").addEventListener('touchmove', touchMove,false);//拖动中
document.getElementById("showListBox").addEventListener('touchend', touchEnd,false);//拖动结束
//当拖动的时候显示最终列表



	var showListUl=document.getElementById("showListUl");

	function touchSatrt(e){//触摸
		e.preventDefault();
		var touch=e.touches[0];
		startY = touch.pageY;   //刚触摸时的坐标
	}

	function touchMove(e){//滑动
		 e.preventDefault();
		 var  touch = e.touches[0];
		 y = touch.pageY - startY;//滑动的距离
		//showListUl.style.webkitTransform = 'translate(' + 0+ 'px, ' + y + 'px)';  //也可以用css3的方式
		showListUl.style.top=aboveY+y+"px"; //这一句中的aboveY是inner上次滑动后的位置
		console.log(showListUl.style.top)
		$("#container").css("height",aboveY+y+"px")
		if(aboveY+y<180){
			console.log(1)
			$("#container").hide();
			$(".mapListfooter").hide();
			$(".map-search").hide();
			$(".mapend").show()
			aboveY=293;
			y=0;
		}else if(aboveY+y>450){
			$(".mapListfooter").hide();
			$(".sidebar-right").show();
			$(".foodmapFooter").show();
			$("#supplierDetail").hide();
			Height = $("body").height()-$(".foodmapFooter").height();
			//console.log(Height)
			$("#container").css("height",Height+"px");
			aboveY=293;
			y=0;
		}

	}

	function touchEnd(e){//手指离开屏幕
	  e.preventDefault();
	  aboveY=parseInt(showListUl.style.top);//touch结束后记录内部滑块滑动的位置 在全局变量中体现 一定要用parseInt()将其转化为整数字;

	}//



$(".mapend-banner").on("click",function(){
	$(".mapend").hide();
	$(".foodmapFooter").show();
	$(".map-search").show();
	$("#container").show()
	$(".sidebar-right").show();
	$("#supplierDetail").hide();
	Height = $("body").height()-$(".foodmapFooter").height();
	//console.log(Height)
	$("#container").css("height",Height+"px");
})

//点击右侧
$(".sidebar-right ul li").on("click",function(){
	$(".sidebar-right ul li").removeClass("active")
	$(this).addClass("active")
})