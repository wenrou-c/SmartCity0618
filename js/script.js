// loading
$(window).load(function() {
    $('.loading').fadeOut()
})
var cflag = false;
var vm = new Vue({
    el: '#warp',
    data: {
        infos: [{ info: '在国家新基建发展热潮的背景下，智慧灯杆因为融合了无线基站、充电桩、车路协同设备，以及大数据和人工智能等新技术，逐渐成为新型基础设施。智慧城市产学研创实验室提供智慧灯杆实训系统，提供微基站、气象站、充电桩、广告机、安防监控、城市巡检等功能。' }, { info: '以智慧灯杆的微基站为节点中枢，覆盖Wi-Fi、ZigBee、LoRa、NB-IoT等异构传感网络，将城市设施无线串联起来，让数据、信息、控制无处不在、无时不在。智慧城市产学研创实验室提供智慧路灯、水电管网、智能井盖、智能消防栓、智能垃圾桶、共享单车管控等功能。' }, { info: '智慧交通系统基于人工智能、机器人和无人驾驶技术，通过多种车联网无线通信协议，集成机器视觉、智能感知和智能控制等算法模块，打造智慧城市中人车协同、车车协同、车机协同等智慧交通场景。该系统包含智能道路、智能停车、智能ETC、智能小车、智能路标、智能红绿灯等系统,实现了ROS车辆定位和SLAM导航、ROS路径规划、交通标志识别、红绿灯识别、行人及多目标监测、车车通信等功能，集中体现了AI技术在机器人无人驾驶领域的创新应用。' }, { info: '智慧中台为智慧城市提供计算、运维、网络、应用等基础功能，通过云计算技术对服务器计算资源进行虚拟化管理和运维，为应用提供AI算力服务、IoT云服务平台、应用资源池等功能。' }, ],
        curpage: 0,
        trashName: ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'],
        // 摄像头相关
        camState: [0, 0, 0, 0],
        switch_cam: [0, 0, 0, 0],
        flag: [0, 0, 0, 0],
        camInfo:['http://192.168.10.240:30010/rtsp2jpegstream?rtsp=rtsp://admin:zonesion123@192.168.20.8/Streaming/Channels/502',
                 'http://192.168.10.240:30010/rtsp2jpegstream?rtsp=rtsp://admin:zonesion123@192.168.20.8/Streaming/Channels/602',
                 'http://192.168.10.240:30010/rtsp2jpegstream?rtsp=rtsp://admin:zonesion123@192.168.20.8/Streaming/Channels/302',
                 'http://192.168.10.240:30010/rtsp2jpegstream?rtsp=rtsp://admin:zonesion123@192.168.20.8/Streaming/Channels/402']
    },
    methods: {
        // 数据连接 扫描分享
        // 历史数据
        showModal(e) {
            var e = e.currentTarget;
            var name = $(e).siblings('.titImg').text();
            console.log(name);
            if (name.indexOf('消防栓') > -1) {
                $('.p2Type,.hydrantCont').removeClass('hidden');
            } else {
                $('.p2Type,.hydrantCont').addClass('hidden');
            }
            $('#p2Modal .modal-title').text(name + '更多信息');
            var i = $(e).siblings('.hinSpanNav').find('.act').index();
            $('.modalTip').text(i)
            $('#p2Modal').modal('show'); //手动显示modal
            chart('hisChart', null, '');
            if (name.indexOf('垃圾') > -1) {
                drawSlider(p2M[name].th[0], p2M[name].th[1], p2M[name].item[0], p2M[name].item[1]);
            } else {
                if (name.indexOf('消防栓') > -1) {
                    showSlider(i)
                }
                drawSlider(p2M[name].th[0], p2M[name].th[1], p2M[name].item[i][0], p2M[name].item[i][1]);
            }
            setTimeout(() => {
                wchart4.resize();
            }, 300);
        },
        saveSlider(e) {
            var e = e.currentTarget;
            var mac, cmd;
            var name = $('#p2Modal .modal-title').text().split('更多信息')[0];
            var i = $('#p2Modal .modalTip').text();
            if (name.indexOf('井盖') > -1) {
                mac = 'mac_505_' + (i * 1 + 1);
            } else if (name.indexOf('消防栓') > -1) {
                mac = 'mac_506_' + (i * 1 + 1);
            } else if (name.indexOf('垃圾') > -1) {
                mac = 'mac_715';
            }
            var cmd = '{' + p2M[name].tag + '=?}';
            if (name.indexOf('消防栓') > -1) {
                cmd = '{A0=?,A1=?,A7=?}';
            }
            console.log(mac, cmd);
            message_show('已保存阈值设置！');
            if (connectFlag) {
                if (localData[mac] != '00:00:00:00:00:00:00:00') {
                    rtc.sendMessage(localData[mac], cmd);
                }
            }
        },
        hisQuery(e) {
            var name = $('#p2Modal .modal-title').text().replace('更多信息', '');
            // 根据name确定哪个元素以及通道
            var time = $('#p2Time').val();
            var i = $('.modalTip').text();
            var str = '',
                channel = '';
            if (name.indexOf('井盖') > -1) {
                str = 'mac_505_' + (i * 1 + 1);
            } else if (name.indexOf('消防栓') > -1) {
                str = 'mac_506_' + (i * 1 + 1);
            } else if (name.indexOf('垃圾') > -1) {
                str = 'mac_715';
            }
            if (name.indexOf('消防栓') > -1) {
                var tag = $('#p2Type').val();
                channel = localData[str] + "_" + tag;
                name = $("#p2Type option:selected").text();
            } else {
                channel = localData[str] + "_" + p2M[name].tag;
            }
            console.log(name, time, channel);
            getchart(name, time, channel)
        },
        // 功能函数
        // 初始化
        nav(i) { //切页
            this.change(i);
            setTimeout(() => {
                this.curpage = i;
                if (i !== 4) {
                    $('#AllMacPage').removeClass('hidden');
                    $('.macPageChid:eq(' + i + ')').removeClass('hidden').siblings().addClass('hidden');
                    if (i == 0) {
                        $('#AllMacPage').text('MAC');
                    }
                    if (i == 1) {
                        $('#AllMacPage').text('智慧灯杆MAC');
                        myChart.resize();
                        myChart1.resize();
                        myChart2.resize();
                        if (!cflag) {
                            $('#nowTimeMess').FontScroll({ time: 3000, scrollNum: 1 });
                            cflag = true;
                        }
                    }
                    if (i == 2) {
                        $('#AllMacPage').text('智慧设施MAC');
                        // wchart1.resize();
                        wchart2.resize();
                        wchart3.resize();
                    }
                    if (i == 3) {
                        $('#AllMacPage').text('智慧交通MAC');
                    }
                } else {
                    $('#AllMacPage').addClass('hidden');
                    $('#leftFrameCloud').attr('src', 'src/midTable/cloud/index.html')
                }

            }, 300);
        },
        change(i) {
            var n = this.curpage;
            if (n < i) {
                $('.main:eq(' + n + ')').addClass('wanimated slideOutLeft');
                $('.main:eq(' + i + ')').removeClass('hide');
                $('.main:eq(' + i + ')').addClass('wanimated slideInRight');
            } else if (n > i) {
                $('.main:eq(' + n + ')').addClass('wanimated slideOutRight');
                $('.main:eq(' + i + ')').removeClass('hide');
                $('.main:eq(' + i + ')').addClass('wanimated slideInLeft');
            }
            if (i) {
                $('.header li').removeClass('act')
                $('.header li:eq(' + (i - 1) + ')').addClass('act')
            } else {
                $('.header li').removeClass('act')
            }
        },
        banner() {
            this.timer = setInterval(() => {
                var i = this.curpage + 1;
                if (i > 5) { i = 0; }
                this.nav(i)
            }, 3000);
        },
        hinSpanNavLi(e) { // 设施小项切页
            var e = e.currentTarget;
            var i = $(e).siblings('.act').index();
            var u = $(e).index();
            if (u == i || i == -1) return;
            $(e).addClass('act').siblings().removeClass('act');
            $(e).parent().siblings('.hinSpanLeft').css('opacity', 0);
            $(e).parent().siblings('.OnLineBox').children().addClass('hidden').eq(u).removeClass('hidden');
            setTimeout(() => {
                $(e).parent().siblings('.hinSpanLeft').addClass('hidden').eq(u).removeClass('hidden');
                $(e).parent().siblings('.hinSpanLeft').css('opacity', 1);
                var id = $(e).parent().siblings('.hinSpanLeft').eq(u).attr('id');
                if (id == 'wchart_2') {
                    wchart2.resize();
                } else if (id == 'wchart_2_2') {
                    wchart2_2.resize();
                } else if (id == 'wchart_3') {
                    wchart3.resize();
                } else if (id == 'wchart_3_2') {
                    wchart3_2.resize();
                }
            }, 300);
        },
        midNav(q) { // 智慧中台分页
            //重新加载云计算iframe src
            if (q == 0) {
                $('#leftFrameCloud').attr('src', 'src/midTable/cloud/index.html')
                $('#cloudStage').removeClass('hidden').siblings('.backmManage').addClass('hidden')
            }
            //重新加载大数据iframe src
            if (q == 1) {
                $('#leftFrameBigData').attr('src', 'src/midTable/bigdata/index.html')
                $('#bigdataStage').removeClass('hidden').siblings('.backmManage').addClass('hidden')
            }
            //重新加载人工智能iframe src
            if (q == 2) {
                $('#leftFrameAi').attr('src', 'src/midTable/ai/index.html')
                $('#aiStage').removeClass('hidden').siblings('.backmManage').addClass('hidden')
            }
            //重新加载区块链iframe src
            if (q == 3) {
                $('#leftFrameQuKuaiLian').attr('src', 'src/midTable/blockchain/index.html')
                $('#blockStage').removeClass('hidden').siblings('.backmManage').addClass('hidden')
            }
        },
        // cam初始化
        camInit() {
            this.myipcamera2 = new WSNCamera(localData.id, localData.key); //创建myipcamera对象
            this.myipcamera2.setDiv("img1"); //设置图像显示的位置
            this.myipcamera3 = new WSNCamera(localData.id, localData.key); //创建myipcamera对象
            this.myipcamera3.setDiv("img2"); //设置图像显示的位置
            this.myipcamera4 = new WSNCamera(localData.id, localData.key); //创建myipcamera对象
            this.myipcamera4.setDiv("img3"); //设置图像显示的位置
            this.myipcamera5 = new WSNCamera(localData.id, localData.key); //创建myipcamera对象
            this.myipcamera5.setDiv("img4"); //设置图像显示的位置
        },
        // 摄像头
        camShow(e) {
            var e = e.currentTarget;
            $(e).find('.conGroup').show();
        },
        camHide(e) {
            var e = e.currentTarget;
            $(e).find('.conGroup').hide();
        },
        ct(str) {
            var thiz = this;
            var i = str.substr(str.length - 1, 1) * 1;
            var str = str.substr(0, str.length - 1);
            var obj;
            switch (i) {
                case 1:
                    obj = thiz.myipcamera2;
                    break;
                case 2:
                    obj = thiz.myipcamera3;
                    break;
                case 3:
                    obj = thiz.myipcamera4;
                    break;
                case 4:
                    obj = thiz.myipcamera5;
                    break;
                default:
                    break;
            }
            console.log(str, i);
            // return;
            if (str == 'shot') {
                if (thiz.camState[i - 1] == 1) {
                    obj.snapshot();
                } else {
                    message_show('请先打开摄像头！')
                }
            } else if (str == 'open') {
                if (!thiz.flag[i - 1]) {
                    thiz.switch_cam[i - 1] = 1;
                    obj.setServerAddr(localData.server);
                    obj.initCamera(localData['addr' + (i + 1)], localData['user' + (i + 1)], localData['pwd' + (i + 1)], localData['type' + (i + 1)]); //摄像头初始化
                    obj.checkOnline(function(state) {
                        if (state == 1) {
                            obj.openVideo(); //打开摄像头并显示
                            thiz.camState[i - 1] = 1;
                        }
                    });
                } else {
                    thiz.switch_cam[i - 1] = 0;
                    thiz.camState[i - 1] = 0;
                    obj.closeVideo(); //关闭视频监控
                    $("#img" + i).attr("src", "img/2.png");
                }
                thiz.flag[i - 1] = !thiz.flag[i - 1];
            } else {
                if ((thiz.switch_cam[i - 1] == 1) && (thiz.camState[i - 1] == 1)) {
                    obj.control(str); //向摄像头发送命令
                } else if (thiz.switch_cam[i - 1] == 0) {
                    message_show('请先打开摄像头！')
                } else if (thiz.camState[i - 1] == 0) {
                    message_show('加载失败，请检查摄像头地址！')
                }
            }
        },
        imgErr(i) {
            message_show('加载失败，请检查摄像头地址！')
            this.camState[i - 1] = 0;
        },
    },
    mounted() {
        // this.banner();
        $('.conGroup').hide(); // page1

    },
})

