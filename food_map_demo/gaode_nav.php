<?php
$output = $_GET;
$output['map_key'] = 'a1dcdbc51efa1e086a14706ffa12a61a';
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />

    <title></title>
    <link rel="stylesheet" type="text/css" href="font/iconfont.css"/>
    <link rel="stylesheet" type="text/css" href="css/public.css"/>
    <style type="text/css">
        .mapend-header{
            background: #fff;
            width: 100%;
            height: 45px;
            border-bottom: 1px solid #f0f0f0;
            position: relative;
        }
        .mapend-header span{
            float: left;
            width:10px;
            height:20px;
            margin-left: 10px;
            margin-top: 4%;
        }
        .mapend-header span img{
            width:100%;
            height:100%;
        }
        .mapend-header p{
            width: 80%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 10%;
            padding: 0 10%;
        }
        .mapend-header p i{
            width: 25%;
            height: 100%;
            display: block;
            float: left;
            text-align: center;
            font-size: 22px;
            padding-top: 10px;
        }
        .mapend-header p .active{
            width: 25%;
            height: 100%;
            display: block;
            float: left;
            text-align: center;
            font-size: 22px;
            padding-top: 10px;
            color: #1b8fe6;
        }
        .mapend-header p i:first-child{
            width: 25%;
            height: 100%;
            display: block;
            float: left;
            text-align: center;
            font-size: 23px;
            padding-top: 10px;
        }
        .iconfont {
            width: 33%!important;
        }
    </style>
</head>
<body>
<div class="mapend">
    <div class="mapend-header">
        <span><img src="img/left.png" onclick="javascript:history.go(-1);"/></span>
        <p>
            <i class="iconfont icon-jiache1" onclick="driving();"></i>
            <i class="iconfont icon-gongjiao" onclick="bus();"></i>
            <i class="iconfont icon-buhang active" onclick="walk();"></i>
            <!--<i class="iconfont icon-ic_directions_bike_px"></i>-->
        </p>
    </div>
    <div class="mapend-ifrem" id="container"></div>
    <a href="javascript:buildGaoDeNav();" style="display: block;position: fixed;bottom: 10%;background: blue;color: #fff;">调起高德地图</a>
</div>
<!-- 引入jquery -->
<script src="https://cdn.bootcss.com/jquery/2.1.1/jquery.min.js"></script>
<!-- 引入高德地图JSAPI -->
<script src="https://webapi.amap.com/maps?v=1.4.0&key=<?php echo $output['map_key'];?>"></script>
<!-- UI组件库 1.0 -->
<script src="https://webapi.amap.com/ui/1.0/main.js?v=1.0.11"></script>

<script type="text/javascript" charset="utf-8">
    var Height2 = $("body").height()-$(".mapend-header").height();
    $('.mapend-ifrem').css("height",Height2+"px")
    $(".mapend-header").find("i").on("click",function(){
        $(".mapend-header").find("i").removeClass("active")
        $(this).addClass("active")
    })
</script>

<script>
    var map = new AMap.Map("container", {
        resizeEnable: true,
        zoom: 13 //地图显示的缩放级别
    });

    //加载地图插件
    AMap.plugin(['AMap.ToolBar','AMap.Geolocation','AMap.Geocoder'],
        function(){
            map.addControl(new AMap.ToolBar());//集成了缩放、平移、定位等功能按钮在内的组合控件

            map.addControl(new AMap.Geolocation());
        }
    );

    var city;
    map.getCity(function(data) {
        if (data['province'] && typeof data['province'] === 'string') {
            city = data['city'] || data['province'];
        }
    });

    var origin_posi_arr = "<?php echo $output['origin'];?>".split(',');
    var destination_posi_arr = "<?php echo $output['destination'];?>".split(',');
    var origin_posi = new AMap.LngLat(origin_posi_arr[0], origin_posi_arr[1]);
    var destination_posi = new AMap.LngLat(destination_posi_arr[0], destination_posi_arr[1]);

    walk();

    function driving() {
        map.clearMap();
        //document.getElementById('panel').innerText = '';
        //构造路线导航类
        AMap.service(["AMap.Driving"], function() {
            var driving = new AMap.Driving({
                map: map,
                //panel: "panel"
            });
            // 根据起终点名称规划驾车导航路线
            driving.search(origin_posi, destination_posi,function(status, result) {
                console.log(status);
                console.log(result);
                map.setFitView();
            });
        });
    }

    function walk() {
        map.clearMap();
        //document.getElementById('panel').innerText = '';
        //步行导航
        AMap.service(["AMap.Walking"], function() {
            var MWalk = new AMap.Walking({
                map: map,
                //panel: "panel"
            }); //构造路线导航类
            //根据起终点坐标规划步行路线
            //MWalk.search([116.379028,39.865042], [116.427281,39.903719], function(status, result){
            MWalk.search(origin_posi, destination_posi, function(status, result) {
                console.log(status);
                console.log(result);
                map.setFitView();
            });
        });
    }

    function bus() {
        map.clearMap();
        //document.getElementById('panel').innerText = '';
        /*
         * 调用公交换乘服务
         */
        //加载公交换乘插件
        AMap.service(["AMap.Transfer"], function() {
            var transOptions = {
                map: map,
                city: city,
                policy: AMap.TransferPolicy.LEAST_TIME //乘车策略
            };
            //构造公交换乘类
            var trans = new AMap.Transfer(transOptions);
            //根据起、终点坐标查询公交换乘路线
            trans.search(origin_posi, destination_posi, function(status, result){
                console.log(status);
                console.log(result);
                if(result.info == 'NO_DATA'){
                    alert('距离太近，请用步行导航');
                    walk();
                    return false;
                }
                map.setFitView();
            });
        });
    }
</script>

<script>
    function buildGaoDeNav() {
        //步行导航
        AMap.service(["AMap.Walking"], function() {
            var walking = new AMap.Walking({
                map: map
            }); //构造路线导航类

            var _origin = "<?php echo $output['origin'];?>".split(',');
            var _destination = "<?php echo $output['destination'];?>".split(',');

            walking.search(origin_posi, destination_posi, function(status, result){
                walking.searchOnAMAP({
                    origin: result.origin,
                    destination: result.destination
                });
            });
        });
    }
</script>
</body>
</html>
