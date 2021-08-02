/*********************************** 气象站 ************************/
var LEN = 10;
// 图表
Date.prototype.format = function (format) {
    var date = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1
                ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}
function getXAxisTime() {
    var now = new Date();
    var times = [];
    var len = LEN;
    while (len--) {
        times.unshift(now.format('h:m:s'));
        now = new Date(now - 2000);
    }
    return times;
}

// 温度
var tempArr = [];
var myChart = echarts.init(document.getElementById('chart_temp'));
//清空画布，防止缓存
myChart.clear();
var chartOpt = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    grid: {
        top: '25%',
        left: '5%',
        right: '15%',
        bottom: '15%',
        containLabel: true
    },
    color: ['#F4A85D'],
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getXAxisTime(),
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    yAxis: {
        type: 'value',
        min: -40,
        max: 120,
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    series: [
        {
            type: 'line',
            data: (function () {
                var items = [];
                var len = LEN;
                while (len--) {
                    items.unshift(tempArr[Math.floor(Math.random() * tempArr.length)]);
                }
                return items;
            })()
        },
    ]
};
myChart.setOption(chartOpt, true);
setInterval(function () {
    chartOpt.xAxis.data.shift();
    chartOpt.xAxis.data.push(new Date().format('h:m:s'));

    chartOpt.series[0].data.shift();
    chartOpt.series[0].data.push(tempArr[Math.floor(Math.random() * tempArr.length)]);

    myChart.setOption(chartOpt, true);
}, 2000);

