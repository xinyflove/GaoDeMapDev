<?php
$output = [];
$output['map_key'] = 'a1dcdbc51efa1e086a14706ffa12a61a';
?>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
		
		<title>915美食地图</title>
		<link rel="stylesheet" type="text/css" href="font/iconfont.css"/>
		<link rel="stylesheet" type="text/css" href="css/public.css"/>
		<link rel="stylesheet" type="text/css" href="css/915foodmap-all.css"/>
		<link rel="stylesheet" type="text/css" href="css/915map-live.css"/>
		<link rel="stylesheet" type="text/css" href="css/loaders.css"/>
		<link rel="stylesheet" href="css/main.css">
		
		<style type="text/css">
			
		</style>
	</head>
	<body>

		<div class="wapper" id="loadBox">
			<div class="loader">
				<div class="loader-inner line-spin-fade-loader">
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
					<div></div>
				</div>
			</div>
			<p>正在加载中，请稍后。。。</p>
		</div>
		
		<!-- 地图展示区开始 -->
		<div id="container" class="container"></div>
		<!-- 地图展示区结束 -->
		
		<!-- 侧边栏开始 -->
		<div class="sidebar-right" id="sidebarRight">
			<ul>
				<li data-type="all" class="active"><i class="iconfont icon-quanbu"></i></li>
				<li data-type="food"><i class="iconfont icon-meishi"></i></li>
				<li data-type="activity"><i class="iconfont icon-huodong"></i></li>
				<li data-type="live"><i class="iconfont icon-zhibo"></i></li>
			</ul>
		</div>
		<!-- 侧边栏结束 -->
		
		<!-- 搜索框开始 -->
		<div class="map-search" id="mapSearch">
			<div class="map-search-input">
				<div class="map-search-input-img">
					<img src="img/left.png"/>
				</div>
				<input type="text" name="" id="searchWord" value="" placeholder="请输入美食关键词"/>
			</div>
			<div class="map-search-btn">
				<img src="img/search.png" id="searchBtn"/>
			</div>
		</div>
		<!-- 搜索框结束 -->
		
		<!-- 展开更多结果按钮开始 -->
		<div class="foodmapFooter" id="showMoreBtn">点击展开更多结果</div>
		<!-- 展开更多结果按钮结束 -->
		
		<!-- 展示供货商列表开始 -->
		<div class="mapListfooter" id="showListBox">
			<ul id="target" draggable="true" class="supplier-list"></ul>
		</div>
		<!-- 展示供货商列表结束 -->
		
		<!-- 展示供货商更多列表开始 -->
		<div class="mapend" id="showListMoreBox">
            <div class="mapend-top">
                <div class="mapend-header">
                    <span><img src="img/left.png"/></span><h1>美食</h1><i><img src="img/search.png"/></i>
                </div>
                <div class="mapend-screen">
                    <ul>
                        <li>
                            <select name="">
                                <option value="">全部分类</option>
                            </select>
                        </li>
                        <li>
                            <select name="">
                                <option value="">5000米</option>
                            </select>
                        </li>
                        <li>
                            <select name="">
                                <option value="">智能排序</option>
                            </select>
                        </li>
                    </ul>
                </div>
                <div class="mapend-banner">
                    <img src="img/banner.png"/>
                </div>
                <div class="mapend-list-title">
                    <h2 id="locationInfo"></h2>
                    <img src="img/shuaxin.png" alt="" onclick="reGeolocation();" />
                </div>
            </div>
			<div class="mapend-list">
				<ul id="supplierMore" class="supplier-list"></ul>
			</div>
		</div>
		<!-- 展示供货商更多列表结束 -->
		
		<!-- 供货商详情开始 -->
		<div class="mapLivefooter" id="supplierDetail" style="display: none;">
			<div class="mapLivefooter-top">
				<div class="mapLivefooter-top-left">
					<img src="img/tupian.png" id="detailImg"/>
				</div>
				<div class="mapLivefooter-top-right">
					<img src="img/rose.png" class="mapLivefooter-top-rightPosition" onclick="javascript:openGaoDeNav();"/>
					<h2 id="detailName"></h2>
					<p class="map-liveprice" id="detailPrice"></p>
					<p class="map-livestate"></p>
					<p class="map-livedistance" id="detailAddr"></p>
				</div>
			</div>
			<div class="mapLivefooter-bottom">
				<a href="#">电话</a>
				<a href="javascript:openGaoDeNav();">导航</a>
				<a href="#">立即购买</a>
			</div>
		</div>
		<!-- 供货商详情结束 -->
	<!-- 引入jquery -->
    <script src="https://cdn.bootcss.com/jquery/2.1.1/jquery.min.js"></script>
	<!--华东插件-->
	<script src="https://cdn.bootcss.com/touchjs/0.2.14/touch.min.js"></script>
	<!-- 引入高德地图JSAPI -->
    <script src="https://webapi.amap.com/maps?v=1.4.0&key=<?php echo $output['map_key'];?>"></script>
    <!-- UI组件库 1.0 -->
    <script src="//webapi.amap.com/ui/1.0/main.js?v=1.0.11"></script>

	<!-- 自定义js -->
    <script type="text/javascript" src="js/915foodmap-all.js"></script>
    <script>
        var supplierDataUrl = "./marker.php";
        var iconLocationImg = "img/icon_location.png";
        var openGaoDeNavUrl = "./gaode_nav.php";
		var itemDetailUrl = "./item_detail.php";
    </script>
	<script src="js/main.js"></script>
	</body>
</html>
