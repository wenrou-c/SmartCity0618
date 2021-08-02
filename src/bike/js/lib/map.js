//百度地图API功能
var map = new BMap.Map("map");    //创建Map实例
map.centerAndZoom(new BMap.Point(116.403963, 39.915119), 12);  // 初始化地图,设置中心点坐标和地图级别，北京-天安门
map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
var geolocation = new BMap.Geolocation();          //实例化
// var theLng = 114.40454339;
// var theLng1 = 114.40884339;
// var theLat = 30.46244226;
// var theLat2 = 30.46264226;

var mapIndex = 0;
window.addEventListener('message', function (event) {
    //event.data获取传过来的数据
    mapIndex = event.data;
    console.log(mapIndex);

    if (mapIndex == '3') {
        console.log(mapIndex)
        console.log('1')
        geolocation.getCurrentPosition(function (r) {        //获取当前位置方法
            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                lng = r.point.lng
                lat = r.point.lat
                // console.log('您的位置：' + lng + ',' + lat);
                // console.log('您的转换位置：' + gps2new1(String(lng)) + ',' + gps2new(String(lat)));
                // 114.40654339,30.46244226
                new_point = new BMap.Point(gps2new1(String(lng)), gps2new(String(lat)));
                marker = new BMap.Marker(new_point);  // 创建标注
                map.addOverlay(marker);              // 将标注添加到地图中
                map.panTo(new_point);

                //单车1
                // pt1 = new BMap.Point(theLng, theLat);
                // myIcon1 = new BMap.Icon("img/ofo.png", new BMap.Size(32, 32));
                // marker2 = new BMap.Marker(pt1, { icon: myIcon1 });  // 创建标注
                // map.addOverlay(marker2);              // 将标注添加到地图中
                // map.panTo(pt1);

                // marker2.addEventListener("click", function () {
                //     // Bg.style.display = "block";
                //     $("#ofoSet").css("display", "block");
                //     ofoFlay = 1;
                // });

                // //单车2
                // pt2 = new BMap.Point(theLng1, theLat2);
                // myIcon2 = new BMap.Icon("img/ofo.png", new BMap.Size(32, 32));
                // marker3 = new BMap.Marker(pt2, { icon: myIcon2 });  // 创建标注
                // map.addOverlay(marker3);              // 将标注添加到地图中
                // map.panTo(pt2);

                // marker3.addEventListener("click", function () {
                //     // Bg.style.display = "block";
                //     $("#ofoSet").css("display", "block")
                //     ofoFlay = 2;
                // });

            }
            else {
                alert('failed' + this.getStatus());
            }
        }, { enableHighAccuracy: true })
    }
});

// 添加带有定位的导航控件
var navigationControl = new BMap.NavigationControl({
    // 靠左上角位置
    anchor: BMAP_ANCHOR_TOP_LEFT,
    // LARGE类型
    type: BMAP_NAVIGATION_CONTROL_LARGE,
    // 启用显示定位
    // enableGeolocation: true
});
map.addControl(navigationControl);

//纬度转码
function gps2new(num) {
    var arr = num.split(".");
    var num2 = arr[1] / 12.56555 + "";
    var txt = num2.split(".")[0] + num2.split(".")[1];
    if (arr[1].split('')[0] == "0") {
        var oldtxt = arr[0] + "." + "0" + parseFloat(txt);
    } else {
        var oldtxt = arr[0] + "." + parseFloat(txt);
    }
    var newtxt = parseFloat(oldtxt).toFixed(8);
    return newtxt;
}
//经度转码
function gps2new1(num) {
    var arr = num.split(".");
    var num2 = arr[1] / 77.7777 + "";
    var txt = num2.split(".")[0] + num2.split(".")[1];
    if (arr[1].split('')[0] == "0") {
        var oldtxt = arr[0] + "." + "0" + parseFloat(txt);
    } else {
        var oldtxt = arr[0] + "." + parseFloat(txt);
    }
    var newtxt = parseFloat(oldtxt).toFixed(8);
    return newtxt;
}


// var loadCount = 0; 
// map.addEventListener("tilesloaded", function () {
//     if (loadCount == 1) {
//         map.setCenter(new_point);
//     }
//     loadCount = loadCount + 1;
// });