// 湿度
var myChart1 = echarts.init(document.getElementById('chart_humi'));
var angle = 0; //角度，用来做简单的动画效果的
var timerId;
var chartOpt1 = {
    // backgroundColor: '#000E1A',
    title: {
        text: '{a|' + 0 + '}{c|%RH}',
        x: 'center',
        y: 'center',
        textStyle: {
            rich: {
                a: {
                    fontSize: 24,
                    color: '#00E6E0'
                },

                c: {
                    fontSize: 12,
                    color: '#00E6E0',
                    // padding: [5,0]
                }
            }
        }
    },

    series: [
        // 紫色
        {
            name: "ring5",
            type: 'custom',
            coordinateSystem: "none",
            renderItem: function (params, api) {
                return {
                    type: 'arc',
                    shape: {
                        cx: api.getWidth() / 2,
                        cy: api.getHeight() / 2,
                        r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6,
                        startAngle: (0 + angle) * Math.PI / 180,
                        endAngle: (90 + angle) * Math.PI / 180
                    },
                    style: {
                        stroke: "#8383FA",
                        fill: "transparent",
                        lineWidth: 1.5
                    },
                    silent: true
                };
            },
            data: [0]
        }, {
            name: "ring5", //紫点
            type: 'custom',
            coordinateSystem: "none",
            renderItem: function (params, api) {
                let x0 = api.getWidth() / 2;
                let y0 = api.getHeight() / 2;
                let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6;
                let point = getCirlPoint(x0, y0, r, (90 + angle))
                return {
                    type: 'circle',
                    shape: {
                        cx: point.x,
                        cy: point.y,
                        r: 4
                    },
                    style: {
                        stroke: "#8450F9", //绿
                        fill: "#8450F9"
                    },
                    silent: true
                };
            },
            data: [0]
        },
        // 蓝色

        {
            name: "ring5",
            type: 'custom',
            coordinateSystem: "none",
            renderItem: function (params, api) {
                return {
                    type: 'arc',
                    shape: {
                        cx: api.getWidth() / 2,
                        cy: api.getHeight() / 2,
                        r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6,
                        startAngle: (180 + angle) * Math.PI / 180,
                        endAngle: (270 + angle) * Math.PI / 180
                    },
                    style: {
                        stroke: "#4386FA",
                        fill: "transparent",
                        lineWidth: 1.5
                    },
                    silent: true
                };
            },
            data: [0]
        },
        {
            name: "ring5", // 蓝色
            type: 'custom',
            coordinateSystem: "none",
            renderItem: function (params, api) {
                let x0 = api.getWidth() / 2;
                let y0 = api.getHeight() / 2;
                let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.6;
                let point = getCirlPoint(x0, y0, r, (180 + angle))
                return {
                    type: 'circle',
                    shape: {
                        cx: point.x,
                        cy: point.y,
                        r: 4
                    },
                    style: {
                        stroke: "#4386FA", //绿
                        fill: "#4386FA"
                    },
                    silent: true
                };
            },
            data: [0]
        },

        {
            name: "ring5",
            type: 'custom',
            coordinateSystem: "none",
            renderItem: function (params, api) {
                return {
                    type: 'arc',
                    shape: {
                        cx: api.getWidth() / 2,
                        cy: api.getHeight() / 2,
                        r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
                        startAngle: (270 + -angle) * Math.PI / 180,
                        endAngle: (40 + -angle) * Math.PI / 180
                    },
                    style: {
                        stroke: "#0CD3DB",
                        fill: "transparent",
                        lineWidth: 1.5
                    },
                    silent: true
                };
            },
            data: [0]
        },
        // 橘色

        {
            name: "ring5",
            type: 'custom',
            coordinateSystem: "none",
            renderItem: function (params, api) {
                return {
                    type: 'arc',
                    shape: {
                        cx: api.getWidth() / 2,
                        cy: api.getHeight() / 2,
                        r: Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65,
                        startAngle: (90 + -angle) * Math.PI / 180,
                        endAngle: (220 + -angle) * Math.PI / 180
                    },
                    style: {
                        stroke: "#FF8E89",
                        fill: "transparent",
                        lineWidth: 1.5
                    },
                    silent: true
                };
            },
            data: [0]
        }, {
            name: "ring5",
            type: 'custom',
            coordinateSystem: "none",
            renderItem: function (params, api) {
                let x0 = api.getWidth() / 2;
                let y0 = api.getHeight() / 2;
                let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65;
                let point = getCirlPoint(x0, y0, r, (90 + -angle))
                return {
                    type: 'circle',
                    shape: {
                        cx: point.x,
                        cy: point.y,
                        r: 4
                    },
                    style: {
                        stroke: "#FF8E89", //粉
                        fill: "#FF8E89"
                    },
                    silent: true
                };
            },
            data: [0]
        }, {
            name: "ring5", //绿点
            type: 'custom',
            coordinateSystem: "none",
            renderItem: function (params, api) {
                let x0 = api.getWidth() / 2;
                let y0 = api.getHeight() / 2;
                let r = Math.min(api.getWidth(), api.getHeight()) / 2 * 0.65;
                let point = getCirlPoint(x0, y0, r, (270 + -angle))
                return {
                    type: 'circle',
                    shape: {
                        cx: point.x,
                        cy: point.y,
                        r: 4
                    },
                    style: {
                        stroke: "#0CD3DB", //绿
                        fill: "#0CD3DB"
                    },
                    silent: true
                };
            },
            data: [0]
        }, {
            name: '',
            type: 'pie',
            radius: ['52%', '40%'],
            silent: true,
            clockwise: true,
            startAngle: 90,
            z: 0,
            zlevel: 0,
            label: {
                normal: {
                    position: "center",

                }
            },
            data: [{
                value: 0,
                name: "",
                itemStyle: {
                    normal: {
                        color: { // 完成的圆环的颜色
                            colorStops: [{
                                offset: 0,
                                color: '#A098FC' // 0% 处的颜色
                            },
                            {
                                offset: 0.3,
                                color: '#4386FA' // 0% 处的颜色
                            },
                            {
                                offset: 0.6,
                                color: '#4FADFD' // 0% 处的颜色
                            },
                            {
                                offset: 0.8,
                                color: '#0CD3DB' // 100% 处的颜色
                            }, {
                                offset: 1,
                                color: '#646CF9' // 100% 处的颜色
                            }
                            ]
                        },
                    }
                }
            },
            {
                value: 100 - 0,
                name: "",
                label: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: "#173164"
                    }
                }
            }
            ]
        },
        {
            name: '',
            type: 'pie',
            radius: ['32%', '35%'],
            silent: true,
            clockwise: true,
            startAngle: 270,
            z: 0,
            zlevel: 0,
            label: {
                normal: {
                    position: "center",

                }
            },
            data: [{
                value: 0,
                name: "",
                itemStyle: {
                    normal: {
                        color: { // 完成的圆环的颜色
                            colorStops: [{
                                offset: 0,
                                color: '#00EDF3' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: '#646CF9' // 100% 处的颜色
                            }]
                        },
                    }
                }
            },
            {
                value: 100 - 0,
                name: "",
                label: {
                    normal: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        color: "#173164"
                    }
                }
            }
            ]
        },
    ]
};
//获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
function getCirlPoint(x0, y0, r, angle) {
    let x1 = x0 + r * Math.cos(angle * Math.PI / 180)
    let y1 = y0 + r * Math.sin(angle * Math.PI / 180)
    return {
        x: x1,
        y: y1
    }
}
function draw() {
    angle = angle + 3
    myChart1.setOption(chartOpt1, true)
    //window.requestAnimationFrame(draw);
}
if (timerId) {
    clearInterval(timerId);
}
var timerId = setInterval(function () {
    //用setInterval做动画感觉有问题
    draw()
}, 100);
myChart1.setOption(chartOpt1, true);

