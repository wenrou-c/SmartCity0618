var wchart1, wchart2, wchart3, wchart3_2, wchart4, wchart5, wchart6;
var wchart3Flag1 = 0,
    wchart3Flag2 = 0;
var wchart3Num1 = null,
    wchart3Num2 = null;
var wchart3Arr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
// 井盖水位
function rtChart3(option, n) {
    if (n == 1 && wchart3Num1 != null) {
        option.series[0].data.shift();
        option.series[0].data.push(wchart3Num1);
        wchart3.setOption(option);
        wchart3Num1 = null;
    }
    if (n == 2 && wchart3Num2 != null) {
        option.series[0].data.shift();
        option.series[0].data.push(wchart3Num2);
        option.xAxis.data.shift();
        option.xAxis.data.push(new Date().format('h:m:s'));
        wchart3_2.setOption(option);
        wchart3Num2 = null;
    }
}

function chart3(addr) {
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                animation: false
            }
        },
        grid: {
            top: '5%',
            left: '0%',
            right: '5%',
            bottom: '5%',
            containLabel: true
        },
        color: ['#00fdfd'],
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: getXAxisTime(),
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#03b7e0'
                }
            }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 60,
            splitLine: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#03b7e0'
                }
            }
        },
        series: [{
            type: 'line',
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0,150,239,0.6)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(0,253,252,0)'
                        }
                    ], false),
                    shadowColor: 'rgba(53,142,215, 0.9)',
                    shadowBlur: 20
                }
            },
            data: (function() {
                var items = [];
                var len = LEN;
                while (len--) {
                    items.unshift(wchart3Arr[Math.floor(Math.random() * wchart3Arr.length)]);
                }
                return items;
            })()
        }, ]
    };
    var obj = echarts.init(document.getElementById(addr));
    obj.setOption(option);
    window.addEventListener('resize', function() {
        obj.resize();
    });

    if (addr == 'wchart_3') {
        wchart3 = obj;
    } else if (addr == 'wchart_3_2') {
        wchart3_2 = obj;
    }
    setInterval(function() {
        if (wchart3Flag1 == 1) {
            rtChart3(option, 1);
        }
        if (wchart3Flag2 == 1) {
            rtChart3(option, 2);
        } else {
            /* option.xAxis.data.shift();
            option.xAxis.data.push(new Date().format('h:m:s'));
            option.series[0].data.shift();
            option.series[0].data.push((Math.random() * 50).toFixed(2));
            wchart3_2.setOption(option); */
        }
    }, 2000);
}
chart3('wchart_3');
chart3('wchart_3_2');

// 设施井盖角度
// 井盖角度
function chart2(addr, value, max) {
    var title = '井盖角度';
    let outCircleBg = "#37b2ff" //外圈背景
    var progressPercent = 1; //进度条百分比
    if (max) {
        progressPercent = (value / max).toFixed(2);
    }
    var option = {
        title: [{
                text: value + '°',
                y: "40%",
                x: "center",
                textAlign: "left",
                textStyle: {
                    fontSize: 24,
                    color: "#ffffff",
                },
            },
            {
                text: title,
                y: "60%",
                x: "center",
                textStyle: {
                    fontWeight: "normal",
                    fontSize: 12,
                    color: "#45C4FF",
                },
            },
        ],
        series: [{
                type: "gauge",
                radius: "96%",
                startAngle: "225",
                endAngle: "-45",
                splitNumber: "100",
                pointer: { show: false, },
                detail: { show: false, },
                data: [{ value: 1, }, ],
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: [
                            [1, outCircleBg]
                        ],
                        width: 5,
                        opacity: 1,
                    },
                },
                axisTick: { show: false, },
                splitLine: { show: true, length: 20, lineStyle: { color: "#051932", width: 0, type: "solid", }, },
                axisLabel: { show: false, },
            },
            {
                type: "gauge",
                radius: "86%",
                center: ["50%", "50%"],
                pointer: { show: false, },
                axisLine: {
                    lineStyle: {
                        width: 15,
                        color: [
                            [progressPercent,
                                new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                        offset: 0,
                                        color: 'rgba(164,94,246,1)',
                                    }, {
                                        offset: 0.5,
                                        color: 'rgba(95,116,236,1)',
                                    },
                                    {
                                        offset: 1,
                                        color: 'rgba(3,155,218,1)',
                                    }
                                ])
                            ],
                            [1, "transparent"]
                        ],
                    },
                },
                splitLine: { length: 10, lineStyle: { width: 2, color: "none", }, },
                axisTick: { show: false, lineStyle: { width: 1, color: "#ffffff", }, },
                axisLabel: { show: false, color: "rgb(0,191,255)", distance: 5, fontSize: 10, },
                detail: { show: false, },
                itemStyle: { normal: { color: "#FFFFFF", }, },
                data: [{ value: 50, }, ],
                silent: false,
            },
        ],
    }
    var obj = echarts.init(document.getElementById(addr));
    obj.setOption(option);
    window.addEventListener('resize', function() {
        obj.resize();
    });

    if (addr == 'wchart_2') {
        wchart2 = obj;
    } else if (addr == 'wchart_2_2') {
        wchart2_2 = obj;
    }
}
chart2('wchart_2', 0);
chart2('wchart_2_2', 0);

