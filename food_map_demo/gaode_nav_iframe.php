<?php
$output = $_GET;
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
    <title>路径规划</title>
</head>
<style>
    body, #mapContainer{
        margin:0;
        height:100%;
        width:100%;
        text-align: center;
        font-size:12px;
        position: absolute;
    }
</style>
<body>

<div id="mapContainer" style="">

</div>

<!-- 引入高德地图JSAPI -->
<script src="https://webapi.amap.com/maps?v=1.4.0&key=a1dcdbc51efa1e086a14706ffa12a61a"></script>
<script>
    var map = new AMap.Map('mapContainer',{
        zoom: 18,
    });
    //步行导航
    AMap.service(["AMap.Walking"], function() {
        var walking = new AMap.Walking({
            map: map
        }); //构造路线导航类

        var _origin = "<?php echo $output['origin'];?>".split(',');
        var _destination = "<?php echo $output['destination'];?>".split(',');

        walking.search([_origin[0],_origin[1]], [_destination[0],_destination[1]], function(status, result){
            walking.searchOnAMAP({
                origin: result.origin,
                destination: result.destination
            });
        });
    });
</script>
</body>
</html>

