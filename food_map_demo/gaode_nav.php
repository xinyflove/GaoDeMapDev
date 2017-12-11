<?php
$output = $_GET;
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />

    <title>路径规划</title>
    <link rel="stylesheet" type="text/css" href="font/iconfont.css"/>
    <link rel="stylesheet" type="text/css" href="css/public.css"/>
    <style type="text/css">
        .mapend-header{
            background: #fff;
            width: 100%;
            height: 45px;
            border-bottom: 1px solid #f0f0f0;
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
        .mapend-header h1{
            float: left;
            font-size: 17px;
            height: 45px;
            line-height: 45px;
            margin-left: 40%;
        }
        .mapend-header i{
            float: right;
            width:17.5px;
            height:17.5px;
            margin-right: 10px;
            margin-top: 4%;
        }
        .mapend-header i img{
            width:100%;
            height:100%;
        }
        iframe{
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
<div class="mapend">
    <div class="mapend-header">
        <span><img src="img/left.png" onclick="javascript:history.go(-1);"/></span><h1>路径规划</h1><i><!--<img src="img/search.png"/></i>-->
    </div>
    <div class="mapend-ifrem">
        <iframe src="./gaode_nav_iframe.php?key=<?php echo $output['key'];?>&origin=<?php echo $output['origin'];?>&destination=<?php echo $output['destination'];?>" frameborder="0"></iframe>
    </div>
</div>
<script src="https://cdn.bootcss.com/jquery/2.0.0/jquery.min.js"></script>
<!-- 引入高德地图JSAPI -->
<script src="https://webapi.amap.com/maps?v=1.4.0&key=a1dcdbc51efa1e086a14706ffa12a61a"></script>
<script type="text/javascript" charset="utf-8">
    var Height2 = $("body").height()-$(".mapend-header").height();
    $('.mapend-ifrem').css("height",Height2+"px")
</script>
</body>
</html>

