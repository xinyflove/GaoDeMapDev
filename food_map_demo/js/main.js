var currentHeight = $(window).height();//当前浏览器高度
var showListUl = $('#target');//显示供货商列表信息
var supplierMore = $('#supplierMore');//显示更多供货商列表信息
var map,//地图对象
    geolocationMarker,//定位标注对象
    currentPosition,//当前位置
    currentAddr,//当前位置名称
    supplierPosition,//选中供货商位置
    simpleMarker,//simpleMarker对象
    simpleInfoWindow,//simpleInfoWindow对象
    geolocationObj;//定位对象

var supplierMarkers = [];//供货商标注对象数组
var searchType = 'all';
var page = 1;

map = new AMap.Map('container',{
    zoom: 18,
});

//加载地图插件
AMap.plugin(['AMap.ToolBar','AMap.Geolocation'],
    function(){
        //map.addControl(new AMap.ToolBar());//集成了缩放、平移、定位等功能按钮在内的组合控件

        clickGeolocation();//定位操作
    }
);

//监听热点点击
map.setStatus({isHotspot: true});
map.on("hotspotclick", function(e) {
    if (geolocationMarker) {
        geolocationMarker.setMap(null);//移除上一个热点信息
    }
    geolocationMarker = new AMap.Marker({
        position: e.lnglat,
        map: map,
    });
    // 设置label标签
    geolocationMarker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
        offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
        content: '<div id="geolocationMarker">' + e.name + '</div>'
    });
    map.setCenter(e.lnglat);

    getGeocodernAddress(e.lnglat);//获取定位位置获取位置地址信息
});

//启动时一次加载所有依赖的组件
AMapUI.loadUI([
        'overlay/SimpleMarker',//引入SimpleMarker，loadUI的路径参数为模块名中 'ui/' 之后的部分
        'overlay/SimpleInfoWindow',//SimpleInfoWindow
    ],
    function(SimpleMarker, SimpleInfoWindow) {
        //....引用加载的UI....
        simpleMarker = SimpleMarker;
        simpleInfoWindow = SimpleInfoWindow;
    }
);

//绑定事件
$(function () {
    $('.supplier-list').on('click',"li",function(ev){
        var markerId = $(this).data('markerid');
        supplierInfoClick(supplierMarkers[markerId]);
    });
    $('.amap-geo').on('click',function () {
        $('#loadBox').show();
    })
    $('#searchBtn').on('click',function () {
        //获取供货商数据
        $('#loadBox').show();
        getSupplierList();
    });
});

/**
 * 定位操作开始
 */
function clickGeolocation() {
    $('#loadBox').show();
    geolocationObj = new AMap.Geolocation({
        enableHighAccuracy: true,//是否使用高精度定位，默认:true
        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
        zoomToAccuracy: false,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        buttonPosition:'LB'
    });
    map.addControl(geolocationObj);//用来获取和展示用户主机所在的经纬度位置
    geolocationObj.getCurrentPosition();
    //返回定位信息
    AMap.event.addListener(geolocationObj, 'complete', function(data){
        getGeocodernAddress(data.position);//获取定位位置获取位置地址信息
    });
    //返回定位出错信息
    AMap.event.addListener(geolocationObj, 'error', function(data){
        $('#locationInfo').text('当前位置：定位失败');
        $('#loadBox').hide();
        alert('定位失败');
    });
}

/**
 * 获取定位的地址信息
 * @param  {[obj]} posi [description]
 * @return {[type]}      [description]
 */
function getGeocodernAddress(posi){
    currentPosition = posi;
    getSupplierDataEvent();
    var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: "all"
    });
    geocoder.getAddress(posi, function(status, result) {
        if(status === 'complete' && result.info === 'OK') {
            var address = result.regeocode.addressComponent.building; //返回地址描述
            console.log('当前定位信息');
            console.log(result);
            if(!address){
                address = result.regeocode.pois[0].name;
            }
            if(!address) {
                address = result.regeocode.formattedAddress;
            }

            if(geolocationMarker) {
                geolocationMarker.setMap(null);//移除上一个热点信息
            }
            geolocationMarker = createLocationMarker(posi);
            // 设置label标签
            geolocationMarker.setLabel({//label默认蓝框白底左上角显示，样式className为：amap-marker-label
                offset: new AMap.Pixel(20, 20),//修改label相对于maker的位置
                content: '<div id="geolocationMarker">' + address + '</div>'
            });

            currentAddr = address;
            //获取供货商数据
            getSupplierList();
            $('#locationInfo').text('当前位置：'+address);
        }
    });
}

