var map = new BMap.Map('map');
map.centerAndZoom(new BMap.Point(114.406322,30.461976), 15);
map.enableScrollWheelZoom(true);
//添加地图类型控件
map.addControl(new BMap.MapTypeControl({
    mapTypes: [
        BMAP_NORMAL_MAP,
        BMAP_HYBRID_MAP
    ]
}));

//小车坐标
var mapData = [{
        lng: 114.415122,
        lat: 30.462345,
    },
    {
        lng: 114.414564,
        lat: 30.473454,
    },
    {
        lng: 114.390345,
        lat: 30.476232,
    },
    {
        lng: 114.389997,
        lat: 30.463122,
    },
    {
        lng: 114.406919,
        lat: 30.456379,
    },
    {
        lng:114.420433,
        lat: 30.463603,
    },
    {
        lng:114.430433,
        lat: 30.470603,
    },
    {
        lng:114.435433,
        lat: 30.458603,
    },
    {
        lng:114.419433,
        lat: 30.465603,
    },
    {
        lng:114.400433,
        lat: 30.471603,
    },
    {
        lng:114.444758,
        lat: 30.448085,
    },
    {
        lng:114.445483,
        lat:30.453055,
    },
    {
        lng:114.45555,
        lat:30.438466,
    },
    {
        lng:114.454319,
        lat:30.458797,
    },
    {
        lng:114.456703,
        lat:30.451502,
    },
    {
        lng:114.426333,
        lat:30.444446,
    },
    {
        lng:114.427578,
        lat:30.449007,
    },
]
//循环建立标注点
for (var i = 0; i < mapData.length; i++) {
    // 创建小车图标
    var myIcon = new BMap.Icon("img/car.png", new BMap.Size(52, 52));
    // 创建Marker标注，
    var point = new BMap.Point(mapData[i].lng, mapData[i].lat);
    // console.log(point);
    addMarker(point);
}

// 编写自定义函数,创建标注
function addMarker(point) {
    //使用小车图标
    var marker = new BMap.Marker(point, {
        icon: myIcon
    });
    //将标注点添加到地图上
    map.addOverlay(marker);
    var opts = {
        title : "车辆状态：待预约" , // 信息窗口标题
      }
      var infoWindow = new BMap.InfoWindow("经度:"+point.lng+" 纬度:"+point.lat, opts);  // 创建信息窗口对象 
      marker.addEventListener("click", function(){          
          map.openInfoWindow(infoWindow,point); //开启信息窗口
         
      });
      marker.enableDragging(); // 标注点可拖拽
    //   console.log(map.getCenter());
     
}