// 风向
var myChart2 = echarts.init(document.getElementById('chart_wind'));
var windValue = 0;
var xmax = 360;
// if (max) { xmax = max } else { xmax = 100 }
var colorSet = { color: '#35b7ba' };
var xcolor;
if (windValue > xmax) {
    xcolor = '#e64e49'
} else {
    xcolor = '#3ebb33'
}
var chartOpt2 = {
    series: [{ // 内圆
        type: 'pie',
        radius: ['0', '50%'],
        center: ["50%", "50%"],
        z: 4,
        hoverAnimation: false,
        data: [{
            value: windValue,
            itemStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(23,161,255,.2)'
                    }, {
                        offset: 1,
                        color: 'rgba(17,90,233,0.05) '
                    }])
                }

            },
            label: {
                normal: {
                    color: '#38B350',
                    align: 'center',
                    fontSize: 16,
                    formatter: function (params) {
                        if (windValue < 90) { return '东北' }
                        else if (windValue < 180) { return '东南' }
                        else if (windValue < 270) { return '西南' }
                        else if (windValue < 360) { return '西北' }
                    },
                    position: 'center',
                    show: true
                }
            },
            labelLine: {
                show: false
            }
        }],
    }, {
        type: "gauge",
        center: ["50%", "50%"],
        radius: '75%',
        endAngle: -89.9,
        startAngle: 270,
        splitNumber: 10,
        axisLine: {
            lineStyle: {
                color: [
                    [windValue / xmax, colorSet.color],
                    [1, "#ffffff"]
                ],
                width: 5
            }
        },
        axisLabel: {
            show: false,
        },
        axisTick: {
            show: false,

        },
        splitLine: {
            show: false,
        },
        itemStyle: {
            show: false,
        },
        detail: {
            show: false,
        },
        label: {
            show: false
        },
        title: { //标题
            show: false,
        },
        data: [{
            name: "title",
            value: windValue,
        }],
        pointer: {
            show: false,
        },
    },
    // 外一层圈
    {
        type: "pie",
        radius: "50%",
        startAngle: 220,
        endAngle: -40,
        hoverAnimation: false,
        center: ["50%", "50%"],
        avoidLabelOverlap: false,
        label: {
            show: false
        },
        labelLine: {
            show: false
        },
        data: [{
            value: 1
        }],
        itemStyle: {
            color: xcolor
        }
    },
    ]
}
myChart2.setOption(chartOpt2);

/*********************************** 充电桩 ************************/
// 电压1
var myChart3 = echarts.init(document.getElementById('chart_voltage1'));
var axislineColor = new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
    offset: 0,
    color: '#1affad'
},

{
    offset: 0.62,
    color: 'yellow'
},