/**
 * 生成定位marker方法
 * @param  {[obj]} posi [description]
 * @return {[type]}      [description]
 */
function createLocationMarker(posi)
{
    return new AMap.Marker({  //加点
        map: map,
        position: posi,
        icon: new AMap.Icon({
            size: new AMap.Size(31, 54),  //图标大小
            image: "img/icon_location.png",
            imageOffset: new AMap.Pixel(0, 0)
        }),
        offset: new AMap.Pixel(-15, -48),
        zIndex: 110,
    });
}

/**
 * 根据位置信息获取供货商数据
 * @param  {[obj]} posi [description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function getSupplierList()
{
    var _posi = [currentPosition.lng, currentPosition.lat].join(',')
    var searchWord = $("#searchWord").val();
    $.ajax({
        type: "GET",
        url: 'marker.php',
        data: {posi:_posi,name:currentAddr,search_type:searchType,search_word:searchWord,page:page},
        dataType: "json",
        success: function(data) {
            $('#loadBox').hide();
            showListUl.empty();
            supplierMore.empty();

            initMapPage(data);//启动页面
            //map.setFitView();//设置地图合适的视角
        },
        error: function(e) {
            //...
            $('#loadBox').hide();
            console.log('hava a error');
        }
    });
}

/**
 * 地图初始页面
 * @param data
 */
function initMapPage(data) {
    var iconTheme = 'fresh';//图标主题
    var iconStyles = simpleMarker.getBuiltInIconStyles(iconTheme);//内置的样式

    if(supplierMarkers){
        map.remove(supplierMarkers);//删除之前的供货商marker
    }

    for(var i = 0; i < data.length; i += 1){
        data[i].iconTheme = iconTheme;
        data[i].iconStyle = 'darkyellow';

        var sMarker = createSimpleMarker(data[i]);
        supplierMarkers.push(sMarker);

        sMarker.data=data[i];
        sMarker.on('click',markerClick);//添加点击事件
    }

    createSupplier(data);//生成html数据
    createSupplierMore(data);//生成html数据
    //map.setFitView();
}

/**
 * 创建Marker
 * @param  {[type]} data         [description]
 * @return {[type]}              [description]
 */
var createSimpleMarker = function(data) {
  //创建SimpleMarker实例
  var sMarker =  new simpleMarker({
      //前景文字
      //iconLabel: data.name,
      //图标主题
      iconTheme: data.iconTheme,
      //背景图标样式
      iconStyle: data.iconStyle,
      //...其他Marker选项...，不包括content
      map: map,
      position: data.center.split(','),
      label: {
          content: '<p>'+data.name+'</p>',
          offset: new AMap.Pixel(5, 45)
        },
  });

  return sMarker;
}

/**
 * 供货商marker点击事件函数
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
function markerClick(e){
    var _data = [];
    _data['name'] = e.target.data.name;
    _data['img'] = e.target.data.img;
    _data['price'] = e.target.data.price;
    _data['del'] = e.target.data.del;
    _data['addr'] = e.target.data.addr;
    _data['posi'] = e.lnglat;//选择的供货商位置
    showSupplierDetail(_data);
}

/**
 * 供货商列表点击函数
 * @param obj
 */
function supplierInfoClick(obj) {
    var _data = [];
    _data['name'] = obj.data.name;
    _data['img'] = obj.data.img;
    _data['price'] = obj.data.price;
    _data['del'] = obj.data.del;
    _data['addr'] = obj.data.addr;
    _data['posi'] = obj.getPosition();
    showSupplierDetail(_data);
}

/**
 * 展示选中供货商详细数据
 * @param data
 */
