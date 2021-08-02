// 定义本地存储参数
var localData = config;
var localData1 = ai;
// 标志位变量定义
var connectFlag = 0;
var rtc;
var mac2type = {},
    type2mac = {},
    macAll = {};
var airTemp, airHumi, airPress, airPm2;


$(function() {
    loadFirstPage();
    // 获取本地存储的id key server等
    get_localStorage();
    // 主动连接
    getConnect();
    vm.camInit();
    $('.ai_1').val(ai[0].app_id)
    $('.ai_2').val(ai[0].api_key)
    $('.ai_3').val(ai[0].secret_key)
})
/* ********************************** 数据连接 ********************************/
function getConnect() {
    $("#id").val(localData['id']);
    $("#key").val(localData['key']);
    $("#server").val(localData['server']);

    //创建服务连接
    rtc = new WSNRTConnect(localData['id'], localData['key']);
    rtc.setServerAddr(localData['server'] + ":28080");
    rtc.connect();

    // 连接成功回调函数
    rtc.onConnect = function() {
        connectFlag = 1;
        $("#idkeyInput").val("断开").addClass("unlineFlag");
        $("#id,#key,#server").attr('disabled', true)
        message_show("数据服务连接成功！");
        console.log('数据连接成功，查询数据中...')
    };

    // 数据服务掉线回调函数
    rtc.onConnectLost = function() {
        connectFlag = 0;
        wchart3Flag1 = 0;
        wchart3Flag2 = 0;
        $("#idkeyInput").val("连接").removeClass("unlineFlag");
        $("#id,#key,#server").removeAttr('disabled');
        message_show("数据服务连接失败，检查网络或IDKEY");

        // 断联节点状态切换为下线
        $('.online_ico').addClass('hidden');
        $('.unline_ico').removeClass('hidden');
    };

    // 消息处理回调函数
    rtc.onmessageArrive = function(mac, dat) {
        // console.log(mac,">>>", dat);
        if (dat[0] == '{' && dat[dat.length - 1] == '}') {
            var dat0 = dat.substr(1, dat.length - 2);
            var its = dat0.split(',');
            for (var i = 0; i < its.length; i++) {
                var t = its[i].split("=");
                if (t.length != 2) continue;
                console.log(mac,"------------", t[0], t[1]);
                //mac_501智慧路灯
                if (mac == localData.mac_501) {
                    var messArr = document.getElementsByClassName('myPro');
                    var messText = document.getElementsByClassName('l_rig1')
                    $('#MessL .online_ico').removeClass('hidden');
                    $('#MessL2 .online_ico').removeClass('hidden');
                    $('#MessL .unline_ico').addClass('hidden');
                    $('#MessL2 .unline_ico').addClass('hidden');
                    if (t[0] == sensor.mac_501.p100) { //历史用电量
                        messArr[0].value = parseFloat(t[1]);
                        messText[0].innerHTML = parseFloat(t[1]);
                        if (t[1] < userArr_L["threshold"][0] || t[1] > userArr_L["threshold"][1]) {
                            message_show('路灯用电量异常！')
                        }
                    }
                    if (t[0] == sensor.mac_501.p101) { //电流
                        messArr[1].value = parseFloat(t[1]);
                        messText[1].innerHTML = parseFloat(t[1]);
                        if (t[1] < elefluid_L["threshold"][0] || t[1] > elefluid_L["threshold"][1]) {
                            message_show('路灯电流异常！')
                        }
                    }
                    if (t[0] == sensor.mac_501.p102) { //电压
                        messArr[2].value = parseFloat(t[1]);
                        messText[2].innerHTML = parseFloat(t[1]);
                        if (t[1] < elePress_L["threshold"][0] || t[1] > elePress_L["threshold"][1]) {
                            message_show('路灯电压异常！')
                        }
                    }
                    if (t[0] == sensor.mac_501.p103) { //功率
                        messArr[3].value = parseFloat(t[1]);
                        messText[3].innerHTML = parseFloat(t[1]);
                        if (t[1] < powerArr_L["threshold"][0] || t[1] > powerArr_L["threshold"][1]) {
                            message_show('路灯功率异常！')
                        }
                    }
                    if (t[0] == sensor.mac_501.p104) { //人体红外
                        $('#humiL .online_ico').removeClass('hidden');
                        $('#humiL .unline_ico').addClass('hidden');
                        if (t[1] == 1) {
                            $('.theVal_body').text('有人')
                        } else {
                            $('.theVal_body').text('无人')
                        }
                    }
                    if (t[0] == sensor.mac_501.p105) { //光强值
                        messArr[4].value = parseFloat(t[1]);
                        messText[4].innerHTML = parseFloat(t[1]);
                        if (t[1] < sunArr_L["threshold"][0] || t[1] > sunArr_L["threshold"][1]) {
                            message_show('路灯光强异常！')
                        }
                    }
                    if (t[0] == sensor.mac_501.p106) {}
                    if (t[0] == sensor.mac_501.p107) { //倾倒角度
                        messArr[5].value = parseFloat(t[1]);
                        messText[5].innerHTML = parseFloat(t[1]);
                        if (t[1] < angelArr_L["threshold"][0] || t[1] > angelArr_L["threshold"][1]) {
                            message_show('路灯倾斜角度异常！')
                        }
                    }
                    if (t[0] == sensor.mac_501.p108) { //开关控制
                        $('#switchL .online_ico').removeClass('hidden');
                        $('#switchL .unline_ico').addClass('hidden');
						t[1] = t[1] & 0x03;
                        if (t[1] == 0x01) {
                            $('.switchRang input').val('1')
                        } else if (t[1] == 0x02) {
                            $('.switchRang input').val('2')
                        } else if (t[1] == 0x03) {
                            $('.switchRang input').val('3')
                        } else {
                            $('.switchRang input').val('0')
                        }
                    }
                    if (t[0] == sensor.mac_501.p109) { //位置 字符串，形式为b&a，a表示经度，b表示纬度
                        var location = t[1].split('&');
                        var lon=location[0].substring(0, 3)+(location[0].substr(3)/60).toFixed(6).substr(1);//经度
                        var lan=location[1].substring(0, 2)+(location[1].substr(2)/60).toFixed(6).substr(1);//纬度
                        map2 = drawMap('map2', '路灯', lon, lan)
                    }
                }
                //mac_502气象站
                if (mac == localData.mac_502) {
                    if (t[0] == sensor.mac_502.p200) { //温度
                        $('#tempA .online_ico').removeClass('hidden');
                        $('#tempA .unline_ico').addClass('hidden');
                        tempArr.push(parseFloat(t[1]));
                        airTemp = parseFloat(t[1]);
                        var time = nowTime();
                        var nowMessUl = '<li><span>温度</span><span class="nowMess">' + airTemp + '℃</span><span>' + time + '</span></li>'
                        $('#nowMess').append(nowMessUl);
                        if (t[1] < tempArr_A["threshold"][0] || t[1] > tempArr_A["threshold"][1]) {
                            message_show('气象站温度异常！')
                        }
                    }
                    if (t[0] == sensor.mac_502.p201) { //湿度
                        $('#humiA .online_ico').removeClass('hidden');
                        $('#humiA .unline_ico').addClass('hidden');

                        chartOpt1.title.text = '{a|' + parseFloat(t[1]) + '}{c|%RH}'
                        chartOpt1.series[8].data[0].value = parseFloat(t[1]);
                        chartOpt1.series[8].data[1].value = 100 - parseFloat(t[1]);
                        chartOpt1.series[9].data[0].value = parseFloat(t[1]);
                        chartOpt1.series[9].data[1].value = parseFloat(t[1]);
                        myChart1.setOption(chartOpt1, true);

                        airHumi = parseFloat(t[1]);
                        var time = nowTime();
                        var nowMessUl = '<li><span>湿度</span><span class="nowMess">' + airHumi + '%RH</span><span>' + time + '</span></li>'
                        $('#nowMess').append(nowMessUl);

                        if (airHumi < humiArr_A["threshold"][0] || airHumi > humiArr_A["threshold"][1]) {
                            message_show('气象站湿度异常！')
                        }
                    }
                    if (t[0] == sensor.mac_502.p202) { //大气压力
                        $('#pressA .online_ico').removeClass('hidden');
                        $('#pressA .unline_ico').addClass('hidden');
                        $('.theVal_press').text(t[1]);
                        airPress = parseFloat(t[1]);
                        var time = nowTime();
                        var nowMessUl = '<li><span>大气压力</span><span class="nowMess">' + airPress + 'kPa</span><span>' + time + '</span></li>'
                        $('#nowMess').append(nowMessUl);

                        if (airPress < pressArr_A["threshold"][0] || airPress > pressArr_A["threshold"][1]) {
                            message_show('气象站大气压力异常！')
                        }
                    }
                    if (t[0] == sensor.mac_502.p203) { //PM2.5
                        $('#pm2A .online_ico').removeClass('hidden');
                        $('#pm2A .unline_ico').addClass('hidden');
                        $('.theVal_PM2').text(t[1]);
                        airPm2 = parseFloat(t[1]);
                        if (airPm2 < pm2Arr_A["threshold"][0] || airPm2 > pm2Arr_A["threshold"][1]) {
                            message_show('气象站pm2.5异常！');
                            console.log('气象站pm2.5异常1')
                        }
                        var time = nowTime();
                        var nowMessUl = '<li><span>PM2.5</span><span class="nowMess">' + airPm2 + 'ug/m3</span><span>' + time + '</span></li>'
                        $('#nowMess').append(nowMessUl);
                    }
                    if (t[0] == sensor.mac_502.p204) { //PM10
                        $('#pm10A .online_ico').removeClass('hidden');
                        $('#pm10A .unline_ico').addClass('hidden');
                        $('.theVal_PM10').text(t[1]);

                        if (t[1] < pm10Arr_A["threshold"][0] || t[1] > pm10Arr_A["threshold"][1]) {
                            message_show('气象站pm10异常！')
                        }
                    }
                    if (t[0] == sensor.mac_502.p205) { //噪音
                        $('#noiseA .online_ico').removeClass('hidden');
                        $('#noiseA .unline_ico').addClass('hidden');
                        $('.theVal_noise').text(t[1]);

                        if (t[1] < noiseArr_A["threshold"][0] || t[1] > noiseArr_A["threshold"][1]) {
                            message_show('气象站噪音异常！')
                        }
                    }
                    if (t[0] == sensor.mac_502.p206) { //风速
                        $('#windSA .online_ico').removeClass('hidden');
                        $('#windSA .unline_ico').addClass('hidden');
                        $('.theVal_windSpeed').text(t[1]);

                        if (t[1] < windSpeedArr_A["threshold"][0] || t[1] > windSpeedArr_A["threshold"][1]) {
                            message_show('气象站风速异常！')
                        }
                    }
                    if (t[0] == sensor.mac_502.p207) { //风向 风向值，北(0)、东北(45)、东(90)、东南(135)、南(180)、西南(225)、西(270)、西北(315)，单位：度
                        $('#windDA .online_ico').removeClass('hidden');
                        $('#windDA .unline_ico').addClass('hidden');

                        chartOpt2.series[0].data[0].value = parseFloat(t[1]);
                        chartOpt2.series[1].axisLine.lineStyle.color[0] = [parseFloat(t[1]) / xmax, colorSet.color];
                        myChart2.setOption(chartOpt2);

                        if (parseFloat(t[1]) < '45') { $('#windVal').text('东北') } else if (parseFloat(t[1]) < '180') { $('#windVal').text('东南') } else if (parseFloat(t[1]) < '270') { $('#windVal').text('西南') } else if (parseFloat(t[1]) < '360') { $('#windVal').text('西北') }
                    }
                    if (t[0] == sensor.mac_502.p208) { //开关控制

                    }
                    if (t[0] == sensor.mac_502.p209) { //位置
                        var location = t[1].split('&');
                        var lon=location[0].substring(0, 3)+(location[0].substr(3)/60).toFixed(6).substr(1);//经度
                        var lan=location[1].substring(0, 2)+(location[1].substr(2)/60).toFixed(6).substr(1);//纬度
                        map = drawMap('map', '气象站', lon, lan)
                    }
                }
                //mac_503充电桩-----1
                if (mac == localData.mac_503_1) {
                    if (t[0] == sensor.mac_503.p300) { //历史用电量
                        $('.lineState9 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        hisEleArr1.push(parseFloat(t[1]));
                        $('#eleUser1').text(parseFloat(t[1]));
                        //if (t[1] < slideE3_1["threshold"][0] || t[1] > slideE3_1["threshold"][1]) {
                        //    message_show('充电桩1用电量异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p301) { //电流
                        $('.lineState5 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        frequencyArr.push(parseFloat(t[1]));
                        //if (t[1] < slideE2_1["threshold"][0] || t[1] > slideE2_1["threshold"][1]) {
                        //    message_show('充电桩1电流异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p302) { //电压
                        $('.lineState1 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        chartOpt3.series[0].data[0].value = parseFloat(t[1]);
                        myChart3.setOption(chartOpt3);
                        //if (t[1] < slideE1_1["threshold"][0] || t[1] > slideE1_1["threshold"][1]) {
                        //    message_show('充电桩1电压异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p303) { //功率
                        $('.lineState13 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        var powerValue = parseFloat(t[1]);
                        chartOpt7.title.text = powerValue + '(W)';
                        myChart7.setOption(chartOpt7);
                        //if (t[1] < slideE4_1["threshold"][0] || t[1] > slideE4_1["threshold"][1]) {
                        //    message_show('充电桩1功率异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p304) { //实时负载充电量
                        hisPEleArr1.push(parseFloat(t[1]));
                        $('.eleThing1').text(parseFloat(t[1]))
                    }
                    if (t[0] == sensor.mac_503.p305) {}
                    if (t[0] == sensor.mac_503.p306) { //充电开始时间

                    }
                    if (t[0] == sensor.mac_503.p307) { //充电结束时间

                    }
                    if (t[0] == sensor.mac_503.p308) { //开关控制
                        if (t[1] == 1) {
                            $('#mac_503_1').removeClass('switch-off').addClass('switch-on');
                        } else {
                            $('#mac_503_1').removeClass('switch-on').addClass('switch-off');
                        }
                    }
                    if (t[0] == sensor.mac_503.p309) { //位置
                        var location = t[1].split('&');
                        var lon=location[0].substring(0, 3)+(location[0].substr(3)/60).toFixed(6).substr(1);//经度
                        var lan=location[1].substring(0, 2)+(location[1].substr(2)/60).toFixed(6).substr(1);//纬度
                        map1 = drawMap('map1', '充电桩', lon, lan)
                    }
                }
                // mac_503充电桩-----2
                if (mac == localData.mac_503_2) {
                    if (t[0] == sensor.mac_503.p300) { //历史用电量
                        $('.lineState10 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        hisEleArr2.push(parseFloat(t[1]));
                        $('#eleUser2').text(parseFloat(t[1]));
                        //if (t[1] < slideE3_2["threshold"][0] || t[1] > slideE3_2["threshold"][1]) {
                        //    message_show('充电桩2用电量异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p301) { //电流
                        $('.lineState6 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        frequencyArr2.push(parseFloat(t[1]));
                        //if (t[1] < slideE2_2["threshold"][0] || t[1] > slideE2_2["threshold"][1]) {
                        //    message_show('充电桩2电流异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p302) { //电压
                        $('.lineState2 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        chartOpt4.series[0].data[0].value = parseFloat(t[1]);
                        myChart4.setOption(chartOpt4);
                        //if (t[1] < slideE1_2["threshold"][0] || t[1] > slideE1_2["threshold"][1]) {
                        //    message_show('充电桩2电压异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p303) { //功率
                        $('.lineState14 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        var powerValue2 = parseFloat(t[1]);
                        chartOpt8.title.text = powerValue2 + '(W)';
                        myChart8.setOption(chartOpt8);
                       // if (t[1] < slideE4_2["threshold"][0] || t[1] > slideE4_2["threshold"][1]) {
                        //    message_show('充电桩2功率异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p304) { //实时负载充电量
                        hisPEleArr2.push(parseFloat(t[1]));
                        $('.eleThing2').text(parseFloat(t[1]))
                    }
                    if (t[0] == sensor.mac_503.p305) {}
                    if (t[0] == sensor.mac_503.p306) { //充电开始时间

                    }
                    if (t[0] == sensor.mac_503.p307) { //充电结束时间

                    }
                    if (t[0] == sensor.mac_503.p308) { //开关控制
                        if (t[1] == 1) {
                            $('#mac_503_2').removeClass('switch-off').addClass('switch-on');
                        } else {
                            $('#mac_503_2').removeClass('switch-on').addClass('switch-off');
                        }
                    }
                    if (t[0] == sensor.mac_503.p309) { //位置
                    }
                }
                // mac_503充电桩-----3
                if (mac == localData.mac_503_3) {
                    if (t[0] == sensor.mac_503.p300) { //历史用电量
                        $('.lineState11 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        hisEleArr3.push(parseFloat(t[1]));
                        $('#eleUser3').text(parseFloat(t[1]));
                        //if (t[1] < slideE3_3["threshold"][0] || t[1] > slideE3_3["threshold"][1]) {
                        //    message_show('充电桩3用电量异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p301) { //电流
                        $('.lineState7 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        frequencyArr3.push(parseFloat(t[1]));
                        //if (t[1] < slideE2_3["threshold"][0] || t[1] > slideE2_3["threshold"][1]) {
                        //    message_show('充电桩3电流异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p302) { //电压
                        $('.lineState3 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        chartOpt5.series[0].data[0].value = parseFloat(t[1]);
                        myChart5.setOption(chartOpt5);
                        //if (t[1] < slideE1_3["threshold"][0] || t[1] > slideE1_3["threshold"][1]) {
                        //    message_show('充电桩3电压异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p303) { //功率
                        $('.lineState15 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        var powerValue3 = parseFloat(t[1]);
                        chartOpt9.title.text = powerValue3 + '(W)';
                        myChart9.setOption(chartOpt9);
                        //if (t[1] < slideE4_3["threshold"][0] || t[1] > slideE4_3["threshold"][1]) {
                        //    message_show('充电桩3功率异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p304) { //实时负载充电量
                        hisPEleArr3.push(parseFloat(t[1]));
                        $('.eleThing3').text(parseFloat(t[1]))
                    }
                    if (t[0] == sensor.mac_503.p305) {}
                    if (t[0] == sensor.mac_503.p306) { //充电开始时间

                    }
                    if (t[0] == sensor.mac_503.p307) { //充电结束时间

                    }
                    if (t[0] == sensor.mac_503.p308) { //开关控制
                        if (t[1] == 1) {
                            $('#mac_503_3').removeClass('switch-off').addClass('switch-on');
                        } else {
                            $('#mac_503_3').removeClass('switch-on').addClass('switch-off');
                        }
                    }
                    if (t[0] == sensor.mac_503.p309) { //位置

                    }
                }
                // mac_503充电桩-----4
                if (mac == localData.mac_503_4) {
                    if (t[0] == sensor.mac_503.p300) { //历史用电量
                        $('.lineState12 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        hisEleArr4.push(parseFloat(t[1]));
                        $('#eleUser4').text(parseFloat(t[1]));
                        //if (t[1] < slideE3_4["threshold"][0] || t[1] > slideE3_4["threshold"][1]) {
                        //    message_show('充电桩4用电量异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p301) { //电流
                        $('.lineState8 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        frequencyArr4.push(parseFloat(t[1]));
                        //if (t[1] < slideE2_4["threshold"][0] || t[1] > slideE2_4["threshold"][1]) {
                        //    message_show('充电桩4电流异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p302) { //电压
                        $('.lineState4 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        chartOpt6.series[0].data[0].value = parseFloat(t[1]);
                        myChart6.setOption(chartOpt6);
                        //if (t[1] < slideE1_4["threshold"][0] || t[1] > slideE1_4["threshold"][1]) {
                        //    message_show('充电桩4电压异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p303) { //功率
                        $('.lineState16 .online_ico').removeClass('hidden').siblings().addClass('hidden');
                        var powerValue4 = parseFloat(t[1]);
                        chartOpt10.title.text = powerValue4 + '(W)';
                        myChart10.setOption(chartOpt10);
                        //if (t[1] < slideE4_4["threshold"][0] || t[1] > slideE4_4["threshold"][1]) {
                        //    message_show('充电桩4功率异常！')
                        //}
                    }
                    if (t[0] == sensor.mac_503.p304) { //实时负载充电量
                        hisPEleArr4.push(parseFloat(t[1]));
                        $('.eleThing4').text(parseFloat(t[1]))
                    }
                    if (t[0] == sensor.mac_503.p305) {}
                    if (t[0] == sensor.mac_503.p306) { //充电开始时间

                    }
                    if (t[0] == sensor.mac_503.p307) { //充电结束时间

                    }
                    if (t[0] == sensor.mac_503.p308) { //开关控制
                        if (t[1] == 1) {
                            $('#mac_503_4').removeClass('switch-off').addClass('switch-on');
                        } else {
                            $('#mac_503_4').removeClass('switch-on').addClass('switch-off');
                        }
                    }
                    if (t[0] == sensor.mac_503.p309) { //位置

                    }
                }
                for (var ii in localData) {
                    //mac_504_管网(10个)
                    if (ii.indexOf('mac_504_') > -1) {
                        if (mac == localData[ii]) {
                            var n = ii.split('_')[2];
                            //历史用气
                            if (t[0] == sensor["mac_504"].p400) { $('#p400_' + n).text(t[1]); }
                            //气压
                            if (t[0] == sensor["mac_504"].p401) { $('#p401_' + n).text(t[1]); }
                            //燃气浓度
                            if (t[0] == sensor["mac_504"].p402) { $('#p402_' + n).text(t[1]); }
                            //堵塞
                            if (t[0] == sensor["mac_504"].p403) {
                                if (t[1] == 1) { $('#p403_' + n).css('color', '#eb2430') } else { $('#p403_' + n).css('color', '#f8ea42') }
                            }
                            //漏气
                            if (t[0] == sensor["mac_504"].p404) {
                                if (t[1] == 1) { $('#p404_' + n).css('color', '#eb2430') } else { $('#p404_' + n).css('color', '#0ecd19') }
                            }
                            //开关控制
                            if (t[0] == sensor["mac_504"].p405) {
                                if (t[1] & 0x01) { //管道气阀
                                    $('#p405_' + n).parent().prev('.iconfont').css('color', '#eb2430');
                                    if ($('#p405_' + n).hasClass("switch-off")) {
                                        $('#p405_' + n).click();
                                    }
                                } else {
                                    $('#p405_' + n).parent().prev('.iconfont').css('color', '#00e7fd');
                                    if ($('#p405_' + n).hasClass("switch-on")) {
                                        $('#p405_' + n).click();
                                    }
                                }
                            }
                        }
                    }
                    //mac_505_井盖(2个)
                    if (ii.indexOf('mac_505_') > -1) {
                        if (mac == localData[ii]) {
                            var n = ii.split('_')[2];
                            OnLine('505', n);
                            // 井盖下的节点上线标志
                            n == 1 ? wchart3Flag1 = 1 : wchart3Flag2 = 1;
                            //挥发物
                            if (t[0] == sensor["mac_505"].p500) { $('#p500_' + n).text(t[1]); }
                            //水位
                            if (t[0] == sensor["mac_505"].p501) {
                                if (n == 1) { wchart3Num1 = t[1] } else { wchart3Num2 = t[1]; }
                            }
                            //井盖角度
                            if (t[0] == sensor["mac_505"].p502) { chart2('wchart_2', t[1], 100); }
                            //水浸状态
                            if (t[0] == sensor["mac_505"].p503) {
                                if (t[1] == 1) {
                                    $('#p503_' + n).text('浸水').css('color', '#eb2430');
                                } else {
                                    $('#p503_' + n).text('正常').css('color', '#00d300');
                                }
                            }
                            //开合状态
                            if (t[0] == sensor["mac_505"].p504) {
                                if (t[1] == 1) {
                                    $('#p504_' + n).text('打开').css('color', '#eb2430');
                                } else {
                                    $('#p504_' + n).text('关闭').css('color', '#00d300');
                                }
                            }
                            //开关控制
                            if (t[0] == sensor["mac_505"].p505) { /* 没写 */ }
                            //位置
                            if (t[0] == sensor["mac_505"].p506) { /* 井盖位置木得 */ }
                            checkTip(t[0], t[1], 'mac_505', n);
                        }
                    }
                    //mac_506_消防栓(2个)
                    if (ii.indexOf('mac_506_') > -1) {
                        if (mac == localData[ii]) {
                            var n = ii.split('_')[2];
                            OnLine('506', n);
                            $('#p604_' + n).parents('.hinSpan').siblings('.unline_ico').addClass('hidden');
                            $('#p604_' + n).parents('.hinSpan').siblings('.online_ico').removeClass('hidden');
                            //历史用水量
                            if (t[0] == sensor["mac_506"].p600) { $('#p600_' + n).text(t[1]); }
                            //水压
                            if (t[0] == sensor["mac_506"].p601) { $('#p601_' + n).text(t[1]); }
                            //用水报警
                            if (t[0] == sensor["mac_506"].p602) {
                                if (t[1] == 1) {
                                    $('#p602_' + n).text('用水').css('color', '#eb2430');
                                } else {
                                    $('#p602_' + n).text('正常').css('color', '#01dae2');
                                }
                            }
                            //倾倒
                            if (t[0] == sensor["mac_506"].p603) { $('#p603_' + n).text(t[1]); }
                            // 消防栓1开关控制
                            if (t[0] == sensor["mac_506"].p604) {
                                if (t[1] & 0x01) {
                                    $('#p604_' + n).parent().siblings('.valInfo').find('img').css('filter', 'invert(1)');
                                    if ($('#p604_' + n).hasClass("switch-off")) {
                                        $('#p604_' + n).click();
                                    }
                                } else {
                                    $('#p604_' + n).parent().siblings('.valInfo').find('img').css('filter', 'invert(0)');
                                    if ($('#p604_' + n).hasClass("switch-on")) {
                                        $('#p604_' + n).click();
                                    }
                                }
                            }
                            //经纬度
                            if (t[0] == sensor["mac_506"].p605) {
                                var x = t[1].split('&')[0] / 100 //纬度x
                                var y = t[1].split('&')[1] / 100 //经度y
                                // 经纬度转化
                                console.log(x, y);
                                var t = n * 1 - 1;
                                map_506[t].x = x
                                map_506[t].y = y
                                map_506[t].con = "北纬" + x + "，东经" + y;
                                addMark(map_506, map4)
                            }
                            checkTip(t[0], t[1], 'mac_506', n);
                        }
                    }
                    //mac_508_路边停车
                    if (ii.indexOf('mac_508_') > -1) {
                        if (mac == localData[ii]) {
                            var n = ii.split('_')[2];
                            OnLine('508', n);
                            //车位1车牌
                            if (t[0] == sensor["mac_508"].p800) {}
                            //车位2车牌
                            if (t[0] == sensor["mac_508"].p801) {}
                            //车位1状态--充电桩
                            if (t[0] == sensor["mac_508"].p802) {
                                if (t[1] == 1) {
                                    $('#p802_' + n).css('color', '#eb2430');
                                } else {
                                    $('#p802_' + n).css('color', '#0ecd19');
                                }
                            }
                            //车位2状态
                            if (t[0] == sensor["mac_508"].p803) {
                                if (t[1] == 1) {
                                    $('#p803_' + n).css('color', '#eb2430');
                                } else {
                                    $('#p803_' + n).css('color', '#0ecd19');
                                }
                            }
                            //开关控制
                            if (t[0] == sensor["mac_508"].p804) {
                                if (t[1] & 0x01) { //车锁1
                                    // 开（有车状态）
                                    $('#p804_' + n + '_1').prev('.carPark').html('&#xe614;').css('color', '#0ecd19');
                                    if ($('#p804_' + n + '_1').hasClass("switch-off")) {
                                        $('#p804_' + n + '_1').click();
                                    }
                                } else {
                                    $('#p804_' + n + '_1').prev('.carPark').html('&#xe64f;').css('color', '#03ece6');
                                    if ($('#p804_' + n + '_1').hasClass("switch-on")) {
                                        $('#p804_' + n + '_1').click();
                                    }
                                }
                                if (t[1] & 0x02) { //车锁2
                                    $('#p804_' + n + '_2').prev('.carPark').html('&#xe614;').css('color', '#0ecd19');
                                    if ($('#p804_' + n + '_2').hasClass("switch-off")) {
                                        $('#p804_' + n + '_2').click();
                                    }
                                } else {
                                    $('#p804_' + n + '_2').prev('.carPark').html('&#xe64f;').css('color', '#03ece6');
                                    if ($('#p804_' + n + '_2').hasClass("switch-on")) {
                                        $('#p804_' + n + '_2').click();
                                    }
                                }
                            }
                            //更新车位1车牌
                            if (t[0] == sensor["mac_508"].p805) {}
                            //更新车位2车牌
                            if (t[0] == sensor["mac_508"].p806) {}
                            //位置
                            if (t[0] == sensor["mac_508"].p807) {
                                var x = t[1].split('&')[0] / 100 //纬度x
                                var y = t[1].split('&')[1] / 100 //经度y
                                // 改变消防栓1位置-- 待实现
                                var t = n * 1 - 1;
                                map_508[t].x = x
                                map_508[t].y = y
                                map_508[t].con = "北纬" + x + "，东经" + y;
                                addMark(map_508, map5);
                            }
                        }
                    }
                }
                //mac_507_交通灯
                if (mac == localData.mac_507) {
                    //灯1状态，红灯:0,直行:1,左转:2,右转:3
                    if (t[0] == sensor["mac_507"].p700) { checkLed('#p700', t[1]); }
                    //灯2状态
                    if (t[0] == sensor["mac_507"].p701) { checkLed('#p701', t[1]); }
                    //灯3状态
                    if (t[0] == sensor["mac_507"].p702) { checkLed('#p702', t[1]); }
                    //灯4状态
                    if (t[0] == sensor["mac_507"].p703) { checkLed('#p703', t[1]); }
                    //开关控制
                    if (t[0] == sensor["mac_507"].p704) { /* 红绿灯变化和状态不是重复的吗 */ }
                    //红绿灯模式
                    if (t[0] == sensor["mac_507"].p705) { /* 模式在哪里 */ }
                    //位置
                    if (t[0] == sensor["mac_507"].p706) {}
                }
                //mac_509_诱导屏
                if (mac == localData.mac_509) {
                    $('.carLeft .carBox:eq(0)').find('.unline_ico').addClass('hidden').siblings().removeClass('hidden');
                    //停车场1空闲车位数
                    if (t[0] == sensor["mac_509"].p900) { $('#p900').text(t[1]); }
                    //停车场2空闲车位数
                    if (t[0] == sensor["mac_509"].p901) { $('#p901').text(t[1]); }
                    //停车场3空闲车位数
                    if (t[0] == sensor["mac_509"].p902) { $('#p902').text(t[1]); }
                    //停车场4空闲车位数
                    if (t[0] == sensor["mac_509"].p903) { $('#p903').text(t[1]); }
                    //开关控制
                    if (t[0] == sensor["mac_509"].p904) {}
                    //更新停车场车位空闲状态
                    if (t[0] == sensor["mac_509"].p905) {}
                    //位置
                    if (t[0] == sensor["mac_509"].p906) {}
                }
                //mac_715_垃圾桶
                if (mac == localData.mac_715) {
                    for (var j = 0; j < 4; j++) {
                        $('.trashBox:eq(' + j + ') .unline_ico').addClass('hidden');
                        $('.trashBox:eq(' + j + ') .online_ico').removeClass('hidden');
                    }
                    //垃圾重量
                    if (t[0] == sensor["mac_715"].p150) {
                        var f = t[1].split('/');
                        for (var n = 0; n < f.length; n++) {
                            var t;
                            if ($('#p150_' + (n + 1)).text() == '--') {
                                t = f[n];
                            } else {
                                t = f[n] - $('#p150_' + (n + 1)).text() * 1;
                            }
                            $('#p150_' + (n + 1)).text(f[n]);
                            rubbishTip(f[n], n, t); //阈值报警
                        }
                    }
                    //垃圾容余
                    if (t[0] == sensor["mac_715"].p151) {
                        var f = t[1].split('/');
                        for (var n = 0; n < f.length; n++) {
                            $('#p151_' + (n + 1)).text(f[n]);
                        }
                    }
                    //TVOC
                    if (t[0] == sensor["mac_715"].p152) {
                        var f = t[1].split('/');
                        for (var n = 0; n < f.length; n++) {
                            $('#p152_' + (n + 1)).text(f[n]);
                        }
                    }
                    //报警百分比
                    if (t[0] == sensor["mac_715"].p153) {}
                    //识别垃圾种类
                    if (t[0] == sensor["mac_715"].p154) {
                        var t = t[1].split['/'][0];
                        var n = t[1].split['/'][1];
                        var arr = ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'];
                        if (t == 255) {
                            var d = new Date();
                            $('#p154').text('未知垃圾');
                            $('#p154').siblings('small').text(d.toLocaleString());
                        } else {
                            var name = utf2str(n);
                            $('#p154').text(arr[t]);
                            $('#p154').siblings('small').text(name);
                        }
                    }
                    //电量
                    if (t[0] == sensor["mac_715"].p155) {}
                    //垃圾桶盖控制
                    if (t[0] == sensor["mac_715"].p156) {
                        var arr = [0x01, 0x02, 0x04, 0x08];
                        for (var n = 0; n < arr.length; n++) {
                            if (t[1] & arr[n]) {
                                if ($('#p156_' + (n + 1)).hasClass("switch-off")) {
                                    $('#p156_' + (n + 1)).click();
                                }
                            } else {
                                if ($('#p156_' + (n + 1)).hasClass("switch-on")) {
                                    $('#p156_' + (n + 1)).click();
                                }
                            }
                        }
                    }
                    //重量阈值
                    if (t[0] == sensor["mac_715"].p157) {}
                    //容余阈值
                    if (t[0] == sensor["mac_715"].p158) {}
                    //TVOC阈值
                    if (t[0] == sensor["mac_715"].p159) {}
                    //是否报警
                    if (t[0] == sensor["mac_715"].p1510) {}
                    //位置信息
                    if (t[0] == sensor["mac_715"].p1511) {
                        var x = t[1].split('&')[0] / 100 //纬度x
                        var y = t[1].split('&')[1] / 100 //经度y
                        // 改变消防栓1位置-- 待实现
                        map_715[0].x = x
                        map_715[0].y = y
                        map_715[0].con = "北纬" + x + "，东经" + y;
                        addMark(map_715, map3)
                    }
                }
                //mac_car_小车
                if (mac == localData.mac_car) {
                    if (t[0] == sensor["mac_car"].car) {
                        var f = t[1].split('&');
                        var b = ((f[0] + 3.2) / 6.4).toFixed(4) * 100 + '%'; //bottom
                        $('.carMain').css('bottom', 'calc(' + b + ' - 1.5vw)');
                        var l = ((3.2 - f[1]) / 6.4).toFixed(4) * 100 + '%'; //left
                        $('.carMain').css('left', 'calc(' + l + ' - 1.5vw)');
                        var t = -f[2] * 1;
                        $('.carMain').css('transform', 'rotate(' + t + 'deg)');
                    }
                }
            }
        }
    }
}
// 输入id key 确认按钮
$("#idkeyInput").click(function() {
    localData['id'] = $("#id").val();
    localData['key'] = $("#key").val();
    localData['server'] = $("#server").val();

/*     var camip1 = "zxbeegw" + $("#id").val() + ".zhiyun360.com/" + $("#addr1").val().split("/")[1];
    var camip2 = "zxbeegw" + $("#id").val() + ".zhiyun360.com/" + $("#addr2").val().split("/")[1];
    var camip3 = "zxbeegw" + $("#id").val() + ".zhiyun360.com/" + $("#addr3").val().split("/")[1];
    var camip4 = "zxbeegw" + $("#id").val() + ".zhiyun360.com/" + $("#addr4").val().split("/")[1];

    $("#addr1").val(camip1);
    $("#addr2").val(camip2);
    $("#addr3").val(camip3);
    $("#addr4").val(camip4);
    localData["addr1"] = $("#addr1").val();
    localData["addr2"] = $("#addr2").val();
    localData["addr3"] = $("#addr3").val();
    localData["addr4"] = $("#addr4").val(); */

    // 本地存储id、key和server
    storeStorage();
    if (!connectFlag)
        getConnect();
    else
        rtc.disconnect();
});

//首页mac确认按钮
$('#macAllInput').click(function() { queryAll('0'); })
//气象站mac确认
$('#macA').click(function() { queryAll('1', '1_A'); })
$('#macE').click(function() { queryAll('1', '1_E'); })
$('#macL').click(function() { queryAll('1', '1_L'); })
//智慧设施mac确认
$('#macC').click(function() { queryAll('1', '1_C'); })
$('#macW').click(function() { queryAll('1', '1_W'); })
$('#macF').click(function() { queryAll('1', '1_F'); })
//智慧交通mac确认
$('#macT').click(function() { queryAll('1', '1_T'); })
// 查询节点
var macEq;

function queryAll(macIndexFlay, macMin) {
    //设置的mac地址存入分页
    if (macIndexFlay == '0') { //首页
        macEq = 1;
        queryA(macIndexFlay, macEq);
        queryE(macIndexFlay, macEq);
        queryL(macIndexFlay, macEq);
        queryC(macIndexFlay, macEq);
        queryW(macIndexFlay, macEq);
        queryF(macIndexFlay, macEq);
        queryT(macIndexFlay, macEq);
    } else { //分页
        macEq = 0;
        if (macMin == '1_A') { queryA(macIndexFlay, macEq); }
        if (macMin == '1_E') { queryE(macIndexFlay, macEq); }
        if (macMin == '1_L') { queryL(macIndexFlay, macEq); }
        if (macMin == '1_C') { queryC(macIndexFlay, macEq); }
        if (macMin == '1_W') { queryW(macIndexFlay, macEq); }
        if (macMin == '1_F') { queryF(macIndexFlay, macEq); }
        if (macMin == '1_T') { queryT(macIndexFlay, macEq); }
    }
    storeStorage();
    message_show("MAC设置成功!");
    if (connectFlag) {
        console.log('数据连接成功，查询数据中...')
        for (var i in localData) {
            if (i.indexOf('mac_') > -1) {
                var mac = 'mac_' + i.split('_')[1];
                rtc.sendMessage(localData[i], sensor[mac].query);
            }
        }
    }
}

var his_cha = { //历史数据通道
    L_cha: [ //路灯通道
        { "用电量": sensor.mac_501.p100 },
        { "电流": sensor.mac_501.p101 },
        { "电压": sensor.mac_501.p102 },
        { "功率": sensor.mac_501.p103 },
        { "光强": sensor.mac_501.p105 },
        { "倾斜角度": sensor.mac_501.p107 },
    ],
    A_cha: [ //气象站通道
        { "温度": sensor.mac_502.p200 },
        { "湿度": sensor.mac_502.p201 },
        { "大气压力": sensor.mac_502.p202 },
        { "PM2.5": sensor.mac_502.p203 },
        { "PM10": sensor.mac_502.p204 },
        { "噪音": sensor.mac_502.p205 },
        { "风速": sensor.mac_502.p206 },
    ],
    E_cha: [ //充电桩通道
        { "用电量": sensor.mac_503.p300 },
        { "电流": sensor.mac_503.p301 },
        { "电压": sensor.mac_503.p302 },
        { "功率": sensor.mac_503.p303 },
    ],
};

// 历史数据
function checkHistory(set, tagIndex, hisDiv) {
    // 初始化api， 实例化历史数据
    var myHisData = new WSNHistory(localData["id"], localData["key"]);
    // 服务器接口查询
    myHisData.setServerAddr(localData["server"] + ":8080");
    // 设置时间
    var time = $('#' + set).val();

    //获取通道
    var channelTitC, channel, chaArr, chaMac;
    if (tagIndex == 'L') { //路灯
        channelTitC = $('.lightNavHis').val();
        if(set.indexOf("2")){
            channelTitC = $('.lightNavHis:eq(1)').val();
        }
        chaArr = his_cha.L_cha;
        chaMac = $('.mac_501').val();
    } else if (tagIndex == 'A') { //气象站
        channelTitC = $('#modalTit').text();
        chaArr = his_cha.A_cha;
        chaMac = $('.mac_502').val();
    } else if (tagIndex == 'E') { //充电桩
        channelTitC = $('#modalTit1').text();
        chaArr = his_cha.E_cha;
        var index = $('#hisNavIndex').text().split('_');
        console.log(index);
        if (index[1] == '1') { chaMac = $('.mac_503_1').val(); } else if (index[1] == '2') { chaMac = $('.mac_503_2').val(); } else if (index[1] == '3') { chaMac = $('.mac_503_3').val(); } else if (index[1] == '4') { chaMac = $('.mac_503_4').val(); }
    }
    for (var i = 0, l = chaArr.length; i < l; i++) {
        for (var key in chaArr[i]) {
            // console.log(key + ':' + chaArr[i][key]);
            if (key == channelTitC) {
                channel = chaMac + '_' + chaArr[i][key];
                // console.log(channel)
            }
        }
    }

    console.log('查询时间为：' + time + '，查询通道为：' + channel + '，查询图标为：' + tagIndex);
    myHisData[time](channel, function(dat) {
        console.log(dat)
        if (dat.datapoints.length > 0) {
            var data = DataAnalysis(dat);
            showChart(hisDiv, 'spline', '', false, eval(data));
        } else {
            message_show("该时间段没有数据");
        }
    });
}
// 历史数据
//---气象站
$('#wdDisplay').click(function() { checkHistory('tempSet', 'A', '#her_temp'); }) //温度
$('#humiDisplay').click(function() { checkHistory('humiSet', 'A', '#her_humi'); }) //湿度
$('#sumDisplay').click(function() { checkHistory('sumSet', 'A', '#her_sum'); }) //大气压力
$('#pm2Display').click(function() { checkHistory('pm2Set', 'A', '#her_pm2'); }) //pm2.2
$('#pm10Display').click(function() { checkHistory('pm10Set', 'A', '#her_pm10'); }) //pm10
$('#noiseDisplay').click(function() { checkHistory('noiseSet', 'A', '#her_noise'); }) //噪音
$('#windDisplay').click(function() { checkHistory('windSet', 'A', '#her_wind'); }) //风速
//--充电桩历史数据（见weatherChar.js文件）
//--路灯
$('#messDisplay').click(function() { checkHistory('MessSet', 'L', '#her_Mess'); }) //用电量
$('#messDisplay2').click(function() { checkHistory('MessSet2', 'L', '#her_Mess2'); }) //电流

/* *****************************************  视频控制(安防监控)  **************************************  */
$('#camera2Input,#camera3Input,#camera4Input,#camera5Input').click(function() {
    var n = $(this).attr('id').replace('camera', '').replace('Input', '');
    console.log(n);
    localData['addr' + n] = $('#addr' + n).val();
    storeStorage();
    message_show('摄像头信息' + n + '已保存。')
})
//AI信息设置
$('#ai1Input').click(function() {
    storeStorage1()
    message_show('AI信息已保存。')
})
$('#ai2Input').click(function() {
    message_show('腾讯信息已保存。')
})
$('#ai3Input').click(function() {
    message_show('旷视信息已保存。')
})
$('#ai4Input').click(function() {
    message_show('讯飞信息已保存。')
})

var cameraFlay_A = 0;
$('#camera1Input').click(function() {
    if (cameraFlay_A) {
        cameraFlay_A = 0;
    } else {
        cameraFlay_A = 1;
        message_show('摄像头信息已保存。')
    }
})
var myImgId = "img0"; //img标签的id
var camState = 0; //初始化摄像头在线状态为离线
var switch_cam = 0; //默认摄像头开关处于关闭状态
console.log($("#id").val(), $("#key").val());
var myipcamera = new WSNCamera($("#id").val(), $("#key").val()); //创建myipcamera对象

myipcamera.setDiv(myImgId); //设置图像显示的位置
//初始化监视器开关 默认关
$("#switch_A").click(function() {
    if (connectFlag) {
        if (!this.flag) {
            switch_cam = 1;
            var myCameraIP = $("#addr1").val(); //摄像头IP地址
            var user = $("#user1").val(); //摄像头访问用户名
            var pwd = $("#pwd1").val(); //摄像头访问密码
            var type = $("#type1").val(); //摄像头型号

            console.log(myCameraIP, user, pwd, type);
            console.log($("#addr1").val());
            myipcamera.setServerAddr($("#addr1").val());
            myipcamera.initCamera(myCameraIP, user, pwd, type); //摄像头初始化
            message_show("摄像头打开");
            $('#img0').removeClass('cameraImg');
            myipcamera.checkOnline(function(state) {
                console.log(state);
                if (state == 1) {
                    myipcamera.openVideo(); //打开摄像头并显示
                    camState = 1;
                }
            });
        } else {
            switch_cam = 0;
            $("#img0").attr("src", "img/camera1.png");
            $('#img0').addClass('cameraImg');
            message_show("摄像头关闭");
            myipcamera.closeVideo(); //关闭视频监控
            camState = 0;
        }
        this.flag = !this.flag;
    } else {
        message_show("请正确输入IDKEY连接智云数据中心");
        $("#img0").attr("src", "img/camera1.png");
        $('#img0').addClass('cameraImg');
    }
});
//监视器控制器
$("#up_A").mousedown(function() { //上
    if ((switch_cam == 1) && (camState == 1)) {
        myipcamera.control("UP"); //向摄像头发送向上移动命令
    }
});
$("#down_A").mousedown(function() { //下
    if ((switch_cam == 1) && (camState == 1)) {
        myipcamera.control("DOWN"); //向摄像头发送向下移动命令
    }
});
$("#left_A").mousedown(function() { //左
    if ((switch_cam == 1) && (camState == 1)) {
        myipcamera.control("LEFT"); //向摄像头发送向左移动命令
    }
});
$("#right_A").mousedown(function() { //右
    if ((switch_cam == 1) && (camState == 1)) {
        myipcamera.control("RIGHT"); //向摄像头发送向右移动命令
    }
});
$("#horizontal_A").mousedown(function() { //水平巡航
    if ((switch_cam == 1) && (camState == 1)) {
        myipcamera.control("HPATROL"); //向摄像头发送水平巡航命令
    }
});
$("#vertical_A").mousedown(function() { //垂直巡航
    if ((switch_cam == 1) && (camState == 1)) {
        myipcamera.control("VPATROL"); //向摄像头发送垂直巡航命令
    }
});
$("#overall_A").mousedown(function() { //360度巡航
    if ((switch_cam == 1) && (camState == 1)) {
        myipcamera.control("360PATROL"); //向摄像头发送360度巡航命令
    }
});
//截屏
$("#imgSnapshot_A").click(function() {
    if (camState == 1) {
        myipcamera.snapshot();
    }
});
/* ******************** 数据处理 *********************/
function checkLed(id, t) {
    var arr = [
        ['红灯', 'd1.png'],
        ['直行', 'd11.png'],
        ['左转', 'd5.png'],
        ['右转', 'd3.png']
    ]
    $(id).attr('title', arr[t][0]);
    $(id).attr('src', 'img/' + arr[t][1]);
}

function str2utf(pValue) { //utf-8转汉字
    return pValue.replace(/[^\u0000-\u00FF]/g, function($0) { return escape($0).replace(/(%u)(\w{4})/gi, "&#x$2;") });
}

function OnLine(type, n) {
    if (type == '505') {
        for (var i = 0; i < 5; i++) {
            $('.OnLineBox:eq(' + i + ') .OnLine' + n + ' .unline_ico').addClass('hidden');
            $('.OnLineBox:eq(' + i + ') .OnLine' + n + ' .online_ico').removeClass('hidden');
        }
    } else if (type == '506') {
        for (var i = 5; i < 7; i++) {
            $('.OnLineBox:eq(' + i + ') .OnLine' + n + ' .unline_ico').addClass('hidden');
            $('.OnLineBox:eq(' + i + ') .OnLine' + n + ' .online_ico').removeClass('hidden');
        }
    } else if (type == '508') {
        if (n < 3) {
            $('.carLeft .carBox:eq(' + n + ')').find('.unline_ico').addClass('hidden').siblings().removeClass('hidden');
        } else {
            $('.carRight .carBox:eq(' + (n - 2) + ')').find('.unline_ico').addClass('hidden').siblings().removeClass('hidden');
        }
    }
}

function click_btn(id, sta) {
    var n = id.split('')[1];
    var t = id.split('_')[1];
    var st = id.split('_')[2];
    var mac = 'mac_50' + n + '_' + t;
    var cmd;
    if (n == 1) { mac = 'mac_715'; }
    if (sta == 'open') {
        cmd = '{OD1=1,D1=?}';
        if (st) { cmd = '{OD1=' + st + ',D1=?}'; }
    } else {
        cmd = '{CD1=1,D1=?}';
        if (st) { cmd = '{CD1=' + st + ',D1=?}'; }
    }
    console.log(mac, cmd);
    if (connectFlag) {
        if (localData[mac] != '00:00:00:00:00:00:00:00') {
            rtc.sendMessage(localData[mac], cmd);
        } else {
            message_show('节点不在线，请先检查数据连接！')
        }
    } else {
        message_show('服务不在线，请先检查数据连接！')
    }

}

function rubbishTip(val, n, t) {
    var arr = ['可回收垃圾', '有害垃圾', '厨余垃圾', '其他垃圾'];
    if (val > p2M[arr[n]].item[1]) {
        var txt = '垃圾重量超标。' + arr[n] + '增重' + t + 'kg。'
        $('.trashTip:eq(' + n + ')>span').text(txt).css('color', '#a83d1c');
        $('.trashTip:eq(' + n + ') .iconfont').css('color', 'red').addClass('animated flash infinite');
        var d = new Date();
        var html = '<tr><td>' + arr[n] + '</td> <td>垃圾重量超重</td> <td>' + d.toLocaleString() + '</td> </tr>';
        $('.abnormalTb tbody').prepend(html);
    } else {
        var txt = '垃圾重量未超标。' + arr[n] + '增重' + t + 'kg。'
        $('.trashTip:eq(' + n + ')>span').text(txt).css('color', '#c6d9de');
        $('.trashTip:eq(' + n + ') .iconfont').css('color', '#c6d9de').removeClass('animated flash infinite');
    }
}

function checkTip(channel, val, mac, n) {
    // 井盖和消防栓阈值提醒
    var n = n * 1 - 1;
    var name;
    for (var i in p2M) {
        if (mac == 'mac_505') {
            if (i.indexOf('井盖') > -1 && p2M[i].tag == channel) {
                name = i;
            }
        } else if (mac == 'mac_506') {
            if (channel == 'A0') {
                name = '消防栓数据采集';
            } else if (channel == 'A1') {
                name = '水压';
            } else if (channel == 'A7') {
                name = '倾斜角度';
            }
        }
    }
    if (val > p2M[name].item[n][1] || val < p2M[name].item[n][0]) {
        message_show('警报！' + name + (n + 1) + '超出阈值范围！');
    }
}

function gps2new(num) { //GPS转码函数 //30.4595 转换   - > 30 + " ." + 4595/60 - >
    var arr = num.split(".");
    var num2 = arr[1] / 60 + "";
    var txt = num2.split(".")[0] + num2.split(".")[1];
    if (arr[1].split('')[0] == "0") {
        var oldtxt = arr[0] + "." + "0" + parseFloat(txt);
    } else {
        var oldtxt = arr[0] + "." + parseFloat(txt);
    }
    var newtxt = parseFloat(oldtxt).toFixed(8);
    return newtxt;
}

/* ******************************* 扫描分享 *******************************/
// 定义二维码生成div
var qrcode = new QRCode(document.getElementById("qrDiv"), {
    width: 200,
    height: 200
});
// 分享按钮
$(".share").on("click", function() {
    var txt = "",
        title, input, obj;
    if (this.id == "idShare") {
        obj = {
            "id": $("#id").val(),
            "key": $("#key").val(),
            "server": $("#server").val(),
        }
        title = "IDKey设置";
        txt = JSON.stringify(obj);
    }
    // 首页mac
    else if (this.id == "macShare") {
        obj = {
            "mac_501": $(".mac_501").val(),
            "mac_502": $(".mac_502").val(),

            "mac_503_1": $(".mac_503_1").val(),
            "mac_503_2": $(".mac_503_2").val(),
            "mac_503_3": $(".mac_503_3").val(),
            "mac_503_4": $(".mac_503_4").val(),

            "mac_504_1": $(".mac_504_1").val(),
            "mac_504_2": $(".mac_504_2").val(),
            "mac_504_3": $(".mac_504_3").val(),
            "mac_504_4": $(".mac_504_4").val(),
            "mac_504_5": $(".mac_504_5").val(),
            "mac_504_6": $(".mac_504_6").val(),
            "mac_504_7": $(".mac_504_7").val(),
            "mac_504_8": $(".mac_504_8").val(),
            "mac_504_9": $(".mac_504_9").val(),
            "mac_504_10": $(".mac_504_10").val(),

            "mac_505_1": $(".mac_505_1").val(),
            "mac_505_2": $(".mac_505_2").val(),

            "mac_506_1": $(".mac_506_1").val(),
            "mac_506_2": $(".mac_506_2").val(),

            "mac_507": $(".mac_507").val(),

            "mac_508_1": $(".mac_508_1").val(),
            "mac_508_2": $(".mac_508_2").val(),
            "mac_508_3": $(".mac_508_3").val(),
            "mac_508_4": $(".mac_508_4").val(),

            "mac_509": $(".mac_509").val(),
            "mac_715": $(".mac_715").val(),

            "mac_car": $(".mac_car").val(),
        }
        title = "首页MAC设置";
        txt = JSON.stringify(obj);
    }
    //智慧灯杆
    else if (this.id == "macAShare") {
        obj = {
            "mac_502": $(".mac_502").val(),
        }
        title = "气象站MAC设置";
        txt = JSON.stringify(obj);
    } else if (this.id == "macEShare") {
        obj = {
            "mac_503_1": $(".mac_503_1").val(),
            "mac_503_2": $(".mac_503_2").val(),
            "mac_503_3": $(".mac_503_3").val(),
            "mac_503_4": $(".mac_503_4").val(),
        }
        title = "充电桩MAC设置";
        txt = JSON.stringify(obj);
    } else if (this.id == "macLShare") {
        obj = {
            "mac_501": $(".mac_501").val(),
        }
        title = "智慧路灯MAC设置";
        txt = JSON.stringify(obj);
    }
    //智慧设施
    else if (this.id == "macCShare") {
        obj = {
            "mac_505_1": $(".mac_505_1").val(),
            "mac_505_2": $(".mac_505_2").val(),
            "mac_506_1": $(".mac_506_1").val(),
            "mac_506_2": $(".mac_506_2").val(),
        }
        title = "井盖消防MAC设置";
        txt = JSON.stringify(obj);
    } else if (this.id == "macWShare") {
        obj = {
            "mac_504_1": $(".mac_504_1").val(),
            "mac_504_2": $(".mac_504_2").val(),
            "mac_504_3": $(".mac_504_3").val(),
            "mac_504_4": $(".mac_504_4").val(),
            "mac_504_5": $(".mac_504_5").val(),
            "mac_504_6": $(".mac_504_6").val(),
            "mac_504_7": $(".mac_504_7").val(),
            "mac_504_8": $(".mac_504_8").val(),
            "mac_504_9": $(".mac_504_9").val(),
            "mac_504_10": $(".mac_504_10").val(),
        }
        title = "水电管网MAC设置";
        txt = JSON.stringify(obj);
    } else if (this.id == "macFShare") {
        obj = {
            "mac_715": $(".mac_715").val(),
        }
        title = "垃圾分类MAC设置";
        txt = JSON.stringify(obj);
    }
    //智慧交通
    else if (this.id == "macTShare") {
        obj = {
            "mac_507": $(".mac_507").val(),
            "mac_508_1": $(".mac_508_1").val(),
            "mac_508_2": $(".mac_508_2").val(),
            "mac_508_3": $(".mac_508_3").val(),
            "mac_508_4": $(".mac_508_4").val(),
            "mac_509": $(".mac_509").val(),
            "mac_car": $(".mac_car").val(),
        }
        title = "智慧交通MAC设置";
        txt = JSON.stringify(obj);
    }
    // 摄像头1-5
    else if (this.id == "camera1Share") {
        obj = {
            "addr1": $("#addr1").val(),
            "type1": $("#type1").val(),
            "user1": $("#user1").val(),
            "pwd1": $("#pwd1").val(),
        }
        title = "安防监控摄像头设置";
        txt = JSON.stringify(obj);
    } else if (this.id == "camera2Share") {
        obj = {
            "addr2": $("#addr2").val(),
            "type2": $("#type2").val(),
            "user2": $("#user2").val(),
            "pwd2": $("#pwd2").val(),
        }
        title = "智慧交通1摄像头设置";
        txt = JSON.stringify(obj);
    } else if (this.id == "camera3Share") {
        obj = {
            "addr3": $("#addr3").val(),
            "type3": $("#type3").val(),
            "user3": $("#user3").val(),
            "pwd3": $("#pwd3").val(),
        }
        title = "智慧交通2摄像头设置";
        txt = JSON.stringify(obj);
    } else if (this.id == "camera4Share") {
        obj = {
            "addr4": $("#addr4").val(),
            "type4": $("#type4").val(),
            "user4": $("#user4").val(),
            "pwd4": $("#pwd4").val(),
        }
        title = "智慧交通3摄像头设置";
        txt = JSON.stringify(obj);
    } else if (this.id == "camera5Share") {
        obj = {
            "addr5": $("#addr5").val(),
            "type5": $("#type5").val(),
            "user5": $("#user5").val(),
            "pwd5": $("#pwd5").val(),
        }
        title = "智慧交通4摄像头设置";
        txt = JSON.stringify(obj);
    }
    qrcode.makeCode(txt);
    $("#shareModalTitle").text(title)
})
// 扫描按钮
$(".scan").on("click", function() {
    if (window.droid) {
        if (this.id == "id_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        }
        //首页分享
        else if (this.id == "mac_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        }
        //智慧灯杆
        else if (this.id == "macA_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        } else if (this.id == "macE_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        } else if (this.id == "macL_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        }
        //智慧设施
        else if (this.id == "macC_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        } else if (this.id == "macW_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        } else if (this.id == "macF_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        }
        //智慧交通
        else if (this.id == "macT_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        }
        //摄像头1-5
        else if (this.id == "camera1_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        } else if (this.id == "camera2_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        } else if (this.id == "camera3_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        } else if (this.id == "camera4_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        } else if (this.id == "camera5_scan") {
            cur_scan_id = this.id;
            window.droid.requestScanQR("scanQR");
        }
    } else {
        message_show("扫描只在安卓系统下可用！");
    }
})
// 扫描处理函数
function scanQR(scanData) {
    //将原来的二维码编码格式转换为json
    var dataJson = {};
    if (scanData[0] != '{') {
        var data = scanData.split(',');
        for (var i = 0; i < data.length; i++) {
            var newdata = data[i].split(":");
            dataJson[newdata[0].toLocaleLowerCase()] = newdata[1];
        }
    } else {
        dataJson = JSON.parse(scanData);
    }
    console.log("dataJson=" + JSON.stringify(dataJson));
    if (cur_scan_id == "id_scan") {
        $("#id").val(dataJson['id']);
        $("#key").val(dataJson['key']);
        if (dataJson['server'] && dataJson['server'] != '') {
            $("#server").val(dataJson['server']);
        }
    } else if (cur_scan_id == "mac_scan") {
        for (var i in dataJson) {
            $("." + i).val(dataJson[i])
        }
    } else if (cur_scan_id == "camera1_scan") {
        $("#addr1").val(dataJson['addr1']);
        $("#type1").val(dataJson['type1']);
        $("#user1").val(dataJson['user1']);
        $("#pwd1").val(dataJson['pwd1']);
    } else if (cur_scan_id == "camera2_scan") {
        $("#addr2").val(dataJson['addr2']);
        $("#type2").val(dataJson['type2']);
        $("#user2").val(dataJson['user2']);
        $("#pwd2").val(dataJson['pwd2']);
    } else if (cur_scan_id == "camera3_scan") {
        $("#addr3").val(dataJson['addr3']);
        $("#type3").val(dataJson['type3']);
        $("#user3").val(dataJson['user3']);
        $("#pwd3").val(dataJson['pwd3']);
    } else if (cur_scan_id == "camera4_scan") {
        $("#addr4").val(dataJson['addr4']);
        $("#type4").val(dataJson['type4']);
        $("#user4").val(dataJson['user4']);
        $("#pwd4").val(dataJson['pwd4']);
    } else if (cur_scan_id == "camera5_scan") {
        $("#addr5").val(dataJson['addr5']);
        $("#type5").val(dataJson['type5']);
        $("#user5").val(dataJson['user5']);
        $("#pwd5").val(dataJson['pwd5']);
    }
}
/* ****************************** 公共函数  ****************************/
//清除缓存
$("#clear").click(function() {
    localStorage.removeItem("smartCity");
    alert("localStorage已清除!")
    window.location.reload();
})
// 升级按钮
$("#setUp").click(function() {
    message_show("当前已是最新版本");
});
//  查看升级日志
$("#showUpdateTxt").on("click", function() {
    if ($(this).text() == "查看升级日志")
        $(this).text("收起升级日志");
    else
        $(this).text("查看升级日志");
})


// 获取本地localStorage缓存数据
function get_localStorage() {
    if (localStorage.getItem("smartCity")) {
        localData = JSON.parse(localStorage.getItem("smartCity"));
        for (var i in localData) {
            if (localData[i]) {
                // 读取当前模式
                if ($("#" + i)) {
                    $("#" + i).val(localData[i])
                }
                if ($("." + i)) {
                    $("." + i).val(localData[i])
                }
            }
        }
    } else {
        get_config();
    }
}

function get_config() {
    for (var i in config) {
        if ($("#" + i)) {
            $("#" + i).val(config[i])
        }
        if ($("." + i)) {
            $("." + i).val(config[i])
        }
    }
}

function storeStorage() {
    localStorage.setItem("smartCity", JSON.stringify(localData));
   
}
function storeStorage1() {
    localStorage.setItem("ai", JSON.stringify(localData1));
}

function loadFirstPage() {
    var href = window.location.href;
    console.log(href)
    var newHref = href.substring(href.length, href.length - 4);
    console.log(newHref)
    if (newHref == "html") {
        window.location.href = window.location.href + "#/";
    }
}
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
//初始化弹出框
$('[data-toggle="popover"]').popover();
//版本列表渲染
$(".currentVersion").text(version.currentVersion);
var versionData = version.versionList;
var versionBox = document.querySelector('.version-list');
versionBox.innerHTML = versionData.map((item) => {
    return `<dl> <dt>${item.code}</dt> <dd>${item.desc}</dd> </dl>`;
}).join('');

function nowTime() {
    var myDate = new Date();
    var myYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
    var myMonth = myDate.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    var myToday = myDate.getDate(); //获取当前日(1-31)
    var myHour = myDate.getHours(); //获取当前小时数(0-23)
    var myMinute = myDate.getMinutes(); //获取当前分钟数(0-59)
    var nowTime;
    nowTime = myYear + '/' + myMonth + '/' + myToday + '/' + '  ' + fillZero(myHour) + ':' +
        fillZero(myMinute);
    return nowTime;
}

function fillZero(str) {
    var realNum;
    if (str < 10) {
        realNum = '0' + str;
    } else {
        realNum = str;
    }
    return realNum;
}

// mac分页首页节点设置函数
//---气象站---
function queryA(macIndexFlay, macEq) {
    localData['mac_502'] = $('.mac_502:eq(' + macIndexFlay + ')').val();
    $(".mac_502:eq(" + macEq + ")").val(localData['mac_502']);
}
//---充电桩---
function queryE(macIndexFlay, macEq) {
    localData['mac_503_1'] = $('.mac_503_1:eq(' + macIndexFlay + ')').val();
    localData['mac_503_2'] = $('.mac_503_2:eq(' + macIndexFlay + ')').val();
    localData['mac_503_3'] = $('.mac_503_3:eq(' + macIndexFlay + ')').val();
    localData['mac_503_4'] = $('.mac_503_4:eq(' + macIndexFlay + ')').val();

    $(".mac_503_1:eq(" + macEq + ")").val(localData['mac_503_1']);
    $(".mac_503_2:eq(" + macEq + ")").val(localData['mac_503_2']);
    $(".mac_503_3:eq(" + macEq + ")").val(localData['mac_503_3']);
    $(".mac_503_4:eq(" + macEq + ")").val(localData['mac_503_4']);
}
//---路灯---
function queryL(macIndexFlay, macEq) {
    localData['mac_501'] = $('.mac_501:eq(' + macIndexFlay + ')').val();
    $(".mac_501:eq(" + macEq + ")").val(localData['mac_501']);
}
//---井盖消防---
function queryC(macIndexFlay, macEq) {
    localData['mac_505_1'] = $('.mac_505_1:eq(' + macIndexFlay + ')').val();
    localData['mac_505_2'] = $('.mac_505_2:eq(' + macIndexFlay + ')').val();

    localData['mac_506_1'] = $('.mac_506_1:eq(' + macIndexFlay + ')').val();
    localData['mac_506_2'] = $('.mac_506_2:eq(' + macIndexFlay + ')').val();

    $(".mac_505_1:eq(" + macEq + ")").val(localData['mac_505_1']);
    $(".mac_505_2:eq(" + macEq + ")").val(localData['mac_505_2']);

    $(".mac_506_1:eq(" + macEq + ")").val(localData['mac_506_1']);
    $(".mac_506_2:eq(" + macEq + ")").val(localData['mac_506_2']);
}
//---管网---
function queryW(macIndexFlay, macEq) {
    localData['mac_504_1'] = $('.mac_504_1:eq(' + macIndexFlay + ')').val();
    localData['mac_504_2'] = $('.mac_504_2:eq(' + macIndexFlay + ')').val();
    localData['mac_504_3'] = $('.mac_504_3:eq(' + macIndexFlay + ')').val();
    localData['mac_504_4'] = $('.mac_504_4:eq(' + macIndexFlay + ')').val();
    localData['mac_504_5'] = $('.mac_504_5:eq(' + macIndexFlay + ')').val();
    localData['mac_504_6'] = $('.mac_504_6:eq(' + macIndexFlay + ')').val();
    localData['mac_504_7'] = $('.mac_504_7:eq(' + macIndexFlay + ')').val();
    localData['mac_504_8'] = $('.mac_504_8:eq(' + macIndexFlay + ')').val();
    localData['mac_504_9'] = $('.mac_504_9:eq(' + macIndexFlay + ')').val();
    localData['mac_504_10'] = $('.mac_504_10:eq(' + macIndexFlay + ')').val();

    $(".mac_504_1:eq(" + macEq + ")").val(localData['mac_504_1']);
    $(".mac_504_2:eq(" + macEq + ")").val(localData['mac_504_2']);
    $(".mac_504_3:eq(" + macEq + ")").val(localData['mac_504_3']);
    $(".mac_504_4:eq(" + macEq + ")").val(localData['mac_504_4']);
    $(".mac_504_5:eq(" + macEq + ")").val(localData['mac_504_5']);
    $(".mac_504_6:eq(" + macEq + ")").val(localData['mac_504_6']);
    $(".mac_504_7:eq(" + macEq + ")").val(localData['mac_504_7']);
    $(".mac_504_8:eq(" + macEq + ")").val(localData['mac_504_8']);
    $(".mac_504_9:eq(" + macEq + ")").val(localData['mac_504_9']);
    $(".mac_504_10:eq(" + macEq + ")").val(localData['mac_504_10']);
}
//---垃圾桶---
function queryF(macIndexFlay, macEq) {
    localData['mac_715'] = $('.mac_715:eq(' + macIndexFlay + ')').val();
    $(".mac_715:eq(" + macEq + ")").val(localData['mac_715']);

}
//---交通---
function queryT(macIndexFlay, macEq) {
    localData['mac_507'] = $('.mac_507:eq(' + macIndexFlay + ')').val();

    localData['mac_508_1'] = $('.mac_508_1:eq(' + macIndexFlay + ')').val();
    localData['mac_508_2'] = $('.mac_508_2:eq(' + macIndexFlay + ')').val();
    localData['mac_508_3'] = $('.mac_508_3:eq(' + macIndexFlay + ')').val();
    localData['mac_508_4'] = $('.mac_508_4:eq(' + macIndexFlay + ')').val();

    localData['mac_509'] = $('.mac_509:eq(' + macIndexFlay + ')').val();

    $(".mac_507:eq(" + macEq + ")").val(localData['mac_507']);

    $(".mac_508_1:eq(" + macEq + ")").val(localData['mac_508_1']);
    $(".mac_508_2:eq(" + macEq + ")").val(localData['mac_508_2']);
    $(".mac_508_3:eq(" + macEq + ")").val(localData['mac_508_3']);
    $(".mac_508_4:eq(" + macEq + ")").val(localData['mac_508_4']);

    $(".mac_509:eq(" + macEq + ")").val(localData['mac_509']);
}

//画曲线图的方法
function showChart(sid, ctype, unit, step, data) {
    $(sid).css("height", "280px");
    $(sid).highcharts({
        chart: {
            backgroundColor: 'transparent',
            type: ctype,
            animation: false,
            zoomType: 'x'
        },
        legend: {
            enabled: false
        },
        title: {
            text: ''
        },
        xAxis: {
            type: 'datetime',
            labels: {
                style: {
                    color: '#01DAE2',
                }
            }
        },
        yAxis: {
            title: {
                text: ''
            },
            minorGridLineWidth: 0,
            gridLineWidth: 1,
            alternateGridColor: null,
            labels: {
                style: {
                    color: '#01DAE2',
                }
            }
        },
        tooltip: {
            formatter: function() {
                return '' +
                    Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br><b>' + this.y + unit + '</b>';
            }
        },
        plotOptions: {
            spline: {
                lineWidth: 2,
                states: {
                    hover: {
                        lineWidth: 3
                    }
                },
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            symbol: 'circle',
                            radius: 3,
                            lineWidth: 1
                        }
                    }
                }

            },
            line: {
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1
                    }
                },
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            enabled: true,
                            symbol: 'circle',
                            radius: 3,
                            lineWidth: 1
                        }
                    }
                }

            }
        },
        series: [{
            marker: {
                symbol: 'square'
            },
            data: data,
            step: step,
        }],
        navigation: {
            menuItemStyle: {
                fontSize: '10px'
            }
        }
    });
}

//将JSON格式的数据转换成[x1,y1],[x2,y2],[x3,y3]...格式的数组
function DataAnalysis(data, timezone) {
    var str = '';
    var temp;
    var len = data.datapoints.length;
    if (timezone == null) {
        timezone = "+8";
    }
    var zoneOp = timezone.substring(0, 1);
    var zoneVal = timezone.substring(1);
    //var tzSecond = zoneVal*3600000; 修改于2015年2月1日 连接自己的数据服务器没用到时区参数
    var tzSecond = 0;
    $.each(data.datapoints, function(i, ele) {
        if (zoneOp == '+') {
            temp = Date.parse(ele.at) + tzSecond;
        }
        if (zoneOp == '-') {
            temp = Date.parse(ele.at) - tzSecond;
        }
        if (ele.value.indexOf("http") != -1) {
            str = str + '[' + temp + ',"' + ele.value + '"]';
        } else {
            str = str + '[' + temp + ',' + ele.value + ']';
        }
        if (i != len - 1)
            str = str + ',';
    });
    return "[" + str + "]";
}

// 路灯开关
// 移动端
var div = document.getElementById('lightRange');
div.addEventListener('touchend', function() {
    if (connectFlag) {
                if (this.value == '1') {
                    rtc.sendMessage(localData.mac_501, sensor.mac_501.oneOpen);
                    message_show('开启一级光。');
                } else if (this.value == '2') {
                    rtc.sendMessage(localData.mac_501, sensor.mac_501.twoOpen);
                    message_show('开启二级光。');
                } else if (this.value == '3') {
                    rtc.sendMessage(localData.mac_501, sensor.mac_501.threeOpen);
                    message_show('开启三级光。');
                } else {
                    rtc.sendMessage(localData.mac_501, sensor.mac_501.close);
                    message_show('灯光关闭。');
                }
            } else {
                message_show("请先连接数据！");
            }

});

// PC端
$('#lightRange').click(function() {
    if (connectFlag) {
        if (this.value == '1') {
            rtc.sendMessage(localData.mac_501, sensor.mac_501.oneOpen);
            message_show('开启一级光。');
        } else if (this.value == '2') {
            rtc.sendMessage(localData.mac_501, sensor.mac_501.twoOpen);
            message_show('开启二级光。');
        } else if (this.value == '3') {
            rtc.sendMessage(localData.mac_501, sensor.mac_501.threeOpen);
            message_show('开启三级光。');
        } else {
            rtc.sendMessage(localData.mac_501, sensor.mac_501.close);
            message_show('灯光关闭。');
        }
    } else {
        message_show("请先连接数据！");
    }
})
// 阈值--PM2.5
$('#nstSliderX3').nstSlider({
    "left_grip_selector": "#leftGripX3",
    "right_grip_selector": "#rightGripX3",
    "value_bar_selector": "#barX3",
    "value_changed_callback": function(cause, leftValue, rightValue) {
        var $container = $(this).parent();
        $container.find('#leftLabelX3').text(leftValue);
        $container.find('#rightLabelX3').text(rightValue);
        $('#nstSliderX3').nstSlider('highlight_range', leftValue, rightValue);
        pm2Arr_A["threshold"] = [leftValue, rightValue];
    },
    "user_mouseup_callback": function(leftValue, rightValue) {
        console.log("阈值更新：" + leftValue + "---" + rightValue);
        storeStorage();
        rtc.sendMessage(localData.mac_502, sensor.mac_502.query);
        console.log(localData.mac_502, sensor.mac_502.query)
    },
    "highlight": {
        "grip_class": "gripHighlighted",
        "panel_selector": "#highlightPanel1"
    },
});
//智慧路灯打卡
$(function(){
    $('.course_nr2 li').hover(function(){
        $(this).find('.deed').slideDown(600);
    },function(){
        $(this).find('.deed').slideUp(400);
    });
});
//灯杆下拉切换
$('#lampSelect').change(function () {
    localData['id'] = lampArray[$(this).val()].id
    localData['key'] =  lampArray[$(this).val()].key
    localData['server'] =  lampArray[$(this).val()].server
    //气象站
    localData['mac_502'] =  lampArray[$(this).val()].mac_502
    $('.mac_502:eq(0)').val(localData['mac_502']);
    $(".mac_502:eq(1)").val(localData['mac_502']);

    //充电桩
    localData['mac_503_1'] = lampArray[$(this).val()].mac_503_1
    localData['mac_503_2'] = lampArray[$(this).val()].mac_503_2
    localData['mac_503_3'] = lampArray[$(this).val()].mac_503_3
    localData['mac_503_4'] = lampArray[$(this).val()].mac_503_4
    $(".mac_503_1:eq(0)").val(localData['mac_503_1']);
    $(".mac_503_2:eq(0)").val(localData['mac_503_2']);
    $(".mac_503_3:eq(0)").val(localData['mac_503_3']);
    $(".mac_503_4:eq(0)").val(localData['mac_503_4']);
    $(".mac_503_1:eq(1)").val(localData['mac_503_1']);
    $(".mac_503_2:eq(1)").val(localData['mac_503_2']);
    $(".mac_503_3:eq(1)").val(localData['mac_503_3']);
    $(".mac_503_4:eq(1)").val(localData['mac_503_4']);

    //智慧路灯
    localData['mac_501'] =  lampArray[$(this).val()].mac_501
    $(".mac_501:eq(0)").val(localData['mac_501']);
    $(".mac_501:eq(1)").val(localData['mac_501']);
    
    storeStorage();
    if(connectFlag==1){
        rtc.disconnect();
    }
    getConnect();
})