{
    offset: 1,
    color: '#FF0000'
}
]);
var chartOpt3 = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} v',
        extraCssText: 'width:50px;height:50px;'
    },
    series: [{
        name: '仪表盘',
        type: 'gauge',
        data: [{ value: '0', name: '电压' }],
        radius: '100%',
        center: ['50%', '50%'],
        min: 0,
        max: 220,
        splitNumber: 5,
        axisLine: { // 坐标轴线
            lineStyle: { // 属性lineStyle控制线条样式
                width: 5,
                color: [
                    [1, axislineColor]
                ],
            }
        },
        axisTick: { // 坐标轴小标记
            length: 10, // 属性length控制线长
            lineStyle: { // 属性lineStyle控制线条样式
                color: '#06eefe'
            }
        },
        splitLine: { // 分隔线
            length: 15, // 属性length控制线长
            lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                color: '#06eefe'
            }
        },
        axisLabel: {
            color: '#06eefe',
            fontSize: 10,
        },
        detail: {
            formatter: '{value}v',
            fontSize: 15,
            offsetCenter: [0, '85%'],
            color: '#d2ff2a',
        },
        title: {
            fontSize: 10,
            color: '#d2ff2a ',
            offsetCenter: [0, '55%']
        },
        pointer: {
            width: 3 // 指针大小
        }
    }]
};
myChart3.setOption(chartOpt3);
// 电压2
var myChart4 = echarts.init(document.getElementById('chart_voltage2'));
var chartOpt4 = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} v',
        extraCssText: 'width:50px;height:50px;'
    },
    series: [{
        name: '仪表盘',
        type: 'gauge',
        data: [{ value: '0', name: '电压' }],
        radius: '100%',
        center: ['50%', '50%'],
        min: 0,
        max: 220,
        splitNumber: 5,
        axisLine: { // 坐标轴线
            lineStyle: { // 属性lineStyle控制线条样式
                width: 5,
                color: [
                    [1, axislineColor]
                ],
            }
        },
        axisTick: { // 坐标轴小标记
            length: 10, // 属性length控制线长
            lineStyle: { // 属性lineStyle控制线条样式
                color: '#06eefe'
            }
        },
        splitLine: { // 分隔线
            length: 15, // 属性length控制线长
            lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                color: '#06eefe'
            }
        },
        axisLabel: {
            color: '#06eefe',
            fontSize: 10,
        },
        detail: {
            formatter: '{value}v',
            fontSize: 15,
            offsetCenter: [0, '85%'],
            color: '#d2ff2a',
        },
        title: {
            fontSize: 10,
            color: '#d2ff2a ',
            offsetCenter: [0, '55%']
        },
        pointer: {
            width: 3 // 指针大小
        }
    }]
};
myChart4.setOption(chartOpt4);
// 电压3
var myChart5 = echarts.init(document.getElementById('chart_voltage3'));
var chartOpt5 = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} v',
        extraCssText: 'width:50px;height:50px;'
    },
    series: [{
        name: '仪表盘',
        type: 'gauge',
        data: [{ value: '0', name: '电压' }],
        radius: '100%',
        center: ['50%', '50%'],
        min: 0,
        max: 220,
        splitNumber: 5,
        axisLine: { // 坐标轴线
            lineStyle: { // 属性lineStyle控制线条样式
                width: 5,
                color: [
                    [1, axislineColor]
                ],
            }
        },
        axisTick: { // 坐标轴小标记
            length: 10, // 属性length控制线长
            lineStyle: { // 属性lineStyle控制线条样式
                color: '#06eefe'
            }
        },
        splitLine: { // 分隔线
            length: 15, // 属性length控制线长
            lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                color: '#06eefe'
            }
        },
        axisLabel: {
            color: '#06eefe',
            fontSize: 10,
        },
        detail: {
            formatter: '{value}v',
            fontSize: 15,
            offsetCenter: [0, '85%'],
            color: '#d2ff2a',
        },
        title: {
            fontSize: 10,
            color: '#d2ff2a ',
            offsetCenter: [0, '55%']
        },
        pointer: {
            width: 3 // 指针大小
        }
    }]
};
myChart5.setOption(chartOpt5);
// 电压4
var myChart6 = echarts.init(document.getElementById('chart_voltage4'));
var chartOpt6 = {
    tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} v',
        extraCssText: 'width:50px;height:50px;'
    },
    series: [{
        name: '仪表盘',
        type: 'gauge',
        data: [{ value: '0', name: '电压' }],
        radius: '100%',
        center: ['50%', '50%'],
        min: 0,
        max: 220,
        splitNumber: 5,
        axisLine: { // 坐标轴线
            lineStyle: { // 属性lineStyle控制线条样式
                width: 5,
                color: [
                    [1, axislineColor]
                ],
            }
        },
        axisTick: { // 坐标轴小标记
            length: 10, // 属性length控制线长
            lineStyle: { // 属性lineStyle控制线条样式
                color: '#06eefe'
            }
        },
        splitLine: { // 分隔线
            length: 15, // 属性length控制线长
            lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
                color: '#06eefe'
            }
        },
        axisLabel: {
            color: '#06eefe',
            fontSize: 10,
        },
        detail: {
            formatter: '{value}v',
            fontSize: 15,
            offsetCenter: [0, '85%'],
            color: '#d2ff2a',
        },
        title: {
            fontSize: 10,
            color: '#d2ff2a ',
            offsetCenter: [0, '55%']
        },
        pointer: {
            width: 3 // 指针大小
        }
    }]
};
myChart6.setOption(chartOpt6);

//功率1
var color = ['#00ACFF', '#81D5FC', '#C5D6EB']
var myChart7 = echarts.init(document.getElementById('power_char1'));
var powerValue = 0;
var chartOpt7 = {
    title: {
        text: powerValue + '(W)',
        textStyle: {
            color: color[2],
            fontSize: 17
        },
        itemGap: 20,
        left: 'center',
        top: '60%'
    },
    tooltip: {
        formatter: function (params) {
            return '<span style="color: #fff;">占比：' + params.value + '%</span>';
        }
    },
    angleAxis: {
        max: 100,
        clockwise: false, // 逆时针
        // 隐藏刻度线
        show: false,
        startAngle: 120
    },
    radiusAxis: {
        type: 'category',
        show: true,
        axisLabel: {
            show: false,
        },
        axisLine: {
            show: false,

        },
        axisTick: {
            show: false
        },
    },
    polar: [{
        center: ['50%', '50%'], //中心点位置
        radius: '100%', //图形大小

    }],
    series: [{
        name: '小环',
        type: 'gauge',
        splitNumber: 12,
        radius: '70%',
        center: ['50%', '50%'],
        startAngle: 0,
        endAngle: 359.9999,
        axisLine: {
            show: false
        },
        axisTick: {
            show: true,
            lineStyle: {
                color: color[1],
                width: 3.5,
                shadowBlur: 1,
                shadowColor: color[1],
            },
            length: 10,
            splitNumber: 3
        },
        splitLine: {
            show: false
        },
        axisLabel: {
            show: false
        },
        detail: {
            show: false
        }
    },
    ]
};
myChart7.setOption(chartOpt7);

