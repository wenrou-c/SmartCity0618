$(function () {
    // x轴时间序列，每2秒更新
    // var xTimeSeries = [];

    function getXAxisTime() {
        var now = new Date();
        var times = [];
        var len = LEN;
        while (len--) {
            times.unshift(now.format('h:m:s'));
            now = new Date(now - 2000);
        }
        return times;
    };

    function echart_1() {
        var chart1 = echarts.init(document.getElementById('box1'));
        chart1.clear();
        var option1 = {
            title: {
                text: currentDeviceName,
                textStyle: {
                    color: '#fff'
                },
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    animation: false
                }

            },
            grid: {
                top: 60,
                bottom: 20
            },
            color: ['#50C6D6'],
            xAxis: {
                type: 'category',
                boundaryGap: true,
                // data: data_queue,
                data: getXAxisTime(),
                splitLine: {
                    show: true
                },
                axisTick: { //轴刻度线
                    show: true
                },
                axisLine: { //轴
                    show: true
                },
                axisLine: {
                    show: true
                },
                axisLabel: {
                    textStyle: {
                        color: '#EDF6FE'
                    }
                },
            },
            yAxis: [{
                name: '温度(°C)',
                type: 'value',
                min: 0,

                axisTick: { //y轴刻度线
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'solid',
                        color: '#0B2849'
                    }
                },
                axisLine: {
                    show: true
                },
                nameTextStyle: {
                    color: '#EDF6FE'
                },
                axisLabel: {
                    show: true,
                    showMinLabel: true,
                    showMaxLabel: true,
                    textStyle: {
                        color: '#EDF6FE'
                    },
                    formatter: function (value) {
                        return value;
                    }
                },

            }],
            series: [{
                name: '温度(°C)',
                type: 'line',
                symbolSize: 5,
                color: ['#0EFDFE'],
                areaStyle: {
                    color: '#0A3255'
                },
                data: [0.0],
            }]
        };
        chart1.setOption(option1);

        setInterval(function () {
            option1.title.text = currentDeviceName;
            option1.xAxis.data.shift();
            option1.xAxis.data.push(new Date().format('h:m:s'));
            var data1 = [0.0];
            if (data_queue1.length > 0) {
                data1 = data_queue1;
            }
            option1.series[0].data = data1;
            // option.series[1].data = data_queue2,
            chart1.setOption(option1, true);
        }, 2000);

        $(window).on('resize', function () {
            chart1.resize();
        });
    };

    function echart_2() {
        var chart2 = echarts.init(document.getElementById('box2'));
        chart2.clear();
        option2 = {
            grid: {
                top: 60,
                bottom: 20
            },
            tooltip: {
                formatter: '转速(MM/秒): {b}'
            },
            series: [{
                    type: "gauge",
                    center: ["50%", "45%"], // 仪表位置
                    min: 0,
                    max: 200,
                    radius: "90%", //仪表大小
                    startAngle: 225, //开始角度
                    endAngle: -45, //结束角度
                    axisLine: {
                        show: false,
                        lineStyle: { // 属性lineStyle控制线条样式
                            color: [

                                [1, new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                                        offset: 0.1,
                                        color: "#E75F25"
                                    },
                                    {
                                        offset: 0.3,
                                        color: "#C7DD6B"
                                    },
                                    {
                                        offset: 0.4,
                                        color: "#FEEC49"
                                    },
                                    {
                                        offset: 1,
                                        color: "#1CAD52"
                                    }
                                ])]
                            ],
                            width: 10
                        }
                    },
                    splitLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        show: false
                    },
              
                    detail: {
                        show: false
                    },
               
                },
                {
                    type: "gauge",
                    center: ["50%", "45%"], // 默认全局居中
                    radius: "75%", //仪表大小
                    min: 0,
                    max: 200,
                    startAngle: 225,
                    endAngle: -45,
                    axisLine: {
                        show: true,
                        lineStyle: { // 属性lineStyle控制线条样式
                            width: 0, //表盘宽度
                        }
                    },
                    title: { //设置仪表盘中间显示文字样式
                        textStyle: { // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                            fontWeight: 'bolder',
                            fontSize: 10,
                            color: "#A0CD76"
                        }
                    },
                    splitLine: { //分割线样式（及10、20等长线样式）
                        length: 6,
                        lineStyle: { // 属性lineStyle控制线条样式
                            width: 1,
                            color: '#3E89A5'
                        }
                    },
                    axisTick: { //刻度线样式（及短线样式）
                        length: 6,
                        lineStyle: {
                            color: '#3E89A5'
                        }
                    },
                    axisLabel: { //文字样式（及“10”、“20”等文字样式）
                        color: "#3E89A5",
                        fontSize: 10,
                        distance: 2 //文字离表盘的距离
                    },
                    detail: {
                        formatter: "{score|{value}}",
                        offsetCenter: [0, "60%"],
                        height: 0,
                        rich: {
                            score: {
                                color: "#BBF748",
                                fontFamily: "微软雅黑",
                                fontSize: 22
                            }
                        }
                    },
                    pointer: { //指针样式
                        // shadowColor: '#fff', //默认透明
                        width: 4, //控制指针宽度,
                        length: '70%'


                    },
                    itemStyle:{
                        color:'#286BAE',
                        // opacity:0.2
                    },
                    markPoint: {
                        symbol: 'pin',
                        symbolSize: 6,
                        itemStyle: {
                            color: '#255F9E'
                        }
                    },
                  
                    data: [{
                        name: "转速(MM/秒)",
                        value: 0.0,
                    }]
                }
            ]
        };
        chart2.setOption(option2);

        setInterval(function () {
            //option.title.text = currentDeviceName;
            // option.xAxis.data.shift();
            // option.xAxis.data.push(new Date().format('h:m:s'));
            var data2 = 0.0;
            if (data_queue2.length > 0) {
                data2 = data_queue2[data_queue2.length-1];
            }
            option2.series[1].data[0].value = data2;
            // option.series[1].data = data_queue2,
            chart2.setOption(option2, true);
        }, 2000);

        $(window).on('resize', function () {
            chart2.resize();
        });
    };

    echart_1();
    echart_2();
});