// 历史数据
function chart(addr, xdata, name) {
    var data = [];
    if (xdata) { data = xdata; } else {
        data = [
            [1604989800000, 0],
            [1604991600000, 0],
            [1604993400000, 0],
            [1604995200000, 0],
            [1604997000000, 0],
            [1604998800000, 0],
            [1605002400000, 0],
            [1605004200000, 0],
            [1605006000000, 0],
            [1605007800000, 0],
            [1605009600000, 0],
            [1605011400000, 0],
            [1605013200000, 0],
            [1605015000000, 0],
            [1605016800000, 0],
            [1605018600000, 0],
            [1605020400000, 0],
        ]
    }
    var option = {
        tooltip: {
            trigger: 'axis',
        },
        grid: {
            top: '5%',
            left: '0%',
            right: '5%',
            bottom: '10%',
            containLabel: true
        },
        color: ['#00fdfd'],
        xAxis: [{
            type: 'time',
            axisLine: { lineStyle: { color: '#03b7e0' } },
            splitLine: { show: false },
        }],
        yAxis: [{
            type: 'value',
            splitLine: { show: false },
            axisLine: { lineStyle: { color: '#03b7e0' } },
        }],
        series: [{
            name: name,
            type: 'line',
            // symbol: 'none',
            symbolSize: 2,
            tooltip: { show: true },
            data: data,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: 'rgba(0,150,239,0.3)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(0,253,252,0)'
                        }
                    ], false),
                    shadowColor: 'rgba(53,142,215, 0.9)',
                    shadowBlur: 20
                }
            },
        }]
    };
    var obj = echarts.init(document.getElementById(addr));
    obj.setOption(option);
    window.addEventListener('resize', function() {
        obj.resize();
    });
    if (addr == 'hisChart') {
        wchart4 = obj;
    }
}
chart('hisChart', null, '');


function DataAnalysis1(data, timezone) {
    var str = '';
    var temp;
    var len = data.datapoints.length;
    if (timezone == null) { timezone = "+8"; }
    var zoneOp = timezone.substring(0, 1);
    var zoneVal = timezone.substring(1);
    //var tzSecond = zoneVal*3600000; 修改于2015年2月1日 连接自己的数据服务器没用到时区参数
    var tzSecond = -8 * 60 * 60 * 1000; //8个小时的时区
    $.each(data.datapoints, function(i, ele) {
        if (zoneOp == '+') { temp = Date.parse(ele.at) + tzSecond; }
        if (zoneOp == '-') { temp = Date.parse(ele.at) - tzSecond; }
        if (ele.value.indexOf("http") != -1) {
            str = str + '[' + temp + ',"' + ele.value + '"]';
        } else if (ele.value.indexOf("/") > -1) {
            str = str + '[' + temp + ',"' + ele.value + '"]';
        } else {
            str = str + '[' + temp + ',' + ele.value + ']';
        }
        if (i != len - 1) {
            str = str + ',';
        }
    });
    return "[" + str + "]";
}


var map_506 = [
    { x: '', y: '', title: '消防栓1', con: "北纬30.382903，东经114.382029" },
    { x: '', y: '', title: '消防栓2', con: "北纬30.395855，东经114.024568" },
];

var map_508 = [
    { x: 30.382903, y: 114.382029, title: '停车场1', con: "北纬30.382903，东经114.382029" },
    { x: 30.395855, y: 114.024568, title: '停车场2', con: "北纬30.395855，东经114.024568" },
    { x: 30.620156, y: 114.174968, title: '停车场3', con: "北纬30.620156，东经114.174968" },
    { x: 30.324994, y: 114.164399, title: '停车场4', con: "北纬30.324994，东经114.164399" },
];

var map_715 = [
    { x: 30.382903, y: 114.382029, title: '垃圾桶位置', con: "北纬30.382903，东经114.382029" },
];

function addMark(data, mymap) {
    mymap.clearOverlays();
    for (var i = 0; i < data.length; i++) {
        var points = new BMap.Point(data[i].y, data[i].x); //创建坐标点
        var opts = { width: 210, height: 125, title: data[i].title, };

        var infoWindows = new BMap.InfoWindow(data[i].con, opts);
        markerFun(points, mymap, infoWindows);
    }
    // 函数 创建多个标注
    function markerFun(points, mymap, infoWindows) {
        var myIcon1 = new BMap.Icon("img/mark.png", new BMap.Size(32, 32));
        var markers = new BMap.Marker(points, {
            icon: myIcon1
        });
        mymap.addOverlay(markers);
        markers.setAnimation(BMAP_ANIMATION_BOUNCE);
        markers.addEventListener("click", function(event) {
            mymap.openInfoWindow(infoWindows, points); //参数：窗口、点  根据点击的点出现对应的窗口
        });
    }
}

function createOpt(addr) {
    var mymap = new BMap.Map(addr);
    mymap.centerAndZoom(new BMap.Point(114.206322, 30.461976), 10);
    mymap.enableScrollWheelZoom(true);
    // mymap.setMapStyleV2({
    //     styleJson: myStyleJson,
    // })
    return mymap;
}

var map3 = createOpt('map3');
addMark(map_715, map3);
var map4 = createOpt('map4');
addMark(map_506, map4);
var map5 = createOpt('map5');
addMark(map_508, map5);