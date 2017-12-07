//创建地图
    	var map = new AMap.Map('container',{
            resizeEnable: true,
            zoom: 13,
            center: [120.33, 36.07],
            isHotspot: true,
            mapStyle: 'amap://styles/macaron',
        });
//      AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {
//
//	        //添加一个缩放控件
//	        map.addControl(new BasicControl.Zoom({
//	            position: 'lt'
//	        }));
//	
//	        //图层切换控件
//	        map.addControl(new BasicControl.LayerSwitcher({
//	            position: 'rt'
//	        }));
//	    });
	    map.plugin('AMap.Geolocation', function () {
		    geolocation = new AMap.Geolocation({
		        enableHighAccuracy: true,//是否使用高精度定位，默认:true
		        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
		        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
		        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
		        showButton: true,        //显示定位按钮，默认：true
		        buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
		        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
		        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
		        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
		        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
		        zoomToAccuracy:false      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
		    });
		    map.addControl(geolocation);
		    geolocation.getCurrentPosition();
		    AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
		});
		
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
			console.log($(".mapListfooter ul").offset().top)
			Height = $(".mapListfooter ul").offset().top;
			$("#container").css("height","293px");
			$("#target").css("transform","translate3d(0,0,0)")
			dy=0
			
		})
		
		
		//当拖动的时候显示最终列表
		
			touch.on("#target","touchstart",function(ev){
				ev.preventDefault();
			})
			touch.on("#target","drag",function(ev){
				ev.preventDefault();
				var locy=dy+ev.y+"px";
				console.log("locy="+locy)
				console.log("ev.y="+ev.y)
				console.log("dy="+dy)
				$("#container").css("height",293+dy+ev.y+"px");
				$("#target").css("transform","translate3d(0,"+locy+",0)")
				if(293+dy+ev.y<180){
                	console.log(1)
                	$("#container").hide();
                	$(".mapListfooter").hide();
                	$(".map-search").hide();
                	$(".mapend").show()
                	aboveY=293;
                	y=0;
                	locy=0
                	dy=0
                }else if(293+dy+ev.y>450){
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