function showSupplierDetail(data) {
    var _supplierDetailHeight = $('#supplierDetail').height();
    $('#container').height(currentHeight-_supplierDetailHeight);
    $('#detailName').text(data.name);
    $('#detailImg').prop('src', data.img);
    var priceDom = '<span>￥' + data.price + '</span>';
    if(data.del) priceDom += '<del>￥' + data.del

    $('#detailPrice').html(priceDom);
    $('#detailAddr').text(data.addr);

    $("#container").show();//地图容器
    $("#sidebarRight").show();//侧边栏
    $("#mapSearch").show();//搜索框
    $("#showMoreBtn").hide();//展开更多结果按钮
    $("#showListBox").hide();//展示供货商列表
    $("#showListMoreBox").hide();//展示供货商更多列表
    $("#supplierDetail").show();//供货商详情

    supplierPosition = data.posi;//选择的供货商位置
}

/**
 * 创建供货商数据列表
 * @param list
 */
function createSupplier(list){
	var _html = '';
	for(idx in list){
		_html += '<li data-markerid="'+list[idx].id+'">';
		_html += '<div class="mapListfooter-list-left">';
		_html += '<img src="'+list[idx].img+'"/>';
		_html += '</div>';
		_html += '<div class="mapListfooter-list-right">';
		_html += '<h2>'+list[idx].name+'</h2>';
		var _delPrice = '';
		if(list[idx].del) _delPrice = '<del>￥'+list[idx].del+'</del>';
		_html += '<p class="map-listprice"><span>￥'+list[idx].price+'</span>'+_delPrice+'</p>';
		_html += '<p class="map-liststate">主播直播中</p>';
		_html += '<p class="map-listdistance">'+list[idx].addr+'</p>';
		_html += '</div>';
		_html += '</li>';
	}
					
	showListUl.append(_html);
}

/**
 * 创建供货商数据更多列表
 * @param list
 */
function createSupplierMore(list){
	var _html = '';
	for(idx in list){
		_html += '<li data-markerid="'+list[idx].id+'">';
		_html += '<div class="mapend-list-left">';
		_html += '<img src="'+list[idx].img+'"/>';
		_html += '</div>';
		_html += '<div class="mapend-list-right">';
		_html += '<h2>'+list[idx].name+'</h2>';
		var _delPrice = '';
		if(list[idx].del) _delPrice = '<del>￥'+list[idx].del+'</del>';
		_html += '<p class="mapend-listprice"><span>￥'+list[idx].price+'</span>'+_delPrice+'</p>';
		_html += '<p class="mapend-liststate">主播直播中</p>';
		_html += '<p class="mapend-listdistance">'+list[idx].addr+'</p>';
		_html += '</div>';
		_html += '</li>';
	}

    supplierMore.append(_html);
}

/**
 * 获取供货商数据事件
 */
function getSupplierDataEvent(){
    $("#container").show();//地图容器
    $("#sidebarRight").show();//侧边栏
    $("#mapSearch").show();//搜索框
    $("#showMoreBtn").show();//展开更多结果按钮
    $("#showListBox").hide();//展示供货商列表
    $("#showListMoreBox").hide();//展示供货商更多列表
    $("#supplierDetail").hide();//供货商详情
    
	Height = $("body").height()-$(".foodmapFooter").height();
	$("#container").css("height",Height+"px");
}

/**
 * 创建路径规划路线
 */
function createNavPath() {
    //var s_lnglat = $('#supplierDetail').data('lnglat').split(',');

    //步行导航
    AMap.service(["AMap.Walking"], function() {
        var walking = new AMap.Walking({
            map: map,
            //panel: "panel"
        }); //构造路线导航类

        //根据起终点坐标规划步行路线
        /*walking.search([currentPosition.lng,currentPosition.lat], [sPosi[0],sPosi[1]], function(status, result){
            if(status == 'complete'){
                console.log('路线规划成功!');
            }
            console.log(result);

        });*/

        walking.searchOnAMAP({
            origin:currentPosition,
            destination:supplierPosition
        });
    });
}

/**
 * 调起高德地图导航
 */
function openGaoDeNav() {
    if(openGaoDeNavUrl)
    {
        window.location.href = openGaoDeNavUrl+'&origin='+currentPosition+'&destination='+supplierPosition;
    }
}

/**
 * 刷新定位操作
 */
function reGeolocation() {
    $('#loadBox').show();
    geolocationObj.getCurrentPosition(function (status,result) {

    });
}