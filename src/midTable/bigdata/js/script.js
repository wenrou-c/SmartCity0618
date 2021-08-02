  //利用全局的fontSize实现适配,浏览器窗口变动了就取窗口的宽度/20 作为fontSize
  $(document).ready(function () {
    var w = $(window).width()
    $("html").css({ fontSize: w / 20 })
    $(window).resize(function () {
      var w = $(window).width()
      $("html").css({ fontSize: w / 20 })
    });
  });
var mychart1;
//定时器
var chart1Interval;
//消息弹出函数
var message_timer = null;

function message_show(t) {
    if (message_timer) {
        clearTimeout(message_timer);
    }
    message_timer = setTimeout(function() {
        $("#toast").removeClass("toast_show");
    }, 3000);
    $("#toast_txt").text(t);
    $("#toast").addClass("toast_show");
}
$(function () {
    echarts_1();
    echarts_2();
    echarts_3();
    echarts_4();
    //日历下拉选
    $("#dateSelect").change(function () {
        var opt = $("#dateSelect").val();
        $(".calender input").val('')
        switch (opt) {
            case '0':
                $("#laydateYearId").css('display', 'block');
                $("#laydateYearId").siblings('input').css('display', 'none')
                break;
            case '1':
                $("#laydateMonthId").css('display', 'block');
                $("#laydateMonthId").siblings('input').css('display', 'none')
                break;
            case '2':
                $("#laydateDateId").css('display', 'block');
                $("#laydateDateId").siblings('input').css('display', 'none')
                break;
        }
    });
    // 日历--日
    laydate.render({
        elem: '#laydateDateId', //指定元素
        theme: '#297BFF',
        value: new Date('2018-01-01'),
        type: 'date', //year  month 
        btns: ['clear', 'confirm'],
        done: function (value, date) { //监听日期被切换
            updateChartByParameter(value, 'date')
        }
    });
    // 日历--月
    laydate.render({
        elem: '#laydateMonthId', //指定元素
        theme: '#297BFF',
        type: 'month',
        btns: ['clear', 'confirm'],
        done: function (value, date) { //监听日期被切换
            updateChartByParameter(value, 'month')
        }
    });
    // 日历--年
    laydate.render({
        elem: '#laydateYearId', //指定元素
        theme: '#297BFF',
        type: 'year',
        btns: ['clear', 'confirm'],
        done: function (value, date) { //监听日期被切换
            updateChartByParameter(value, 'year')
        }
    });
    // 能耗阈值
    $('#nstSliderS').nstSlider({
        "left_grip_selector": "#leftGripS",
        "value_bar_selector": "#barS",
        "value_changed_callback": function (cause, leftValue, rightValue) {
            var $container = $(this).parent(),
                g = 255 - 127 + leftValue,
                r = 255 - g,
                b = 0;
            $container.find('#leftLabelS').text(rightValue);
            $container.find('#rightLabelS').text(leftValue);
            $(this).find('#barS').css('background', 'rgb(' + [r, g, b].join(',') + ')');
            console.log("阈值更新：" + leftValue);
            $('#alimenergy').val(leftValue)
        }
    });
    //温度阈值
    $('#nstSliderS2').nstSlider({
        "left_grip_selector": "#leftGripS2",
        "value_bar_selector": "#barS2",
        "value_changed_callback": function (cause, leftValue, rightValue) {
            var $container = $(this).parent(),
                g = 255 - 0 + leftValue,
                r = 255 - g,
                b = 0;
            $container.find('#leftLabelS2').text(rightValue);
            $container.find('#rightLabelS2').text(leftValue);
            $(this).find('#barS2').css('background', 'rgb(' + [r, g, b].join(',') + ')');
            console.log("温度阈值更新：" + leftValue);
            $('#alimtemp').val(leftValue)
        }
    });
    //能耗、温度按钮点击事件
    $(".left button").click(function () {
        $(this).addClass("select").siblings().removeClass("select");
    });
    //默认条件的能耗和温度，固定时间2018-01-01
    function echarts_1() {
        //添加loading
        var loading = echarts.init(document.getElementById('echart1'), 'base');
        loading.showLoading({
            text: 'loading...', //加载时候的文本
            color: 'green', //加载时候小圆圈的颜色
            textColor: 'white', //加载时候文本颜色
            maskColor: 'transparent', //加载时候的背景颜色
        });
        //发送请求，获取指定日期的能耗和温度
        $.ajax({
            type: "get",
            async: true,
            url: 'http://192.168.10.200:5000/API/base-api/query-electricity/?page=1&page_size=100&date_time=2018-01-01', //请求路径
            dataType: "json", //返回数据形式为json
            success: function (res) {
                if (res) {
                    var timers1 = []; //时间数组（实际用来盛放X轴坐标值）
                    var powers1 = []; //能耗数组（实际用来盛放Y坐标值）
                    var temperatures1 = []; //温度数组（实际用来盛放Y坐标值）
                    var maxPower = 0,
                        maxTemp = 0
                    for (var i = 0; i < res.results.length; i++) {
                        var dd = moment(res.results[i].datetime).format('HH:mm:ss');
                        timers1.push(`${dd}`); //取出时间并填入时间数组
                        powers1.push(res.results[i].power); //取出能耗并填入能耗数组
                        temperatures1.push(res.results[i].temperature); //取出温度并填入温度数组
                        if (maxPower < res.results[i].power) {
                            maxPower = res.results[i].power
                        }
                        if (maxTemp < res.results[i].temperature) {
                            maxTemp = res.results[i].temperature
                        }
                    }
                    //刻度最大值
                    maxPower = parseInt(maxPower / 10) * 10 + 20
                    maxTemp = parseInt(maxTemp / 10) * 10
                    //设置option
                    var option = changeOption(timers1.slice(0, 13), powers1.slice(0, 13), temperatures1.slice(0, 13), maxPower, maxTemp)
                    //初始化图表
                    mychart1 = echarts.init(document.getElementById('echart1'));
                    //定时2s更新数据（清除定时器），动态显示12条数据
                    var count = 1;
                    clearInterval(chart1Interval);
                    chart1Interval = setInterval(function () {
                        option.series[0].data = powers1.slice(count, count + 13)
                        option.series[1].data = temperatures1.slice(count, count + 13)
                        option.xAxis[0].data = timers1.slice(count, count + 13)
                        mychart1.setOption(option);
                        if (count == res.results.length - 13) {
                            count = 0;
                        } else {
                            count++;
                        }
                    }, 2000);
                    // echart图表随浏览器窗口自适应
                    window.addEventListener('resize', function () {
                        mychart1.resize()
                    });
                    loading.hideLoading(); //关闭加载
                }

            },
            //服务器未连接
            error: function (res) {
                //设置option
                var option = changeOption([], [], [], 0, 0)
                loading.hideLoading(); //关闭加载
                mychart1 = echarts.init(document.getElementById('echart1'));
                mychart1.setOption(option);
            }
        })
    }
    //图表的配置项和数据封装(timers1--横坐标 powers1--能耗数组 temperatures1--温度数组 maxPower--能耗最大值 maxTemp--温度最大值)
    function changeOption(timers1, powers1, temperatures1, maxPower, maxTemp) {
        // 指定图表的配置项和数据
        var option = {
            //提示框组件
            tooltip: {
                trigger: 'axis' //坐标轴触发
            },
            //图例组件
            legend: {
                data: ['能耗', '温度'], //图例的数据数组,数组项通常为一个字符串
                //图例的文本样式
                textStyle: {
                    color: '#fff',
                    fontSize: 11
                }
            },
            //用于区域缩放
            dataZoom: {
                show: false,
                start: 0,
                end: 100
            },
            //调色盘颜色列表
            color: ['#29E8F7', '#2670F7'],
            //直角坐标系 grid 中的 x 轴
            xAxis: [{
                type: 'category', //类目轴，适用于离散的类目数据
                boundaryGap: true, //坐标轴两边留白策略
                //坐标轴在 grid 区域中的分隔线。
                splitLine: {
                    show: false
                },

                //设置坐标轴字体颜色
                axisLine: {
                    lineStyle: {
                        color: '#fff'
                    }
                },
                //是否显示坐标轴刻度
                axisTick: {
                    show: false
                },
                data: timers1 //类目数据
            }],
            //直角坐标系 grid 中的 y轴 能耗和温度
            yAxis: [{
                    type: 'value', //数值轴
                    name: '能耗（J）', //坐标轴名称
                    max: maxPower, //坐标轴刻度最大值
                    min: 0, //坐标轴刻度最小值
                    boundaryGap: [0.2, 0.2], //坐标轴两边留白策略
                    axisLine: {
                        lineStyle: {
                            color: '#03b7e0' //坐标轴线线的颜色
                        },
                    },
                    axisTick: {
                        show: false //是否显示坐标轴刻度
                    },
                    splitLine: {
                        show: false //坐标轴在 grid 区域中的分隔线是否显示
                    },
                },
                {
                    type: 'value', //数值轴
                    name: '温度（℃）', //坐标轴名称
                    max: maxTemp, //坐标轴刻度最大值
                    min: 50, //坐标轴刻度最小值
                    boundaryGap: [0.2, 0.2],
                    axisLine: {
                        lineStyle: {
                            color: '#03b7e0'
                        }
                    },
                    axisTick: { //是否显示坐标轴刻度
                        show: false
                    },
                    splitLine: {
                        show: false
                    }
                }
            ],
            //设置图表显示类型  能耗--折线图  温度--柱状图
            series: [{
                    name: '能耗', //系列名称
                    type: 'line', //折线图
                    symbol: 'circle', //标记的图形
                    symbolSize: 6, //标记的大小
                    data: powers1, //系列中的数据内容数组
                    //区域填充样式
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            offset: 0,
                            color: '#0bcece'
                        }, {
                            offset: 1,
                            color: 'rgba(11, 206, 206,0)'
                        }])
                    },
                    //折线拐点标志的样式
                    itemStyle: {
                        normal: {
                            color: function (value) {
                                // console.log(value.data)
                                if (value.data >= ($('#alimenergy').val() || 50)) {
                                    return 'red'
                                }
                                return '#2FE2ED'
                            },
                            lineStyle: {
                                color: '#0bcece'
                            }
                        }
                    }
                },
                {
                    name: '温度', //系列名称
                    type: 'bar', //柱状图
                    yAxisIndex: 1, //使用的 y 轴的 index，在单个图表实例中存在多个 y轴的时候有用
                    data: temperatures1, //系列中的数据内容数组
                    //折线拐点标志的样式
                    itemStyle: {
                        normal: {
                            color: function (value) {
                                if (value.data >= ($('#alimtemp').val() || 50)) {
                                    return '#DB390A'
                                }
                                return '#30B9D4'
                            },

                        }
                    }

                }

            ],
            //grid 为直角坐标系内绘图网格
            grid: {
                x: 50,
                y: 50,
                x2: 50,
                y2: 30
            },
        };
        return option;
    }
    //选择时间类型数据更新能耗和温度 date为年 月 日
    function updateChartByParameter(date, flag) {
        var reqUrl = 'http://192.168.10.200:5000/API/base-api/query-electricity/?page=1&page_size=100'
        if (date) reqUrl += '&date_time=' + date;
        $.ajax({
            type: "get",
            async: true,
            url: reqUrl, //请求路径
            dataType: "json", //返回数据形式为json
            success: function (res) {
                if (res) {
                    var temData = [];
                    var timer = []; //时间数组（实际用来盛放X轴坐标值）
                    var powers1 = [];
                    var temperatures1 = [];
                    //切换日期到日
                    if (flag == 'date') {
                        var timers1 = []; //时间数组（实际用来盛放X轴坐标值）
                        var powers1 = []; //能耗数组（实际用来盛放Y坐标值）
                        var temperatures1 = [];
                        var maxPower = 0,
                            maxTemp = 0
                        for (var i = 0; i < res.results.length; i++) {
                            var dd = moment(res.results[i].datetime).format('HH:mm:ss');
                            timers1.push(`${dd}`);
                            powers1.push(res.results[i].power); //取出能耗并填入能耗数组
                            temperatures1.push(res.results[i].temperature); //取出温度并填入温度数组
                            if (maxPower < res.results[i].power) {
                                maxPower = res.results[i].power
                            }
                            if (maxTemp < res.results[i].temperature) {
                                maxTemp = res.results[i].temperature
                            }
                        }
                        //刻度最大值
                        maxPower = parseInt(maxPower / 10) * 10 + 20
                        maxTemp = parseInt(maxTemp / 10) * 10 + 20
                        //最多显示的条数
                        var option = changeOption(timers1.slice(0, 13), powers1.slice(0, 13), temperatures1.slice(0, 13), maxPower, maxTemp)
                        mychart1 = echarts.init(document.getElementById('echart1'));
                        var count = 0;
                        clearInterval(chart1Interval)
                        chart1Interval = setInterval(function () {
                            option.series[0].data = powers1.slice(count, count + 13)
                            option.series[1].data = temperatures1.slice(count, count + 13)
                            option.xAxis[0].data = timers1.slice(count, count + 13)
                            mychart1.setOption(option);
                            if (count == res.results.length - 13) {
                                count = 0;
                            } else {
                                count++;
                            }
                        }, 2000);
                    } else if (flag == 'month') { //切换日期到月
                        var timers1 = []; //时间数组（实际用来盛放X轴坐标值）
                        var powers1 = []; //能耗数组（实际用来盛放Y坐标值）
                        var maxPower = 0,
                            maxTemp = 0
                        for (var i = 0; i < res.results.length; i++) {
                            var dd = moment(res.results[i].datetime).format('YYYY-MM-DD');
                            timers1.push(`${dd}`);
                            powers1.push(res.results[i].power); //取出能耗并填入能耗数组
                            temperatures1.push(res.results[i].temperature); //取出温度并填入温度数组
                            if (maxPower < res.results[i].power) {
                                maxPower = res.results[i].power
                            }
                            if (maxTemp < res.results[i].temperature) {
                                maxTemp = res.results[i].temperature
                            }
                        }
                        //刻度最大值
                        maxPower = parseInt(maxPower / 10) * 10 + 10
                        maxTemp = parseInt(maxTemp / 10) * 10 + 10
                        var option = changeOption(timers1.slice(0, 13), powers1.slice(0, 13), temperatures1.slice(0, 13), maxPower, maxTemp)
                        mychart1 = echarts.init(document.getElementById('echart1'));
                        var count = 1;
                        clearInterval(chart1Interval)
                        chart1Interval = setInterval(function () {
                            option.series[0].data = powers1.slice(count, count + 13)
                            option.series[1].data = temperatures1.slice(count, count + 13)
                            option.xAxis[0].data = timers1.slice(count, count + 13)
                            mychart1.setOption(option);
                            if (count == res.results.length - 13) {
                                count = 0;
                            } else {
                                count++;
                            }
                        }, 2000);
                    } else { //切换日期到年
                        var timers1 = []; //时间数组（实际用来盛放X轴坐标值）
                        var powers1 = []; //能耗数组（实际用来盛放Y坐标值）
                        var temperatures1 = []; //温度数组（实际用来盛放Y坐标值）
                        var maxPower = 0,
                            maxTemp = 0
                        for (var i = 0; i < res.results.length; i++) {
                            var dd = moment(res.results[i].datetime).format('YYYY-MM');
                            timers1.push(`${dd}`);
                            powers1.push(res.results[i].power); //取出能耗并填入能耗数组
                            temperatures1.push(res.results[i].temperature); //取出温度并填入温度数组
                            if (maxPower < res.results[i].power) {
                                maxPower = res.results[i].power
                            }
                            if (maxTemp < res.results[i].temperature) {
                                maxTemp = res.results[i].temperature
                            }
                        }
                        maxPower = parseInt(maxPower / 10) * 10 + 10
                        maxTemp = parseInt(maxTemp / 10) * 10 + 10
                        clearInterval(chart1Interval)
                        var option = changeOption(timers1, powers1, temperatures1, maxPower, maxTemp)
                        mychart1 = echarts.init(document.getElementById('echart1'));
                        mychart1.setOption(option);
                    }
                    // echart图表自适应
                    window.addEventListener('resize', function () {
                        mychart1.resize()
                    });
                }
            }
          
        })
    }

    //预测未来显示区能耗和温度
    function echarts_3() {
        var timers2 = []; //时间数组（实际用来盛放X轴坐标值）
        var powers2 = []; //能耗数组（实际用来盛放Y坐标值）
        var temperatures2 = []; //温度数组（实际用来盛放Y坐标值）
        $.ajax({
            type: "get",
            async: true,
            url: 'http://192.168.10.200:5000/API/base-api/query-electricity-predict/', //请求路径
            dataType: "json", //返回数据形式为json
            success: function (res) {
                if (res) {
                    for (var i = 0; i < res.results.length; i++) {
                        //时间格式化
                        var dd = moment(res.results[i].datetime).format('YYYY-MM');
                        timers2.push(`${dd}`);
                        powers2.push(res.results[i].power); //取出能耗并填入能耗数组
                        temperatures2.push(res.results[i].temperature); //取出温度并填入温度数组
                    }
                    // 图表的配置项和数据
                    var option = {
                        title: {
                            text: ''
                        },
                        tooltip: {
                            trigger: 'axis'
                        },
                        legend: {
                            data: ['能耗', '温度'],
                            textStyle: {
                                color: '#fff',
                                fontSize: 11
                            }
                        },
                        xAxis: {
                            axisTick: {
                                show: false
                            },
                            data: timers2,
                            axisLine: {
                                lineStyle: {
                                    color: '#fff'
                                }
                            },
                        },
                        color: '#00FFFF',
                        yAxis: [{
                                splitLine: {
                                    show: false
                                },
                                axisTick: {
                                    show: false
                                },
                                max: 83.07000,
                                min: 83.05000,
                                name: '能耗（ J ）',
                                axisLine: {
                                    lineStyle: {
                                        color: '#03b7e0'
                                    },
                                },
                            },
                            {
                                type: 'value',
                                scale: true,
                                name: '温度（℃）',
                                max: 61.31,
                                min: 61.3099,
                                boundaryGap: [0.2, 0.2],
                                axisLine: {
                                    lineStyle: {
                                        color: '#03b7e0'
                                    }
                                },
                                axisTick: {
                                    show: false
                                },
                                splitLine: {
                                    show: false
                                },

                                axisLabel: {
                                    fontSize: 9,
                                },

                            }
                        ],
                        series: [{
                                name: '能耗',
                                type: 'line',
                                data: powers2,
                                areaStyle: {
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: '#0bcece'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(11, 206, 206,0)'
                                    }])
                                },
                                itemStyle: {
                                    normal: {
                                        lineStyle: {
                                            width: 2,
                                            type: 'dotted' //'dotted'虚线 'solid'实线
                                        }
                                    }
                                }
                            },
                            {
                                name: '温度',
                                type: 'bar',
                                yAxisIndex: 1,
                                data: temperatures2,
                                itemStyle: {
                                    color: 'transparent',
                                    barBorderColor: '#188df0',
                                    barBorderWidth: 2,
                                    borderType: "dotted"
                                },
                                emphasis: {
                                    itemStyle: {
                                        color: new echarts.graphic.LinearGradient(
                                            0, 0, 0, 1,
                                            [{
                                                    offset: 0,
                                                    color: '#2378f7'
                                                },
                                                {
                                                    offset: 0.7,
                                                    color: '#2378f7'
                                                },
                                                {
                                                    offset: 1,
                                                    color: '#83bff6'
                                                }
                                            ]
                                        )
                                    }
                                },
                            }
                        ],
                        grid: {
                            x: 50,
                            y: 50,
                            x2: 50,
                            y2: 30
                        },
                    };
                    //初始化
                    mychart = echarts.init(document.getElementById('echart3'));
                    mychart.setOption(option);
                    // echart图表自适应浏览器窗口，重新加载
                    window.addEventListener('resize', function () {
                        mychart.resize()
                    });
                }
            },
             //服务器未连接
             error: function (res) {
                message_show("服务器未连接！");
                //设置option
                var option = changeOption([], [], [], 0, 0)
                mychart3 = echarts.init(document.getElementById('echart3'));
                mychart3.setOption(option);
            }
        })
    }
    //各地区异常能耗百分比--饼图
    function echarts_2() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart2'));
        //图表的配置项和数据
        var option = {
            title: [{
                left: 'center',
                textStyle: {
                    color: '#fff',
                    fontSize: '16'
                }

            }],
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)",
                position: function (p) { //其中p为当前鼠标的位置
                    return [p[0] + 10, p[1] - 10];
                }
            },
            legend: {
                top: '85%',
                itemWidth: 10,
                itemHeight: 10,
                data: ['武汉', '杭州', '北京', '广州'],
                textStyle: {
                    color: 'rgba(255,255,255,.5)',
                    fontSize: '12',
                }
            },
            series: [{
                name: '异常能耗',
                type: 'pie',
                center: ['50%', '42%'],
                radius: ['40%', '60%'],
                color: ['#066eab', '#0682ab', '#0696ab', '#06a0ab'],
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                data: [{
                        value: 1,
                        name: '武汉'
                    },
                    {
                        value: 6,
                        name: '杭州'
                    },
                    {
                        value: 2,
                        name: '北京'
                    },
                    {
                        value: 1,
                        name: '广州'
                    }
                ]
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        // echart图表自适应
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }
    //各地区总能耗
    function echarts_4() {
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('echart4'));
        var dataStyle = {
            normal: {
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
            }
        };
        var placeHolderStyle = {
            normal: {
                color: 'rgba(255,255,255,.05)',
                label: {
                    show: false,
                },
                labelLine: {
                    show: false
                }
            },
            emphasis: {
                color: 'rgba(0,0,0,0)'
            }
        };
        //图表的配置项和数据
        var option = {
            //全局调色盘,定义后会覆盖主题调色盘,即颜色的取色从这里取
            color: ['#0f63d6', '#0f78d6', '#0f8cd6', '#0fa0d6', '#0fb4d6'],
            //提示框组件
            tooltip: {
                show: true, //是否显示提示框组件
                formatter: "{a} : {c}" //提示框浮层内容格式器
            },
            //图例组件,图例组件展现了不同系列的标记颜色和名字。可以通过点击图例控制哪些系列不显示。
            legend: {
                itemWidth: 10, //图例标记的图形宽度
                itemHeight: 10, //图例标记的图形高度
                itemGap: 12, //图例每项之间的间隔
                bottom: '3%', //图例组件离容器下侧的距离
                data: ['武汉', '杭州', '北京', '广州'], //图例的数据数组,数组项通常为一个字符串
                textStyle: {
                    color: 'rgba(255,255,255,.6)', //文字的颜色
                }
            },
            //系列列表
            series: [{
                    name: '武汉', //系列名称
                    type: 'pie', //饼图
                    clockWise: false, //饼图的扇区是否是顺时针排布
                    center: ['50%', '42%'], //饼图的中心（圆心）坐标
                    radius: ['49%', '60%'], //饼图的半径
                    itemStyle: dataStyle, //图形样式
                    hoverAnimation: false, //是否开启 hover 在扇区上的放大动画效果。
                    //数据内容数组
                    data: [{
                        value: 80,
                        name: '01'
                    }, {
                        value: 20,
                        name: 'invisible',
                        tooltip: {
                            show: false
                        },
                        itemStyle: placeHolderStyle //折线拐点标志的样式。
                    }]
                },
                {
                    name: '杭州',
                    type: 'pie',
                    clockWise: false,
                    center: ['50%', '42%'],
                    radius: ['39%', '50%'],
                    itemStyle: dataStyle,
                    hoverAnimation: false,
                    data: [{
                        value: 70,
                        name: '02'
                    }, {
                        value: 30,
                        name: 'invisible',
                        tooltip: {
                            show: false
                        },
                        itemStyle: placeHolderStyle
                    }]
                },

                {
                    name: '北京',
                    type: 'pie',
                    clockWise: false,
                    hoverAnimation: false,
                    center: ['50%', '42%'],
                    radius: ['29%', '40%'],
                    itemStyle: dataStyle,
                    data: [{
                        value: 60,
                        name: '04'
                    }, {
                        value: 40,
                        tooltip: {
                            show: false
                        },
                        itemStyle: placeHolderStyle
                    }]
                },
                {
                    name: '广州',
                    type: 'pie',
                    clockWise: false,
                    hoverAnimation: false,
                    center: ['50%', '42%'],
                    radius: ['20%', '30%'],
                    itemStyle: dataStyle,
                    data: [{
                        value: 50,
                        name: '05'
                    }, {
                        value: 50,
                        tooltip: {
                            show: false
                        },
                        itemStyle: placeHolderStyle
                    }]
                },
            ]
        };

        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);
        // echart图表自适应
        window.addEventListener("resize", function () {
            myChart.resize();
        });
    }

})
// loading
$(window).load(function () {
    $(".loading").fadeOut()
})