//功率2
var myChart8 = echarts.init(document.getElementById('power_char2'));
var powerValue2 = 0;
var chartOpt8 = {
    title: {
        text: powerValue2 + '(W)',
        textStyle: {
            color: color[2],
            fontSize: 17
        },
        itemGap: 20,
        left: 'center',
        top: '60%'
    },
    tooltip: {
        formatter: function (params) {
            return '<span style="color: #fff;">占比：' + params.value + '%</span>';
        }
    },
    angleAxis: {
        max: 100,
        clockwise: false, // 逆时针
        // 隐藏刻度线
        show: false,
        startAngle: 120
    },
    radiusAxis: {
        type: 'category',
        show: true,
        axisLabel: {
            show: false,
        },
        axisLine: {
            show: false,

        },
        axisTick: {
            show: false
        },
    },
    polar: [{
        center: ['50%', '50%'], //中心点位置
        radius: '100%', //图形大小

    }],
    series: [{
        name: '小环',
        type: 'gauge',
        splitNumber: 12,
        radius: '70%',
        center: ['50%', '50%'],
        startAngle: 0,
        endAngle: 359.9999,
        axisLine: {
            show: false
        },
        axisTick: {
            show: true,
            lineStyle: {
                color: color[1],
                width: 3.5,
                shadowBlur: 1,
                shadowColor: color[1],
            },
            length: 10,
            splitNumber: 3
        },
        splitLine: {
            show: false
        },
        axisLabel: {
            show: false
        },
        detail: {
            show: false
        }
    },
    ]
};
myChart8.setOption(chartOpt8);

//功率3
var myChart9 = echarts.init(document.getElementById('power_char3'));
var powerValue3 = 0;
var chartOpt9 = {
    title: {
        text: powerValue3 + '(W)',
        textStyle: {
            color: color[2],
            fontSize: 17
        },
        itemGap: 20,
        left: 'center',
        top: '60%'
    },
    tooltip: {
        formatter: function (params) {
            return '<span style="color: #fff;">占比：' + params.value + '%</span>';
        }
    },
    angleAxis: {
        max: 100,
        clockwise: false, // 逆时针
        // 隐藏刻度线
        show: false,
        startAngle: 120
    },
    radiusAxis: {
        type: 'category',
        show: true,
        axisLabel: {
            show: false,
        },
        axisLine: {
            show: false,

        },
        axisTick: {
            show: false
        },
    },
    polar: [{
        center: ['50%', '50%'], //中心点位置
        radius: '100%', //图形大小

    }],
    series: [{
        name: '小环',
        type: 'gauge',
        splitNumber: 12,
        radius: '70%',
        center: ['50%', '50%'],
        startAngle: 0,
        endAngle: 359.9999,
        axisLine: {
            show: false
        },
        axisTick: {
            show: true,
            lineStyle: {
                color: color[1],
                width: 3.5,
                shadowBlur: 1,
                shadowColor: color[1],
            },
            length: 10,
            splitNumber: 3
        },
        splitLine: {
            show: false
        },
        axisLabel: {
            show: false
        },
        detail: {
            show: false
        }
    },
    ]
};
myChart9.setOption(chartOpt9);

//功率4
var myChart10 = echarts.init(document.getElementById('power_char4'));
var powerValue4 = 0;
var chartOpt10 = {
    title: {
        text: powerValue4 + '(W)',
        textStyle: {
            color: color[2],
            fontSize: 17
        },
        itemGap: 20,
        left: 'center',
        top: '60%'
    },
    tooltip: {
        formatter: function (params) {
            return '<span style="color: #fff;">占比：' + params.value + '%</span>';
        }
    },
    angleAxis: {
        max: 100,
        clockwise: false, // 逆时针
        // 隐藏刻度线
        show: false,
        startAngle: 120
    },
    radiusAxis: {
        type: 'category',
        show: true,
        axisLabel: {
            show: false,
        },
        axisLine: {
            show: false,

        },
        axisTick: {
            show: false
        },
    },
    polar: [{
        center: ['50%', '50%'], //中心点位置
        radius: '100%', //图形大小

    }],
    series: [{
        name: '小环',
        type: 'gauge',
        splitNumber: 12,
        radius: '70%',
        center: ['50%', '50%'],
        startAngle: 0,
        endAngle: 359.9999,
        axisLine: {
            show: false
        },
        axisTick: {
            show: true,
            lineStyle: {
                color: color[1],
                width: 3.5,
                shadowBlur: 1,
                shadowColor: color[1],
            },
            length: 10,
            splitNumber: 3
        },
        splitLine: {
            show: false
        },
        axisLabel: {
            show: false
        },
        detail: {
            show: false
        }
    },
    ]
};
myChart10.setOption(chartOpt10);

// 电流1
var frequencyArr = [];
var myChart11 = echarts.init(document.getElementById('frequencySpan1'));
//清空画布，防止缓存
myChart11.clear();
var chartOpt11 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    grid: {
        top: '25%',
        left: '5%',
        right: '15%',
        bottom: '15%',
        containLabel: true
    },
    color: ['#4DB29A'],
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getXAxisTime(),
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 120,
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    series: [
        {
            type: 'bar',
            data: (function () {
                var items = [];
                var len = LEN;
                while (len--) {
                    items.unshift(frequencyArr[Math.floor(Math.random() * frequencyArr.length)]);
                }
                return items;
            })()
        },
    ]
};
myChart11.setOption(chartOpt11, true);
setInterval(function () {
    chartOpt11.xAxis.data.shift();
    chartOpt11.xAxis.data.push(new Date().format('h:m:s'));

    chartOpt11.series[0].data.shift();
    chartOpt11.series[0].data.push(frequencyArr[Math.floor(Math.random() * frequencyArr.length)]);

    myChart11.setOption(chartOpt11, true);
}, 2000);

