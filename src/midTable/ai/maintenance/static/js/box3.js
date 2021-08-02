$(function () {
    function echart_3() {
        chart3 = echarts.init(document.getElementById('box3'));
        option3 = {
            title: {
                text: currentDeviceName,
                textStyle: {
                    color: '#fff'
                },
            },
            grid: {
                top: 60,
                bottom: 20
            },
            tooltip: {
                formatter: '30个周期的失效概率 : {c}%'
            },
            series: [
                {
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
                    }
                },
                {
                    type: "gauge",
                    center: ["50%", "45%"], // 默认全局居中
                    radius: "74.9%", //仪表大小
                    startAngle: 225,
                    endAngle: -45,
                    axisLine: {
                        show: true,
                        lineStyle: { // 属性lineStyle控制线条样式
                            width: 0, //表盘宽度
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
                        formatter: "{score|{value}%}",
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
                        // opacity:0.8
                    },
                    markPoint: {
                        symbol: 'pin',
                        symbolSize: 6,
                        itemStyle: {
                            color: '#255F9E'
                        }
                    },
                    data: [{
                        value: currentDeviceFailureRate,
                    }]
                }
            ]
        };

        chart3.setOption(option3);
        setInterval(function () {
             option3.title.text = currentDeviceName;
             getDeviceFailureRate(currentDeviceId+15);            
        }, 2000);

        $(window).on('resize', function () {
            chart3.resize();
        });
    };

    echart_3();
});