function getchart(name, time, channel) {
    var wsn = new WSNHistory(localData.id, localData.key);
    wsn[time](channel, function(dat) {
        if (dat.datapoints) {
            if (dat.datapoints.length > 0) {
                var data_v = eval(DataAnalysis1(dat))
                console.log(data_v);
                if (name.indexOf('垃圾') > -1) {
                    console.log(name);
                    var arr = ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'];
                    for (var i = 0; i < 4; i++) {
                        if (arr[i] == name) {
                            for (var j = 0; j < data_v.length; j++) {
                                data_v[j][1] = ((data_v[j][1] + '').split('/')[i]) * 1;
                            }
                            chart('hisChart', data_v, name);
                        }

                    }
                } else {
                    chart('hisChart', data_v, name);
                }
            } else {
                message_show('该时段暂无数据！')
            }
        }
    })
}

$('.tb2 td').mousedown(function() { $(this).find('.iconfont').css('color', '#02fff6') })
$('.tb2 td').mouseup(function() { $(this).find('.iconfont').css('color', '#00e7fd') })
// 首页
$('.tr').mouseover(function() {
    $(this).siblings('.info').css('opacity', '1');
})
$('.col-xs-4 .h50').mouseleave(function() {
    $(this).find('.info').css('opacity', '0');
})
// 设施二级切换
$('.facilityCout li').click(function() {
    $(this).addClass('act').siblings().removeClass('act');
    var i = $(this).index();
    $(this).parent().siblings('.facilityMain').find('.facilitySpan').addClass('hidden').eq(i).removeClass('hidden');
    switch (i) {
        case 0:
            // wchart1.resize();
            wchart2.resize();
            wchart3.resize();
            break;
        default:
            break;
    }
})
// 阈值切换
$('.hisBtn').click(function() {
    var i = $(this).index();
    $(this).addClass('act').siblings().removeClass('act');
    $('#p2Modal .hisBtnInfo').addClass('hidden').eq(i).removeClass('hidden');
    if (i == 0) {
        wchart4.resize();
    }
})
// 阈值设置滑块
function showSlider(n) {
    $('.hydrantCont').empty();
    var node1 = '<div class="nstSlider" id="nstSlider1" data-range_min="' + p2M['水压'].th[0] + '" data-range_max="' + p2M['水压'].th[1] + '" data-cur_min="' + p2M['水压'].item[n][0] + '" data-cur_max="' + p2M['水压'].item[n][1] + '">' +
        '<div class="bar" id="bar1"></div> <div class="leftGrip" id="leftGrip1"></div> <div class="rightGrip" id="rightGrip1"></div> <div class="leftLabel nstSlider-val" id="leftLabel1"></div> <div class="rightLabel nstSlider-val" id="rightLabel1"></div> </div>'
    $(node1).appendTo('.hydrantCont:eq(0)'); //渲染

    var node2 = '<div class="nstSlider" id="nstSlider2" data-range_min="' + p2M['倾斜角度'].th[0] + '" data-range_max="' + p2M['倾斜角度'].th[1] + '" data-cur_min="' + p2M['倾斜角度'].item[n][0] + '" data-cur_max="' + p2M['倾斜角度'].item[n][1] + '">' +
        '<div class="bar" id="bar2"></div> <div class="leftGrip" id="leftGrip2"></div> <div class="rightGrip" id="rightGrip2"></div> <div class="leftLabel nstSlider-val" id="leftLabel2"></div> <div class="rightLabel nstSlider-val" id="rightLabel2"></div> </div>'
    $(node2).appendTo('.hydrantCont:eq(1)'); //渲染

    $('#nstSlider1').nstSlider({
        "left_grip_selector": "#leftGrip1",
        "right_grip_selector": "#rightGrip1",
        "value_bar_selector": "#bar1",
        "value_changed_callback": function(cause, leftValue, rightValue) {
            var $container = $(this).parent();
            $container.find('#leftLabel1').text(leftValue);
            $container.find('#rightLabel1').text(rightValue);
            $('#nstSlider1').nstSlider('highlight_range', leftValue, rightValue);
        },
        "user_mouseup_callback": function(leftValue, rightValue) {
            console.log("阈值更新：" + leftValue + "---" + rightValue);
        },
        "highlight": {
            "grip_class": "gripHighlighted",
            "panel_selector": "#highlightPanel1"
        },
    });

    $('#nstSlider2').nstSlider({
        "left_grip_selector": "#leftGrip2",
        "right_grip_selector": "#rightGrip2",
        "value_bar_selector": "#bar2",
        "value_changed_callback": function(cause, leftValue, rightValue) {
            var $container = $(this).parent();
            $container.find('#leftLabel2').text(leftValue);
            $container.find('#rightLabel2').text(rightValue);
            $('#nstSlider2').nstSlider('highlight_range', leftValue, rightValue);
        },
        "user_mouseup_callback": function(leftValue, rightValue) {
            console.log("阈值更新：" + leftValue + "---" + rightValue);
        },
        "highlight": {
            "grip_class": "gripHighlighted",
            "panel_selector": "#highlightPanel1"
        },
    });
}

