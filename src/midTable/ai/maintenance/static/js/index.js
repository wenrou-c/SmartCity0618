var currentDeviceId = 1;
var currentDeviceName = '原料仓电机';
var currentSensorMac = ['BLE:04:A3:16:A6:37:91', '00:12:4B:00:15:CF:78:66'];
var currentDeviceFailureRate = 0;
var currentDeviceRUL = 0;
var option3, option4, chart3, chart4;
// 传感器数据量
var LEN = 100;
// 设备对应的传感器MAC参数
var deviceInfo = [{
        'deviceId': 1,
        'deviceName': '原料仓电机',
        'sensorMac': ['00:12:4B:00:15:CF:78:66', '00:12:4B:00:15:D1:4D:B3']
    },
    {
        'deviceId': 2,
        'deviceName': '传输带电机',
        'sensorMac': ['PLC:SV-LOA38617', '00:12:4B:00:1B:D8:75:E0']
    },
    {
        'deviceId': 3,
        'deviceName': '冲压工作台',
        'sensorMac': ['00:12:4B:00:15:D1:4D:B3', '00:12:4B:00:1B:D8:75:E0']
    },
    {
        'deviceId': 4,
        'deviceName': '成品仓电机',
        'sensorMac': ['BLE:04:A3:16:A6:37:91', 'PLC:SV-LOA38617']
    }
];

// 根据设备id更新数据图表
function changeDevice(deviceId) {
    // 根据页面选择设备的不同，更新图表数据
    if (deviceId == 1 || deviceId == 2 || deviceId == 3 || deviceId == 4) {
        currentDeviceId = deviceId;
        for (x in deviceInfo) {
            if (deviceInfo[x]['deviceId'] == deviceId) {
                currentDeviceName = deviceInfo[x]['deviceName'];
                currentSensorMac = deviceInfo[x]['sensorMac'];
                console.log("currentDeviceId: " + currentDeviceId + ", currentDeviceName：" + currentDeviceName);
            }
        }
        currentDeviceFailureRate = getDeviceFailureRate(currentDeviceId + 15);
        currentDeviceRUL = getDeviceRUL(currentDeviceId + 15);
    } else {
        console.log('deviceId: ' + deviceId + ' not found!');
    }
}

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
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

// 测试环境网关应用ID和Key
var appId = '6542494674';
var appKey = 'VCeXm3QZcrB4Y8vDZhnNYH7wth7bRKUb';
// 生产环境网关应用ID和Key
// var appId = '9298378704';
// var appKey = '7IqsPPQwpNGssgRNnbaOzvLsVAR14MGN';

var rtc = new WSNRTConnect(appId, appKey);
rtc.connect();
rtc.isconnect = true;

// 传感器数据数组
var data_queue1 = [];
var data_queue2 = [];

// 传感器数据回调函数
function onmessageArrive(mac, msg) {
    //console.log('mac=' + mac + '; msg=' + msg);
    // 存储传感器数据，进入队列
    if (mac == currentSensorMac[0]) {
        if (msg.indexOf("{A0") != -1) {
            var _msg = msg.substr(4, 4);
            if (data_queue1.length >= LEN) {
                data_queue1.shift();
                data_queue1.push(_msg);
            } else {
                data_queue1.push(_msg);
            }
            console.log('currentSensorMac[0]=' + currentSensorMac[0] + ', data_queue1=' + data_queue1);
        }
    } else if (mac == currentSensorMac[1]) {
        if (msg.indexOf("{A0") != -1) {
            var _msg = msg.substr(4, 4);
            if (data_queue2.length >= LEN) {
                data_queue2.shift();
                data_queue2.push(_msg);
            } else {
                data_queue2.push(_msg);
            }
            console.log('currentSensorMac[1]=' + currentSensorMac[1] + ', data_queue2=' + data_queue2);
        }
    }
}
// 设置回调函数
rtc.onmessageArrive = onmessageArrive;

//预测设备失效概率
function getDeviceFailureRate(_deviceId) {
    $.get('http://192.168.100.93:5000/api/predictFailureRate?deviceId=' + _deviceId, function (data) {
        currentDeviceFailureRate = data.failure_rate;
        option3.series[1].data[0].value = currentDeviceFailureRate;
        chart3.setOption(option3, true);
    });

}

//预测设备剩余生命周期RUL
function getDeviceRUL(_deviceId) {
    $.get('http://192.168.100.93:5000/api/predictRUL?deviceId=' + _deviceId, function (data) {
        currentDeviceRUL = data.rul;
        option4.title[1].text = currentDeviceRUL,
            option4.series[0].data = [
                [currentDeviceRUL, currentDeviceFailureRate]
            ];
        if (currentDeviceFailureRate > 90) {
            option4.title[1].textStyle.color = 'red';
            option4.series[0].itemStyle.color = 'red';
        } else if (currentDeviceFailureRate > 60) {
            option4.title[1].textStyle.color = 'yellow';
            option4.series[0].itemStyle.color = 'yellow';
        } else {
            option4.title[1].textStyle.color = '#66EE66';
            option4.series[0].itemStyle.color = '#66EE66';
        }
        chart4.setOption(option4, true);
    });

}
$(function () {
    $(".btn-info").click(function () {
        window.history.go(-1);
    })
})