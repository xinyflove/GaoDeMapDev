//高度判断
//首次加载时，底部为最矮的点击更多的高度
var Height = $("body").height()-$(".foodmapFooter").height();
//console.log(Height)
$("#container").css("height",Height+"px");





var startY=293,//触摸时的坐标
y, //滑动的距离
aboveY=293; //设一个全局变量记录上一次内部块滑动的位置


//当点击是显示中集列表
var dy = 0;

$(".foodmapFooter").on("click",function(){
	$(".foodmapFooter").hide();
	$(".mapListfooter").show();
	$(".sidebar-right").hide();
	$(".mapListfooter ul").css("top","293px")
	//console.log($(".mapListfooter ul").offset().top)
	Height = $(".mapListfooter ul").offset().top;
	$("#container").css("height","293px");
	$("#target").css("transform","translate3d(0,0,0)")
	dy=0

})


//当拖动的时候显示最终列表

	touch.on("#target","touchstart",function(ev){
		//ev.preventDefault();
	})
	touch.on("#target","drag",function(ev){
		ev.preventDefault();
		var locy=dy+ev.y+"px";
		//console.log("locy="+locy)
		//console.log("ev.y="+ev.y)
		//console.log("dy="+dy)
		$("#container").css("height",293+dy+ev.y+"px");
		$("#target").css("transform","translate3d(0,"+locy+",0)")
		if(293+dy+ev.y<180){
			//console.log(1)
			$("#container").hide();
			$(".mapListfooter").hide();
			$(".map-search").hide();
			$(".mapend").show()
			aboveY=293;
			y=0;
			locy=0
			dy=0
		}else if(293+dy+ev.y>660){
			locy=0
			$(".foodmapFooter").show();
			$(".mapListfooter").hide();
			$(".sidebar-right").show();
			Height = $("body").height()-$(".foodmapFooter").height();
			$("#container").css("height",Height+"px");


		}
	})
	touch.on("#target","dragend",function(ev){
		dy+=ev.y;
	})







$(".mapend-banner").on("click",function(){
	$(".mapend").hide();
	$(".foodmapFooter").show();
	$(".map-search").show();
	$("#container").show()
	$(".sidebar-right").show();
	Height = $("body").height()-$(".foodmapFooter").height();
	//console.log(Height)
	$("#container").css("height",Height+"px");
})

//点击右侧
$(".sidebar-right ul li").on("click",function(){
	$(".sidebar-right ul li").removeClass("active")
	$(this).addClass("active")
})