function drawSlider(min_num, max_num, cur_min, cur_max) {
    $('.p2Cont').empty();
    var node = '<div class="nstSlider" id="nstSlider0" data-range_min="' + min_num + '" data-range_max="' + max_num + '" data-cur_min="' + cur_min + '" data-cur_max="' + cur_max + '">' +
        '<div class="bar" id="bar0"></div> <div class="leftGrip" id="leftGrip0"></div> <div class="rightGrip" id="rightGrip0"></div> <div class="leftLabel nstSlider-val" id="leftLabel0"></div> <div class="rightLabel nstSlider-val" id="rightLabel0"></div> </div>'
    $(node).appendTo('.p2Cont'); //渲染

    $('#nstSlider0').nstSlider({
        "left_grip_selector": "#leftGrip0",
        "right_grip_selector": "#rightGrip0",
        "value_bar_selector": "#bar0",
        "value_changed_callback": function(cause, leftValue, rightValue) {
            var $container = $(this).parent();
            $container.find('#leftLabel0').text(leftValue);
            $container.find('#rightLabel0').text(rightValue);
            $('#nstSlider0').nstSlider('highlight_range', leftValue, rightValue);
        },
        "user_mouseup_callback": function(leftValue, rightValue) {
            console.log("阈值更新：" + leftValue + "---" + rightValue);
            var name = $('#p2Modal .modal-title').text().split('更多信息')[0];
            var n = $('#p2Modal .modalTip').text();
            var e = $(this).attr('id');
            console.log(name, n);
            if (e == 'nstSlider1') {
                name = '水压';
            } else if (e == 'nstSlider2') {
                name = '倾斜角度';
            }
            if (n == -1) {
                p2M[name].item[0] = leftValue;
                p2M[name].item[1] = rightValue;
            } else {
                p2M[name].item[n][0] = leftValue;
                p2M[name].item[n][1] = rightValue;
            }
        },
        "highlight": {
            "grip_class": "gripHighlighted",
            "panel_selector": "#highlightPanel1"
        },
    });
}
//设施阈值
var p2M = {
    '井盖挥发物': {
        tag: 'A0',
        th: [0, 20000],
        item: [
            [0, 20000],
            [0, 10000],
        ]
    },
    '井盖水位': {
        tag: 'A1',
        th: [0, 5],
        item: [
            [0, 5],
            [0, 3],
        ]
    },
    '井盖水浸状态': {
        tag: 'A6',
        th: [0, 1],
        item: [
            [0, 1],
            [0, 1],
        ]
    },
    '井盖角度': {
        tag: 'A2',
        th: [0, 180],
        item: [
            [0, 180],
            [0, 90],
        ]
    },
    '井盖开合状态': {
        tag: 'A7',
        th: [0, 1],
        item: [
            [0, 1],
            [0, 1],
        ]
    },
    '消防栓数据采集': { //用水量
        tag: 'A0',
        th: [0, 200],
        item: [
            [0, 200],
            [0, 50],
        ]
    },
    '水压': { //水压
        tag: 'A1',
        th: [0, 1000],
        item: [
            [0, 1000],
            [0, 500],
        ]
    },
    '倾斜角度': { //角度
        tag: 'A7',
        th: [0, 90],
        item: [
            [0, 90],
            [0, 50],
        ]
    },
    '可回收垃圾': {
        tag: 'A0',
        th: [0, 20000],
        item: [0, 20000], //重量

    },
    '有害垃圾': {
        tag: 'A0',
        th: [0, 20000],
        item: [0, 20000], //重量
    },
    '厨余垃圾': {
        tag: 'A0',
        th: [0, 20000],
        item: [0, 20000], //重量
    },
    '其他垃圾': {
        tag: 'A0',
        th: [0, 20000],
        item: [0, 20000], //重量
    },
}