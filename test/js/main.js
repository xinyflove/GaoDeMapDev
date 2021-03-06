var currentHeight = $(window).height();//当前浏览器高度
$('#container').height(currentHeight);

var map, geolocationMarker, currentPosition;
var supplierMarkers = [];
map = new AMap.Map('container',{
    zoom: 18,
});

AMap.plugin(['AMap.ToolBar','AMap.Geolocation'],
  function(){
    map.addControl(new AMap.ToolBar());//集成了缩放、平移、定位等功能按钮在内的组合控件

    /*定位操作开始*/
    var geolocationObj = new AMap.Geolocation({
      enableHighAccuracy: true,//是否使用高精度定位，默认:true
      timeout: 10000,          //超过10秒后停止定位，默认：无穷大
      buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
      zoomToAccuracy: false,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      buttonPosition:'LB'
    });
    map.addControl(geolocationObj);//用来获取和展示用户主机所在的经纬度位置
    geolocationObj.getCurrentPosition();
    AMap.event.addListener(geolocationObj, 'complete', function(data){//返回定位信息
      currentPosition = data.position;//json类型

      getGeocodernAddress(currentPosition);
    });
    AMap.event.addListener(geolocationObj, 'error', function(data){//返回定位出错信息
      alert('定位失败');
    });
    /*定位操作结束*/
  }
);

// 监听热点点击
map.setStatus({isHotspot: true});
map.on("hotspotclick", function(e) {
  console.log(e.lnglat);
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

  getGeocodernAddress(e.lnglat);
});

/**
 * 获取定位的地址信息
 * @param  {[obj]} posi [description]
 * @return {[type]}      [description]
 */
function getGeocodernAddress(posi){
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

        //获取根据当前定位信息的供货商数据
        getSupplierList(posi, address);
      }
  });
}

/**
 * 生成公共marker方法
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
    })
  });
}

/**
 * 根据位置信息获取供货商数据
 * @param  {[obj]} posi [description]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
function getSupplierList(posi, name)
{
  var _posi = [posi.lng, posi.lat].join(',')

  $.ajax({
    type: "GET",
    url: 'marker.php',
    data: {posi:_posi,name:name},
    dataType: "json",
    success: function(data) {
      //启动时一次加载所有依赖的组件
      AMapUI.loadUI([
        'overlay/SimpleMarker',//引入SimpleMarker，loadUI的路径参数为模块名中 'ui/' 之后的部分
        'overlay/SimpleInfoWindow',//SimpleInfoWindow
        ],
        function(SimpleMarker, SimpleInfoWindow) {
          //....引用加载的UI....
          initPage(SimpleMarker, SimpleInfoWindow, data);//启动页面
      });

      //map.setFitView();//设置地图合适的视角
    },
    error: function(e) {
      //...
      console.log('hava a error');
    }
  });
}



function initPage(SimpleMarker, SimpleInfoWindow, data) {
  var iconTheme = 'fresh';//图标主题
  var iconStyles = SimpleMarker.getBuiltInIconStyles(iconTheme);//内置的样式
  
  if(supplierMarkers){
    map.remove(supplierMarkers);//删除之前的供货商marker
  }

  for(var i = 0; i < data.length; i += 1){
    data[i].iconTheme = iconTheme;
    data[i].iconStyle = 'darkyellow';

    var simpleMarker = createSimpleMarker(SimpleMarker, data[i]);
    supplierMarkers.push(simpleMarker);
    simpleMarker.data=data[i];
    simpleMarker.SimpleInfoWindow=SimpleInfoWindow;
    simpleMarker.on('click',markerClick,{msg:123});
  }
  //map.setFitView();
}

/**
 * 创建Marker
 * @param  {[type]} SimpleMarker [description]
 * @param  {[type]} data         [description]
 * @return {[type]}              [description]
 */
var createSimpleMarker = function(SimpleMarker, data) {
  //创建SimpleMarker实例
  var simpleMarker =  new SimpleMarker({
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

  return simpleMarker;
}

/**
 * marker点击事件函数
 * @param  {[type]} e [description]
 * @return {[type]}   [description]
 */
function markerClick(e){
  $('#container').height(currentHeight-$('#shopInfoBox').height());
  $('.shop-info-name').text(e.target.data.name);
  $('.shop-info-img img').prop('src', e.target.data.img);
  var priceDom = '￥' + e.target.data.price;
  if(e.target.data.del) priceDom += '<del>￥' + e.target.data.del
  
  $('.shop-info-price').html(priceDom);
  $('.shop-info-addr').text(e.target.data.addr);
  //console.log(e);
  //map.setCenter(e.target.getPosition());
}