// 电流2
var frequencyArr2 = [];
var myChart12 = echarts.init(document.getElementById('frequencySpan2'));
//清空画布，防止缓存
myChart12.clear();
var chartOpt12 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    grid: {
        top: '25%',
        left: '5%',
        right: '15%',
        bottom: '15%',
        containLabel: true
    },
    color: ['#4DB29A'],
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getXAxisTime(),
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 120,
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    series: [
        {
            type: 'bar',
            data: (function () {
                var items = [];
                var len = LEN;
                while (len--) {
                    items.unshift(frequencyArr2[Math.floor(Math.random() * frequencyArr2.length)]);
                }
                return items;
            })()
        },
    ]
};
myChart12.setOption(chartOpt12, true);
setInterval(function () {
    chartOpt12.xAxis.data.shift();
    chartOpt12.xAxis.data.push(new Date().format('h:m:s'));

    chartOpt12.series[0].data.shift();
    chartOpt12.series[0].data.push(frequencyArr2[Math.floor(Math.random() * frequencyArr2.length)]);

    myChart12.setOption(chartOpt12, true);
}, 2000);

// 电流3
var frequencyArr3 = [];
var myChart13 = echarts.init(document.getElementById('frequencySpan3'));
//清空画布，防止缓存
myChart13.clear();
var chartOpt13 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    grid: {
        top: '25%',
        left: '5%',
        right: '15%',
        bottom: '15%',
        containLabel: true
    },
    color: ['#4DB29A'],
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getXAxisTime(),
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 120,
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    series: [
        {
            type: 'bar',
            data: (function () {
                var items = [];
                var len = LEN;
                while (len--) {
                    items.unshift(frequencyArr3[Math.floor(Math.random() * frequencyArr3.length)]);
                }
                return items;
            })()
        },
    ]
};
myChart13.setOption(chartOpt13, true);
setInterval(function () {
    chartOpt13.xAxis.data.shift();
    chartOpt13.xAxis.data.push(new Date().format('h:m:s'));

    chartOpt13.series[0].data.shift();
    chartOpt13.series[0].data.push(frequencyArr3[Math.floor(Math.random() * frequencyArr3.length)]);

    myChart13.setOption(chartOpt13, true);
}, 2000);

// 电流4
var frequencyArr4 = [];
var myChart14 = echarts.init(document.getElementById('frequencySpan4'));
//清空画布，防止缓存
myChart14.clear();
var chartOpt14 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    grid: {
        top: '25%',
        left: '5%',
        right: '15%',
        bottom: '15%',
        containLabel: true
    },
    color: ['#4DB29A'],
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getXAxisTime(),
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 120,
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    series: [
        {
            type: 'bar',
            data: (function () {
                var items = [];
                var len = LEN;
                while (len--) {
                    items.unshift(frequencyArr4[Math.floor(Math.random() * frequencyArr4.length)]);
                }
                return items;
            })()
        },
    ]
};
myChart14.setOption(chartOpt14, true);
setInterval(function () {
    chartOpt14.xAxis.data.shift();
    chartOpt14.xAxis.data.push(new Date().format('h:m:s'));

    chartOpt14.series[0].data.shift();
    chartOpt14.series[0].data.push(frequencyArr4[Math.floor(Math.random() * frequencyArr4.length)]);

    myChart14.setOption(chartOpt14, true);
}, 2000);

// 历史用电量1
var hisEleArr1 = [];
var myChart15 = echarts.init(document.getElementById('UeleChar1'));
//清空画布，防止缓存
myChart15.clear();
var chartOpt15 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    grid: {
        top: '25%',
        left: '5%',
        right: '5%',
        bottom: '15%',
        containLabel: true
    },
    color: ['#00FFFF'],
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getXAxisTime(),
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 40,
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    series: [
        {
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
            data: (function () {
                var items = [];
                var len = LEN;
                while (len--) {
                    items.unshift(hisEleArr1[Math.floor(Math.random() * hisEleArr1.length)]);
                }
                return items;
            })()
        },
    ]
};
myChart15.setOption(chartOpt15, true);
setInterval(function () {
    chartOpt15.xAxis.data.shift();
    chartOpt15.xAxis.data.push(new Date().format('h:m:s'));

    chartOpt15.series[0].data.shift();
    chartOpt15.series[0].data.push(hisEleArr1[Math.floor(Math.random() * hisEleArr1.length)]);

    myChart15.setOption(chartOpt15, true);
}, 2000);

