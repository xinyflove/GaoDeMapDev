<?php

$shop_list = array(
	array(
		"name" => "乐客城",
		"center" => "120.426574,36.160259",
		'img' => 'img/food_01.jpg',
		'price' => 120,
		'del' => 100,
		'addr' => '乐客城地址',
	),
	array(
		"name" => "和谐广场",
		"center" => "120.424342,36.162251",
		'img' => 'img/food_01.jpg',
		'price' => 120,
		'del' => 100,
		'addr' => '和谐广场地址',
	),
);

//echo json_encode($shop_list);
echo json_encode(getGridLngLats($_GET['posi']));

function getGridLngLats($center)
{
	$_num = 4;
	$_posi = explode(',', $center);

	$_markers = array();
	for ($i=0; $i < $_num; $i++) {
		$_lng = $_posi[0]+rand(100,500)*0.000001;//
		$_lat = $_posi[1]+rand(100,500)*0.000001;//
		$_markers[] = implode(',', array($_lng, $_lat));
	}

	$data = array();
	foreach ($_markers as $k => $v) {
		$data[] = array(
			"name" => "和谐广场".$k,
			"center" => $v,
			'img' => 'img/tupian.png',
			'price' => 120,
			'del' => 100,
			'addr' => $_GET['name'].'内'.$k.'米',
		);
	}

	return $data;
}