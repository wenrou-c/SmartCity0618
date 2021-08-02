$(function () {
    var sizeFunction = function (x) {
        var y = Math.sqrt(4 / x) + 0.1;
        return y * 60;
    };

    function echart_4() {
        chart4 = echarts.init(document.getElementById('box4'));
        chart4.clear();
        option4 = {
            title: [
                {
                    text: '剩余使用寿命(小时)' ,
                    textAlign: 'left',
                    left: '3%',
                    top: '-1%',
                    padding: [12,10],
                    textStyle: {
                        fontSize: 12,
                        color: "#2CCCE8",
                        opacity:0.5
                    },
                    backgroundColor: '#104D84'
                },{
                    text:  currentDeviceRUL,
                    textAlign: 'left',
                    left: '3%',
                    top: '6%',
                    padding: [12,46],
                    textStyle: {
                        fontSize: 12,
                        color: "#2CCCE8",
                        opacity:0.5
                    },
                    backgroundColor: '#104D84'
                }, {
                    text: '●  80-100',
                    textAlign: 'left',
                    left: '85%',
                    top: '0%',
                    textStyle: {
                        color:'#66EE66',
                        fontSize: 12
                    }

                }, {
                    text: '●  20-80',
                    textAlign: 'left',
                    left: '85%',
                    top: '8%',
                    textStyle: {
                        color:'yellow',
                        fontSize: 12
                    }

                }, {
                    text: '●  0-20',
                    textAlign: 'left',
                    left: '85%',
                    top: '16%',
                    textStyle: {
                        color:'red',
                        fontSize: 12
                    }

                },
            ],
            tooltip: {
                show: false
            },
            grid: {
                top: 90,
                bottom: 40
            },
            xAxis: {
                type: 'value',
                name: '剩余使用寿命(小时)',
                nameLocation: 'end',
                nameGap: -60,
                nameTextStyle: {
                    padding: [50, 0, -20, 0],    // 四个数字分别为上右下左与原位置距离
                    color: '#FFFFFF'
                },
                max: 200,
                min: 0,
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
                        color: '#FFFFFF'
                    }
                },
            },
            yAxis: {
                type: 'value',
                name: '失效概率（%）',
                max: 100,
                min: 0,
                axisTick: { //y轴刻度线
                    show: false
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'solid',
                        color: '#FFFFFF'
                    }
                },
                axisLine: {
                    show: true
                },
                nameTextStyle: {
                    color: '#FFFFFF'
                },
                axisLabel: {
                    show: true,
                    showMinLabel: true,
                    showMaxLabel: true,
                    textStyle: {
                        color: '#FFFFFF'    
                    }
                },
            },
            series: [
                {
                    type: 'scatter',
                    data: [[currentDeviceRUL, currentDeviceFailureRate]],
                    itemStyle: {
                        color: '#66EE66',
                    },
                    label: { 
                        show: true,
                        position: 'right',
                        formatter: '剩余使用寿命：{@[0]}小时，失效概率：{@[1]}%'}
                }
            ]
        };

        chart4.setOption(option4);

        setInterval(function () {
             getDeviceRUL(currentDeviceId+15);
        }, 2000);

        $(window).on('resize', function () {
            chart4.resize();
        });
    };
    echart_4();
});