// 历史用电量2
var hisEleArr2 = []
var myChart16 = echarts.init(document.getElementById('UeleChar2'));
//清空画布，防止缓存
myChart16.clear();
var chartOpt16 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    grid: {
        top: '25%',
        left: '5%',
        right: '5%',
        bottom: '15%',
        containLabel: true
    },
    color: ['#00FFFF'],
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getXAxisTime(),
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 40,
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    series: [
        {
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
            data: (function () {
                var items = [];
                var len = LEN;
                while (len--) {
                    items.unshift(hisEleArr2[Math.floor(Math.random() * hisEleArr2.length)]);
                }
                return items;
            })()
        },
    ]
};
myChart16.setOption(chartOpt16, true);
setInterval(function () {
    chartOpt16.xAxis.data.shift();
    chartOpt16.xAxis.data.push(new Date().format('h:m:s'));

    chartOpt16.series[0].data.shift();
    chartOpt16.series[0].data.push(hisEleArr2[Math.floor(Math.random() * hisEleArr2.length)]);

    myChart16.setOption(chartOpt16, true);
}, 2000);

// 历史用电量3
var hisEleArr3 = []
var myChart17 = echarts.init(document.getElementById('UeleChar3'));
//清空画布，防止缓存
myChart17.clear();
var chartOpt17 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    grid: {
        top: '25%',
        left: '5%',
        right: '5%',
        bottom: '15%',
        containLabel: true
    },
    color: ['#00FFFF'],
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getXAxisTime(),
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 40,
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    series: [
        {
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
            data: (function () {
                var items = [];
                var len = LEN;
                while (len--) {
                    items.unshift(hisEleArr1[Math.floor(Math.random() * hisEleArr1.length)]);
                }
                return items;
            })()
        },
    ]
};
myChart17.setOption(chartOpt17, true);
setInterval(function () {
    chartOpt17.xAxis.data.shift();
    chartOpt17.xAxis.data.push(new Date().format('h:m:s'));

    chartOpt17.series[0].data.shift();
    chartOpt17.series[0].data.push(hisEleArr3[Math.floor(Math.random() * hisEleArr3.length)]);

    myChart17.setOption(chartOpt17, true);
}, 2000);

// 历史用电量4
var hisEleArr4 = []
var myChart18 = echarts.init(document.getElementById('UeleChar4'));
//清空画布，防止缓存
myChart18.clear();
var chartOpt18 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    grid: {
        top: '25%',
        left: '5%',
        right: '5%',
        bottom: '15%',
        containLabel: true
    },
    color: ['#00FFFF'],
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getXAxisTime(),
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 40,
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    series: [
        {
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
            data: (function () {
                var items = [];
                var len = LEN;
                while (len--) {
                    items.unshift(hisEleArr3[Math.floor(Math.random() * hisEleArr3.length)]);
                }
                return items;
            })()
        },
    ]
};
myChart18.setOption(chartOpt18, true);
setInterval(function () {
    chartOpt18.xAxis.data.shift();
    chartOpt18.xAxis.data.push(new Date().format('h:m:s'));

    chartOpt18.series[0].data.shift();
    chartOpt18.series[0].data.push(hisEleArr4[Math.floor(Math.random() * hisEleArr4.length)]);

    myChart18.setOption(chartOpt18, true);
}, 2000);

// 实时负载用电量1
var hisPEleArr1 = []
var myChart19 = echarts.init(document.getElementById('UFeleChar1'));
//清空画布，防止缓存
myChart19.clear();
var chartOpt19 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    grid: {
        top: '25%',
        left: '5%',
        right: '5%',
        bottom: '15%',
        containLabel: true
    },
    color: ['#00FFFF'],
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getXAxisTime(),
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 40,
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    series: [
        {
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
            data: (function () {
                var items = [];
                var len = LEN;
                while (len--) {
                    items.unshift(hisPEleArr1[Math.floor(Math.random() * hisPEleArr1.length)]);
                }
                return items;
            })()
        },
    ]
};
myChart19.setOption(chartOpt19, true);
setInterval(function () {
    chartOpt19.xAxis.data.shift();
    chartOpt19.xAxis.data.push(new Date().format('h:m:s'));

    chartOpt19.series[0].data.shift();
    chartOpt19.series[0].data.push(hisPEleArr1[Math.floor(Math.random() * hisPEleArr1.length)]);

    myChart19.setOption(chartOpt19, true);
}, 2000);

// 实时负载用电量2
var hisPEleArr2 = []
var myChart20 = echarts.init(document.getElementById('UFeleChar2'));
//清空画布，防止缓存
myChart20.clear();
var chartOpt20 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    grid: {
        top: '25%',
        left: '5%',
        right: '5%',
        bottom: '15%',
        containLabel: true
    },
    color: ['#00FFFF'],
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getXAxisTime(),
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 40,
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    series: [
        {
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
            data: (function () {
                var items = [];
                var len = LEN;
                while (len--) {
                    items.unshift(hisPEleArr2[Math.floor(Math.random() * hisPEleArr2.length)]);
                }
                return items;
            })()
        },
    ]
};
myChart20.setOption(chartOpt20, true);
setInterval(function () {
    chartOpt20.xAxis.data.shift();
    chartOpt20.xAxis.data.push(new Date().format('h:m:s'));

    chartOpt20.series[0].data.shift();
    chartOpt20.series[0].data.push(hisPEleArr2[Math.floor(Math.random() * hisPEleArr2.length)]);

    myChart20.setOption(chartOpt20, true);
}, 2000);

