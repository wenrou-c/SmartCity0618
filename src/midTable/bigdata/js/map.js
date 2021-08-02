$(function () {
    map();
    //中国地图
    function map() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('mapBox'));
        //需要标注的城市
        var data = [
            {
                name: '广州',
                value: 138
            },
            {
                name: '北京',
                value: 179
            },
            {
                name: '杭州',
                value: 84
            },
            {
                name: '武汉',
                value: 273
            },
        ];
        //城市坐标 
        var geoCoordMap = {
            '广州': [113.23, 23.16],
            '北京': [116.46, 39.92],
            '杭州': [120.19, 30.26],
            '武汉': [114.31, 30.52],
        };
        //需要显示的城市名称和值
        var convertData = function (data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].name];
                if (geoCoord) {
                    res.push({
                        name: data[i].name,
                        value: geoCoord.concat(data[i].value)
                    });
                }
            }
            return res;
        };
        //图表的配置项和数据
        var option = {
            //提示框组件
            tooltip: {
                trigger: 'item',//触发类型
                formatter: function (params) { //提示框浮层内容格式器
                    if (typeof (params.value)[2] == "undefined") {
                        return params.name + ' : ' + params.value;
                    } else {
                        return params.name + ' : ' + params.value[2];
                    }
                }
            },
            geo: { //地理坐标系组件用于地图的绘制
                map: 'china',//地图类型
                label: { //图形上的文本标签
                    emphasis: {
                        show: true //高亮状态下的多边形和标签样式显示
                    },
                    normal: {
                        show: false //默认状态下多边形和标签样式隐藏
                    }
                },
                roam: false, //禁止其放大缩小

                itemStyle: { //地图区域的多边形图形样式
                    normal: {
                        areaColor: '#4c60ff', //地图区域的颜色
                        borderColor: '#002097' //图形的描边颜色
                    },
                    emphasis: {
                        areaColor: '#293fff' //高亮状态下地图区域的颜色
                    }
                }
            },
            series: [
                {
                    type: 'scatter', //散点（气泡）图
                    coordinateSystem: 'geo', //使用地理坐标系
                    data: convertData(data), //系列中的数据内容数组
                    symbolSize: function (val) { //标记的大小
                        return val[2] / 15;
                    },
                    label: { //图形上的文本标签
                        normal: {
                            formatter: '{b}', //标签内容格式器
                            position: 'right', //标签的位置
                            show: false //是否显示标签
                        },
                        emphasis: {
                            show: true //高亮的图形和标签样式
                        }
                    },
                    itemStyle: { //图形样式
                        normal: {
                            color: '#ffeb7b'
                        }
                    }
                }
            ]
        };

        //地图上地区点击事件，切换地区
        myChart.on('click', function (params) {
            console.log(params.name, params.value)
            $('.mapClickName').html(params.name)
            //写点击之后进行的操作
        })
        myChart.setOption(option);
        // echart图表自适应
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

})