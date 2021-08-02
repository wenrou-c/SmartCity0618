// 阈值
//---气象站
var tempArr_A = [], humiArr_A = [], pressArr_A = [], pm2Arr_A = [], pm10Arr_A = [], noiseArr_A = [], windSpeedArr_A = [];
/*********************** 智慧灯杆导航切换 **************************/
$('#ligCoutNav li').click(function () {
    var liIndex = $(this).attr('data-index');
    $(this).addClass('navActive').siblings().removeClass('navActive');
    $('.lightSpan:eq(' + liIndex + ')').removeClass('hidden');
    $('.lightSpan:eq(' + liIndex + ')').siblings().addClass('hidden');
    if (liIndex == 1) {
        $('#admin').removeClass('hidden');
    } else {
        $('#admin').addClass('hidden');
    }
})

/*********************** 气象站 **************************/
var modal = {
    theTit: {
        '0': '温度',
        '1': '湿度',
        '2': '大气压力',
        '3': 'PM2.5',
        '4': 'PM10',
        '5': '噪音',
        '6': '风速',
        '7': '实时数据',
    },
}
//模态框导航切换
$('#theNav li').click(function () {
    var liIndex = $(this).attr('data-index');
    $(this).addClass('modalNavActive').siblings().removeClass('modalNavActive');
    if (liIndex == 1) {
        $('.slide').removeClass('hidden').siblings().addClass('hidden');
    } else {
        $('.history').removeClass('hidden').siblings().addClass('hidden');
    }
})
// 阈值--温度
$('#nstSliderX0').nstSlider({
    "left_grip_selector": "#leftGripX0",
    "right_grip_selector": "#rightGripX0",
    "value_bar_selector": "#barX0",
    "value_changed_callback": function (cause, leftValue, rightValue) {
        var $container = $(this).parent();
        $container.find('#leftLabelX0').text(leftValue);
        $container.find('#rightLabelX0').text(rightValue);
        $('#nstSliderX0').nstSlider('highlight_range', leftValue, rightValue);
        tempArr_A["threshold"] = [leftValue, rightValue];
    },
    "user_mouseup_callback": function (leftValue, rightValue) {
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
// 阈值--湿度
$('#nstSliderX1').nstSlider({
    "left_grip_selector": "#leftGripX1",
    "right_grip_selector": "#rightGripX1",
    "value_bar_selector": "#barX1",
    "value_changed_callback": function (cause, leftValue, rightValue) {
        var $container = $(this).parent();
        $container.find('#leftLabelX1').text(leftValue);
        $container.find('#rightLabelX1').text(rightValue);
        $('#nstSliderX1').nstSlider('highlight_range', leftValue, rightValue);
        humiArr_A["threshold"] = [leftValue, rightValue];
    },
    "user_mouseup_callback": function (leftValue, rightValue) {
        console.log("阈值更新：" + leftValue + "---" + rightValue);
        storeStorage();
        rtc.sendMessage(config.mac_502, sensor.mac_502.query);
    },
    "highlight": {
        "grip_class": "gripHighlighted",
        "panel_selector": "#highlightPanel1"
    },
});
// 阈值--大气压力
$('#nstSliderX2').nstSlider({
    "left_grip_selector": "#leftGripX2",
    "right_grip_selector": "#rightGripX2",
    "value_bar_selector": "#barX2",
    "value_changed_callback": function (cause, leftValue, rightValue) {
        var $container = $(this).parent();
        $container.find('#leftLabelX2').text(leftValue);
        $container.find('#rightLabelX2').text(rightValue);
        $('#nstSliderX2').nstSlider('highlight_range', leftValue, rightValue);
        pressArr_A["threshold"] = [leftValue, rightValue];
    },
    "user_mouseup_callback": function (leftValue, rightValue) {
        console.log("阈值更新：" + leftValue + "---" + rightValue);
        storeStorage();
        rtc.sendMessage(config.mac_502, sensor.mac_502.query);
    },
    "highlight": {
        "grip_class": "gripHighlighted",
        "panel_selector": "#highlightPanel1"
    },
});
// 阈值--PM10
$('#nstSliderX4').nstSlider({
    "left_grip_selector": "#leftGripX4",
    "right_grip_selector": "#rightGripX4",
    "value_bar_selector": "#barX4",
    "value_changed_callback": function (cause, leftValue, rightValue) {
        var $container = $(this).parent();
        $container.find('#leftLabelX4').text(leftValue);
        $container.find('#rightLabelX4').text(rightValue);
        $('#nstSliderX4').nstSlider('highlight_range', leftValue, rightValue);
        pm10Arr_A["threshold"] = [leftValue, rightValue];
    },
    "user_mouseup_callback": function (leftValue, rightValue) {
        console.log("阈值更新：" + leftValue + "---" + rightValue);
        storeStorage();
        rtc.sendMessage(config.mac_502, sensor.mac_502.query);
    },
    "highlight": {
        "grip_class": "gripHighlighted",
        "panel_selector": "#highlightPanel1"
    },
});
// 阈值--噪音
$('#nstSliderX5').nstSlider({
    "left_grip_selector": "#leftGripX5",
    "right_grip_selector": "#rightGripX5",
    "value_bar_selector": "#barX5",
    "value_changed_callback": function (cause, leftValue, rightValue) {
        var $container = $(this).parent();
        $container.find('#leftLabelX5').text(leftValue);
        $container.find('#rightLabelX5').text(rightValue);
        $('#nstSliderX5').nstSlider('highlight_range', leftValue, rightValue);
        noiseArr_A["threshold"] = [leftValue, rightValue];
    },
    "user_mouseup_callback": function (leftValue, rightValue) {
        console.log("阈值更新：" + leftValue + "---" + rightValue);
        storeStorage();
        rtc.sendMessage(config.mac_502, sensor.mac_502.query);
    },
    "highlight": {
        "grip_class": "gripHighlighted",
        "panel_selector": "#highlightPanel1"
    },
});
// 阈值--风速
$('#nstSliderX6').nstSlider({
    "left_grip_selector": "#leftGripX6",
    "right_grip_selector": "#rightGripX6",
    "value_bar_selector": "#barX6",
    "value_changed_callback": function (cause, leftValue, rightValue) {
        var $container = $(this).parent();
        $container.find('#leftLabelX6').text(leftValue);
        $container.find('#rightLabelX6').text(rightValue);
        $('#nstSliderX6').nstSlider('highlight_range', leftValue, rightValue);
        windSpeedArr_A["threshold"] = [leftValue, rightValue];
    },
    "user_mouseup_callback": function (leftValue, rightValue) {
        console.log("阈值更新：" + leftValue + "---" + rightValue);
        storeStorage();
        rtc.sendMessage(config.mac_502, sensor.mac_502.query);
    },
    "highlight": {
        "grip_class": "gripHighlighted",
        "panel_selector": "#highlightPanel1"
    },
});
$("#myModal").on("show.bs.modal", function (e) {
    var modalIndex = $(e.relatedTarget)[0].attributes[2].value;
    $("#modalTit").text(modal.theTit[modalIndex]);
    $('.theSpan:eq(' + modalIndex + ')').removeClass('hidden').siblings().addClass('hidden');
})
/*********************** 充电桩 **************************/
// 充电桩切换（电压）
$('#voltage_nav li').click(function () {
    var index = $(this).attr('data-index');
    $(this).addClass('voltage_navActive').siblings().removeClass('voltage_navActive');
    $('#chart_voltage' + index).removeClass('hidden').siblings().addClass('hidden');
    $('.lineState' + index).removeClass('hidden').siblings().addClass('hidden');
})
// 充电桩切换（功率）
$('#power_nav li').click(function () {
    var index = $(this).attr('data-index');
    $(this).addClass('voltage_navActive').siblings().removeClass('voltage_navActive');
    $('#power_char' + index).removeClass('hidden').siblings().addClass('hidden');
    $('#powerIco').removeClass('hidden');
    var index1 = parseInt(index) + 12;
    console.log(index1)
    $('.lineState' + index1).removeClass('hidden').siblings().addClass('hidden');
})
// 充电桩切换（用电量）
$('#uEle_nav li').click(function () {
    var index = $(this).attr('data-index');
    $(this).addClass('voltage_navActive').siblings().removeClass('voltage_navActive');
    $('#uEleSpan' + index).removeClass('hidden').siblings().addClass('hidden');
    var index1 = parseInt(index) + 8;
    $('.lineState' + index1).removeClass('hidden').siblings().addClass('hidden');
})
// 充电桩切换（电流）
$('#frequency_nav li').click(function () {
    var index = $(this).attr('data-index');
    $(this).addClass('voltage_navActive').siblings().removeClass('voltage_navActive');
    $('#frequencySpan' + index).removeClass('hidden').siblings().addClass('hidden');
    var index1 = parseInt(index) + 4;
    $('.lineState' + index1).removeClass('hidden').siblings().addClass('hidden');
})
// 充电桩切换（历史用电量）
$('#uElehis_nav li').click(function () {
    var index = $(this).attr('data-index');
    // $('#PFTit').text('功率因素' + index);
    $(this).addClass('voltage_navActive').siblings().removeClass('voltage_navActive');
    $('#UeleChar' + index).removeClass('hidden').siblings().addClass('hidden');
})
// 充电桩切换（历史负载用电量）
$('#uElehisF_nav li').click(function () {
    var index = $(this).attr('data-index');
    // $('#PFTit').text('功率因素' + index);
    $(this).addClass('voltage_navActive').siblings().removeClass('voltage_navActive');
    $('#UFeleChar' + index).removeClass('hidden').siblings().addClass('hidden');
})
var modal1 = {
    theTit: {
        '0': '电压',
        '1': '电流',
        '2': '用电量',
        '3': '功率',
    },
    theETit: {
        '0': 'voltage',
        '1': 'eleFluid',
        '2': 'userEle',
        '3': 'uPower',
    },
    slideArr: {//初始化阈值数组
        'voltage': [0, 220],
        'eleFluid': [0, 10000],
        'userEle': [0, 100],
        'uPower': [0, 120],
    },
    storSlideArr: {//阈值存储数组
        'voltage': { '0': [], '1': [], '2': [], '3': [], },
        'eleFluid': { '0': [], '1': [], '2': [], '3': [], },
        'userEle': { '0': [], '1': [], '2': [], '3': [], },
        'uPower': { '0': [], '1': [], '2': [], '3': [], },
    }
}
var useMess = [
    {
        'UserID': '23456',
        'UserPay': '100'
    }
]
//模态框导航切换
$('#theNav1 li').click(function () {
    var liIndex = $(this).attr('data-index');
    $(this).addClass('modalNavActive').siblings().removeClass('modalNavActive');
    if (liIndex == 1) {
        $('.slide').removeClass('hidden').siblings().addClass('hidden');
    } else {
        $('.history').removeClass('hidden').siblings().addClass('hidden');
    }
})
var theIndex;
$("#myModal1").on("show.bs.modal", function (e) {
    var modalIndex = $(e.relatedTarget)[0].attributes[2].value;
    var thisTit = $(e.relatedTarget).parent().children()[1].innerText;
    var i = $(e.relatedTarget).siblings('.voltage_nav').find('.voltage_navActive').text();
    // console.log(i)
    $("#modalTit1").text(thisTit);
    if (modalIndex == '0') {
        theIndex = 1 + '_' + i;
        $('#hisNavIndex').html(theIndex)
        hisSlide(modal1.theETit[0], theIndex, modal1.slideArr['voltage'][0], modal1.slideArr['voltage'][1]);
    }
    if (modalIndex == '1') {
        theIndex = 2 + '_' + i;
        $('#hisNavIndex').html(theIndex)
        hisSlide(modal1.theETit[1], theIndex, modal1.slideArr['uPower'][0], modal1.slideArr['uPower'][1]);
    }
    if (modalIndex == '2') {
        theIndex = 3 + '_' + i;
        $('#hisNavIndex').html(theIndex)
        hisSlide(modal1.theETit[2], theIndex, modal1.slideArr['userEle'][0], modal1.slideArr['userEle'][1]);
    }
    if (modalIndex == '3') {
        theIndex = 4 + '_' + i;
        $('#hisNavIndex').html(theIndex)
        hisSlide(modal1.theETit[3], theIndex, modal1.slideArr['eleFluid'][0], modal1.slideArr['eleFluid'][1]);
    }
    //充电桩历史数据
    $('#voltage1_1Display').click(function () { checkHistory('voltage1_1Set', 'E', '#her_voltage1_1'); })//电压
    $('#voltage1_2Display').click(function () { checkHistory('voltage1_2Set', 'E', '#her_voltage1_2'); })
    $('#voltage1_3Display').click(function () { checkHistory('voltage1_3Set', 'E', '#her_voltage1_3'); })
    $('#voltage1_4Display').click(function () { checkHistory('voltage1_4Set', 'E', '#her_voltage1_4'); })

    $('#eleFluid2_1Display').click(function () { console.log('1'); checkHistory('eleFluid2_1Set', 'E', '#her_eleFluid2_1'); })//电流
    $('#eleFluid2_2Display').click(function () { checkHistory('eleFluid2_2Set', 'E', '#her_eleFluid2_2'); })
    $('#eleFluid2_3Display').click(function () { checkHistory('eleFluid2_3Set', 'E', '#her_eleFluid2_3'); })
    $('#eleFluid2_4Display').click(function () { checkHistory('eleFluid2_4Set', 'E', '#her_eleFluid2_4'); })

    $('#userEle3_1Display').click(function () { checkHistory('userEle3_1Set', 'E', '#her_userEle3_1'); })//用电量
    $('#userEle3_2Display').click(function () { checkHistory('userEle3_2Set', 'E', '#her_userEle3_2'); })
    $('#userEle3_3Display').click(function () { checkHistory('userEle3_3Set', 'E', '#her_userEle3_3'); })
    $('#userEle3_4Display').click(function () { checkHistory('userEle3_4Set', 'E', '#her_userEle3_4'); })

    $('#uPower4_1Display').click(function () { checkHistory('uPower4_1Set', 'E', '#her_uPower4_1'); })//功率
    $('#uPower4_2Display').click(function () { checkHistory('uPower4_2Set', 'E', '#her_uPower4_2'); })
    $('#uPower4_3Display').click(function () { checkHistory('uPower4_3Set', 'E', '#her_uPower4_3'); })
    $('#uPower4_4Display').click(function () { checkHistory('uPower4_4Set', 'E', '#her_uPower4_4'); })
})
var slideE1_1, slideE1_2, slideE1_3, slideE1_4,
    slideE2_1, slideE2_2, slideE2_3, slideE2_4,
    slideE3_1, slideE3_2, slideE3_3, slideE3_4,
    slideE4_1, slideE4_2, slideE4_3, slideE4_4;

// 动态生成历史数据、阈值函数(英文名，内容索引，滑条索引，滑条最小值，滑条最大值)
function hisSlide(theETit, index, minSlide, maxSlide) {
    $('#eleSpanModal').empty()
    var div = '<div class="history"><div class="col-md-12"><ul class="historyBtn"><div class="row"><div class="col-md-7 col-lg-7 col-sm-7 col-xs-7"></div><div class="col-md-3 col-lg-3 col-sm-3 col-xs-3" style="margin-right: 2%;"><select class="form-control pullSelect pullSelect1" id="' + theETit + index + 'Set"><option value="queryLast1H">最近1小时</option><option value="queryLast6H">最近6小时</option><option value="queryLast12H">最近12小时</option><option value="queryLast1D">最近1天</option><option value="queryLast14D">最近2周</option><option value="queryLast1M">最近1月</option><option value="queryLast3M">最近3月</option><option value="queryLast6M">最近半年</option><option value="queryLast1Y">最近1年</option></select><span class="iconfont pullIco pullIco1">&#xe608;</span></div><div class="col-md-1 col-lg-1 col-sm-1 col-xs-1"><button id="' + theETit + index + 'Display" class="btn btn-primary btn-pad">查询</button></div></div></ul><div id="her_' + theETit + index + '" class="data_height"></div></div></div><div class="slide hidden"><div class="nstSlider" id="nstSliderE' + theIndex + '" data-range_min="' + minSlide + '" data-range_max="' + maxSlide + '" data-cur_min="' + minSlide + '" data-cur_max="' + maxSlide + '"><div class="highlightPanel"></div><div class="bar" id="barE' + theIndex + '"></div><div class="leftGrip" id="leftGripE' + theIndex + '"></div><div class="rightGrip" id="rightGripE' + theIndex + '"></div><div class="leftLabel nstSlider-val" id="leftLabelE' + theIndex + '"></div><div class="rightLabel nstSlider-val" id="rightLabelE' + theIndex + '"></div></div></div>';
    $('#eleSpanModal').html(div);

    $('#nstSliderE' + theIndex).nstSlider({
        "left_grip_selector": "#leftGripE" + theIndex,
        "right_grip_selector": "#rightGripE" + theIndex,
        "value_bar_selector": "#barE" + theIndex,
        "value_changed_callback": function (cause, leftValue, rightValue) {
            var $container = $(this).parent();
            $container.find('#leftLabelE' + theIndex).text(leftValue);
            $container.find('#rightLabelE' + theIndex).text(rightValue);
            $('#nstSliderE' + theIndex).nstSlider('highlight_range', leftValue, rightValue);
            if (theIndex == '1_1') { slideE1_1 = []; slideE1_1["threshold"] = [leftValue, rightValue]; }
            else if (theIndex == '1_2') { slideE1_2 = []; slideE1_2["threshold"] = [leftValue, rightValue]; }
            else if (theIndex == '1_3') { slideE1_3 = []; slideE1_3["threshold"] = [leftValue, rightValue]; }
            else if (theIndex == '1_4') { slideE1_4 = []; slideE1_4["threshold"] = [leftValue, rightValue]; }
            else if (theIndex == '2_1') { slideE2_1 = []; slideE2_1["threshold"] = [leftValue, rightValue]; }
            else if (theIndex == '2_2') { slideE2_2 = []; slideE2_2["threshold"] = [leftValue, rightValue]; }
            else if (theIndex == '2_3') { slideE2_3 = []; slideE2_3["threshold"] = [leftValue, rightValue]; }
            else if (theIndex == '2_4') { slideE2_4 = []; slideE2_4["threshold"] = [leftValue, rightValue]; }
            else if (theIndex == '3_1') { slideE3_1 = []; slideE3_1["threshold"] = [leftValue, rightValue]; }
            else if (theIndex == '3_2') { slideE3_2 = []; slideE3_2["threshold"] = [leftValue, rightValue]; }
            else if (theIndex == '3_3') { slideE3_3 = []; slideE3_3["threshold"] = [leftValue, rightValue]; }
            else if (theIndex == '3_4') { slideE3_4 = []; slideE3_4["threshold"] = [leftValue, rightValue]; }
            else if (theIndex == '4_1') { slideE4_1 = []; slideE4_1["threshold"] = [leftValue, rightValue]; }
            else if (theIndex == '4_2') { slideE4_2 = []; slideE4_2["threshold"] = [leftValue, rightValue]; }
            else if (theIndex == '4_3') { slideE4_3 = []; slideE4_3["threshold"] = [leftValue, rightValue]; }
            else if (theIndex == '4_4') { slideE4_4 = []; slideE4_4["threshold"] = [leftValue, rightValue]; }
        },
        "user_mouseup_callback": function (leftValue, rightValue) {
            console.log("阈值更新：" + leftValue + "---" + rightValue);
            storeStorage();
            var i = theIndex.split("_");
            if (i[1] == '1') { rtc.sendMessage(localData.mac_503_1, sensor.mac_503.query);}
            else if (i[1] == '2') { rtc.sendMessage(localData.mac_503_2, sensor.mac_503.query);}
            else if (i[1] == '3') { rtc.sendMessage(localData.mac_503_3, sensor.mac_503.query);}
            else if (i[1] == '4') { rtc.sendMessage(localData.mac_503_4, sensor.mac_503.query);}

        },
        "highlight": {
            "grip_class": "gripHighlighted",
            "panel_selector": "#highlightPanel1"
        },
    });
}

/*********************** 智慧路灯 **************************/
var modal2 = {
    theTit: {
        '0': '设备数据采集',
        '1': '设备数据采集',
    },
}
$("#myModal2").on("show.bs.modal", function (e) {
    var modalIndex = $(e.relatedTarget)[0].attributes[2].value;
    $("#modalTit2").text(modal2.theTit[modalIndex]);
    $('.theSpanL:eq(' + modalIndex + ')').removeClass('hidden').siblings().addClass('hidden');
})
//模态框导航切换
$('#theNav2 li').click(function () {
    var liIndex = $(this).attr('data-index');
    $(this).addClass('modalNavActive').siblings().removeClass('modalNavActive');
    if (liIndex == 1) {
        $('.slide').removeClass('hidden').siblings().addClass('hidden');
    } else {
        $('.history').removeClass('hidden').siblings().addClass('hidden');
    }
})
var userArr_L = [], elefluid_L = [], elePress_L = [], powerArr_L = [], sunArr_L = [], angelArr_L = [];
// 阈值--用电量
$('#nstSliderL1').nstSlider({
    "left_grip_selector": "#leftGripL1",
    "right_grip_selector": "#rightGripL1",
    "value_bar_selector": "#barL1",
    "value_changed_callback": function (cause, leftValue, rightValue) {
        var $container = $(this).parent();
        $container.find('#leftLabelL1').text(leftValue);
        $container.find('#rightLabelL1').text(rightValue);
        $('#nstSliderL1').nstSlider('highlight_range', leftValue, rightValue);
        userArr_L["threshold"] = [leftValue, rightValue];
    },
    "user_mouseup_callback": function (leftValue, rightValue) {
        console.log("阈值更新：" + leftValue + "---" + rightValue);
        storeStorage();
        rtc.sendMessage(localData.mac_501, sensor.mac_501.query);
    },
    "highlight": {
        "grip_class": "gripHighlighted",
        "panel_selector": "#highlightPanel1"
    },
});
// 阈值--电流
$('#nstSliderL2').nstSlider({
    "left_grip_selector": "#leftGripL2",
    "right_grip_selector": "#rightGripL2",
    "value_bar_selector": "#barL2",
    "value_changed_callback": function (cause, leftValue, rightValue) {
        var $container = $(this).parent();
        $container.find('#leftLabelL2').text(leftValue);
        $container.find('#rightLabelL2').text(rightValue);
        $('#nstSliderL2').nstSlider('highlight_range', leftValue, rightValue);
        elefluid_L["threshold"] = [leftValue, rightValue];
    },
    "user_mouseup_callback": function (leftValue, rightValue) {
        console.log("阈值更新：" + leftValue + "---" + rightValue);
        storeStorage();
        rtc.sendMessage(localData.mac_501, sensor.mac_501.query);
        console.log(localData.mac_501, sensor.mac_501.query)
    },
    "highlight": {
        "grip_class": "gripHighlighted",
        "panel_selector": "#highlightPanel1"
    },
});
// 阈值--电压
$('#nstSliderL3').nstSlider({
    "left_grip_selector": "#leftGripL3",
    "right_grip_selector": "#rightGripL3",
    "value_bar_selector": "#barL3",
    "value_changed_callback": function (cause, leftValue, rightValue) {
        var $container = $(this).parent();
        $container.find('#leftLabelL3').text(leftValue);
        $container.find('#rightLabelL3').text(rightValue);
        $('#nstSliderL3').nstSlider('highlight_range', leftValue, rightValue);
        elePress_L["threshold"] = [leftValue, rightValue];
    },
    "user_mouseup_callback": function (leftValue, rightValue) {
        console.log("阈值更新：" + leftValue + "---" + rightValue);
        storeStorage();
        rtc.sendMessage(localData.mac_501, sensor.mac_501.query);
    },
    "highlight": {
        "grip_class": "gripHighlighted",
        "panel_selector": "#highlightPanel1"
    },
});
// 阈值--功率
$('#nstSliderL4').nstSlider({
    "left_grip_selector": "#leftGripL4",
    "right_grip_selector": "#rightGripL4",
    "value_bar_selector": "#barL4",
    "value_changed_callback": function (cause, leftValue, rightValue) {
        var $container = $(this).parent();
        $container.find('#leftLabelL4').text(leftValue);
        $container.find('#rightLabelL4').text(rightValue);
        $('#nstSliderL4').nstSlider('highlight_range', leftValue, rightValue);
        powerArr_L["threshold"] = [leftValue, rightValue];
    },
    "user_mouseup_callback": function (leftValue, rightValue) {
        console.log("阈值更新：" + leftValue + "---" + rightValue);
        storeStorage();
        rtc.sendMessage(localData.mac_501, sensor.mac_501.query);
    },
    "highlight": {
        "grip_class": "gripHighlighted",
        "panel_selector": "#highlightPanel1"
    },
});
// 阈值--光强
$('#nstSliderL5').nstSlider({
    "left_grip_selector": "#leftGripL5",
    "right_grip_selector": "#rightGripL5",
    "value_bar_selector": "#barL5",
    "value_changed_callback": function (cause, leftValue, rightValue) {
        var $container = $(this).parent();
        $container.find('#leftLabelL5').text(leftValue);
        $container.find('#rightLabelL5').text(rightValue);
        $('#nstSliderL5').nstSlider('highlight_range', leftValue, rightValue);
        sunArr_L["threshold"] = [leftValue, rightValue];
    },
    "user_mouseup_callback": function (leftValue, rightValue) {
        console.log("阈值更新：" + leftValue + "---" + rightValue);
        storeStorage();
        rtc.sendMessage(localData.mac_501, sensor.mac_501.query);
    },
    "highlight": {
        "grip_class": "gripHighlighted",
        "panel_selector": "#highlightPanel1"
    },
});
// 阈值--倾斜角度
$('#nstSliderL6').nstSlider({
    "left_grip_selector": "#leftGripL6",
    "right_grip_selector": "#rightGripL6",
    "value_bar_selector": "#barL6",
    "value_changed_callback": function (cause, leftValue, rightValue) {
        var $container = $(this).parent();
        $container.find('#leftLabelL6').text(leftValue);
        $container.find('#rightLabelL6').text(rightValue);
        $('#nstSliderL6').nstSlider('highlight_range', leftValue, rightValue);
        angelArr_L["threshold"] = [leftValue, rightValue];
    },
    "user_mouseup_callback": function (leftValue, rightValue) {
        console.log("阈值更新：" + leftValue + "---" + rightValue);
        storeStorage();
        rtc.sendMessage(localData.mac_501, sensor.mac_501.query);
    },
    "highlight": {
        "grip_class": "gripHighlighted",
        "panel_selector": "#highlightPanel1"
    },
});
/*********************** 安防监控 *************************/
var page = {
    toPage: function (currentpage, lastpage) {
        $(currentpage).addClass("hiden");
        $(lastpage).removeClass("hidden");
        if (lastpage == "#sins") {
            $("#scene .bootstrap-switch").hide();
        }
    },
    camera_show: function (e) {
        $(e).find(".camera-info").removeClass("hidden");
    },
    camera_hide: function (e) {
        $(e).find(".camera-info").addClass("hidden");
    }
};
/*********************** 设置项 **************************/
//模态框导航切换
$('#theSetNav li').click(function () {
    var liIndex = $(this).attr('data-index');
    $(this).addClass('modalNavActive').siblings().removeClass('modalNavActive');
    $('.theSet:eq(' + liIndex + ')').removeClass('hidden').siblings().addClass('hidden');
})
$("#setModal").on("show.bs.modal", function (e) {
    $('.modalNav1').addClass('modalNavActive');
    $('.modalNav2').removeClass('modalNavActive');
    $('.theSpan1').removeClass('hidden').siblings().addClass('hidden')
})

//灯杆--二级切换
$('#breadcrumb li a').click(function () {
    var index = $(this).attr('data-index');
    $('#breadcrumb a:eq(' + index + ')').addClass('breadcrumbActive').parent().siblings().find('a').removeClass('breadcrumbActive')
    $('.firstMac:eq(' + index + ')').removeClass('hidden').siblings().addClass('hidden')
})
//智慧设施--二级切换
$('#breadcrumb1 li a').click(function () {
    var index = $(this).attr('data-index');
    $('#breadcrumb1 a:eq(' + index + ')').addClass('breadcrumbActive').parent().siblings().find('a').removeClass('breadcrumbActive')
    $('.secMac:eq(' + index + ')').removeClass('hidden').siblings().addClass('hidden')
})
//摄像头--二级切换
$('#breadcrumb2 li a').click(function () {
    var index = $(this).attr('data-index');
    $('#breadcrumb2 a:eq(' + index + ')').addClass('breadcrumbActive').parent().siblings().find('a').removeClass('breadcrumbActive')
    $('.cameraSpan:eq(' + index + ')').removeClass('hidden').siblings().addClass('hidden')
})
/*********************** 智慧中台 **************************/
$('#ligCoutNav1 li').click(function () {
    var liIndex = $(this).attr('data-index');
    $(this).addClass('navActive').siblings().removeClass('navActive');
    $('.lightSpan1:eq(' + liIndex + ')').removeClass('hidden');
    $('.lightSpan1:eq(' + liIndex + ')').siblings().addClass('hidden');
})
//智慧中台--设置切换
$('.theSpan #breadcrumb3 li a').click(function () {
    var index = $(this).attr('data-index');
    if(index==0){
        $('.ai_1').val(ai[index].app_id)
        $('.ai_2').val(ai[index].api_key)
        $('.ai_3').val(ai[index].secret_key)
    }if(index==1){
        $('.ai_4').val(ai[index].secret_id)
        $('.ai_5').val(ai[index].secret_key)
    }if(index==2){
        $('.ai_6').val(ai[index].api_key)
        $('.ai_7').val(ai[index].api_secret)
    }else{
        $('.ai_8').val(ai[index].api_key)
        $('.ai_9').val(ai[index].api_secret)
    }
    $(this).addClass('breadcrumbActive').parent().siblings().find('a').removeClass('breadcrumbActive')
    $('.firMac:eq(' + index + ')').removeClass('hidden').siblings().addClass('hidden')
})