// 实时负载用电量3
var hisPEleArr3 = []
var myChart21 = echarts.init(document.getElementById('UFeleChar3'));
//清空画布，防止缓存
myChart21.clear();
var chartOpt21 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    grid: {
        top: '25%',
        left: '5%',
        right: '5%',
        bottom: '15%',
        containLabel: true
    },
    color: ['#00FFFF'],
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getXAxisTime(),
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 40,
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    series: [
        {
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
            data: (function () {
                var items = [];
                var len = LEN;
                while (len--) {
                    items.unshift(hisPEleArr3[Math.floor(Math.random() * hisPEleArr3.length)]);
                }
                return items;
            })()
        },
    ]
};
myChart21.setOption(chartOpt21, true);
setInterval(function () {
    chartOpt21.xAxis.data.shift();
    chartOpt21.xAxis.data.push(new Date().format('h:m:s'));

    chartOpt21.series[0].data.shift();
    chartOpt21.series[0].data.push(hisPEleArr3[Math.floor(Math.random() * hisPEleArr3.length)]);

    myChart21.setOption(chartOpt21, true);
}, 2000);

// 实时负载用电量4
var hisPEleArr4 = []
var myChart22 = echarts.init(document.getElementById('UFeleChar4'));
//清空画布，防止缓存
myChart22.clear();
var chartOpt22 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            animation: false
        }
    },
    grid: {
        top: '25%',
        left: '5%',
        right: '5%',
        bottom: '15%',
        containLabel: true
    },
    color: ['#00FFFF'],
    xAxis: {
        type: 'category',
        boundaryGap: true,
        data: getXAxisTime(),
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    yAxis: {
        type: 'value',
        min: 0,
        max: 40,
        splitLine: {
            show: false
        },
        axisLine: {
            lineStyle: {
                color: '#01DAE2'
            }
        }
    },
    series: [
        {
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
            data: (function () {
                var items = [];
                var len = LEN;
                while (len--) {
                    items.unshift(hisPEleArr4[Math.floor(Math.random() * hisPEleArr4.length)]);
                }
                return items;
            })()
        },
    ]
};
myChart22.setOption(chartOpt22, true);
setInterval(function () {
    chartOpt22.xAxis.data.shift();
    chartOpt22.xAxis.data.push(new Date().format('h:m:s'));

    chartOpt22.series[0].data.shift();
    chartOpt22.series[0].data.push(hisPEleArr4[Math.floor(Math.random() * hisPEleArr4.length)]);

    myChart22.setOption(chartOpt22, true);
}, 2000);

window.addEventListener('resize', () => {
    myChart1.resize();
    myChart2.resize();
    myChart.resize();
    myChart3.resize();
    myChart4.resize();
    myChart5.resize();
    myChart6.resize();
    myChart7.resize();
    myChart8.resize();
    myChart9.resize();
    myChart10.resize();
    myChart11.resize();
    myChart12.resize();
    myChart13.resize();
    myChart14.resize();
    myChart15.resize();
    myChart19.resize();
})

$('#ligCoutNav li').click(function () {
    setTimeout(function () {
        myChart.resize();
        myChart1.resize();
        myChart2.resize();
        myChart3.resize();
        myChart7.resize();
        myChart11.resize();
        myChart15.resize();
        myChart19.resize();
    }, 200)
})
$('#voltage_nav li').click(function () {
    setTimeout(function () {
        myChart3.resize();
        myChart4.resize();
        myChart5.resize();
        myChart6.resize();
    }, 200)
})
$('#power_nav li').click(function () {
    setTimeout(function () {
        myChart7.resize();
        myChart8.resize();
        myChart9.resize();
        myChart10.resize();
    }, 200)
})
$('#frequency_nav li').click(function () {
    setTimeout(function () {
        myChart11.resize();
        myChart12.resize();
        myChart13.resize();
        myChart14.resize();
    }, 200)
})
$('#uElehis_nav li').click(function () {
    setTimeout(function () {
        myChart15.resize();
        myChart16.resize();
        myChart17.resize();
        myChart18.resize();
    }, 200)
})
$('#uElehisF_nav li').click(function () {
    setTimeout(function () {
        myChart19.resize();
        myChart20.resize();
        myChart21.resize();
        myChart22.resize();
    }, 200)
})
// // 生成随机数
// function random(min, max) {
//     return Math.floor(Math.random() * (max - min)) + min;
// }
// var arr = [];
// for (var i = 1; i <= 30; i++) {
//     arr.push(random(1, 40))
// }
// console.log(arr)