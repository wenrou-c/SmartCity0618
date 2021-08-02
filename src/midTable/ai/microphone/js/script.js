var mac2typeAll = {};
var mac2type = {};
// 点击开关的加载效果定时器
var load_timer = null;
// 记录当前安防类传感器状态
var alarmSensor_state = {
	"gas" : 0,
	"fire" : 0,
	"fence" : 0,
	"holzer" : 0,
	"vibration" : 0,
	"body" : 0
}

var mac2sensor = {};
var type2mac = {};
function update_config_mac(type, mac) {
	if(type==typeArr[0]){
		wsn_sensor.temp.mac = wsn_sensor.humi.mac = wsn_sensor.illum.mac = wsn_sensor.air.mac = wsn_sensor.pressure.mac = mac;
	}
	else if(type == typeArr[1]){
		wsn_sensor.control.mac= mac;
	}
	else if(type == typeArr[2]){
		wsn_sensor.gas.mac = wsn_sensor.fire.mac = wsn_sensor.fence.mac = wsn_sensor.holzer.mac = wsn_sensor.vibration.mac = wsn_sensor.body.mac = mac;
	}
	else if(type==typeArr[3]){
		wsn_sensor.lcd.mac = wsn_sensor.led.mac = mac;
	}
	else if(type==typeArr[4]){
		wsn_sensor.rfid.mac = wsn_sensor.lock.mac = mac;
	}
	else if(type==typeArr[5]){
		wsn_sensor.etc.mac = mac;
	}
	mac2type[mac] = type;
	if(!type2mac[type])
		type2mac[type] = [];
	if($.inArray(mac, type2mac[type])<0){
		type2mac[type].push(mac);
	}
	console.log("%c type2mac="+JSON.stringify(type2mac), "color:black");
}

var init = [];
var macs = {};
var flag_typeArr = [];//用于判断type是否已全部遍历过
var flag_timer = null;
// 发送初始查询指令？
function dev_init(mac, type){
	// 注册一个计时器，5秒之后强行调整flag_typeArr的长度使不再进入此循环
	if(!flag_timer){
		flag_timer = setTimeout(function () {
			flag_typeArr.length =typeArr.length;
		}, 15000)
	}
	for (var k in wsn_sensor) {
		var m = wsn_sensor[k].mac;
		if (m != null && m.length > 0) {
			if (!macs[m]) {
				macs[m] = {};
			}
			macs[m][wsn_sensor[k].channel] = 1;
		}
		if(!mac2sensor[mac]){
			mac2sensor[mac] = {}
		}
		// 当且仅当 mac对应的type 跟k对应的type相等时，把k存入mac2sensor
		if(mac2type[mac] == wsn_sensor[k].type)
			mac2sensor[mac][wsn_sensor[k].channel] = k;
		if($.inArray(type, flag_typeArr)<0){
			flag_typeArr.push(type);
		}
	}
	for (var k in macs) {
		var cmd = "";
		for (var c in macs[k]) {
			if (cmd.length > 0) cmd += ",";
			cmd += c+"=?";
		}
	}
}

var ioffset = 0;
var isHandConnect = false;
function _send_init_cmd() {
	if (rtc._connect && ioffset < init.length) {
		rtc.sendMessage(init[ioffset].mac, init[ioffset].cmd);
		console.log("sends", init[ioffset].mac, init[ioffset].cmd);
		ioffset++;
		setTimeout(_send_init_cmd, 500);
	}
}
function onConnect(){
	rtc._connect=true;
	ioffset = 0;
	flag_typeArr = [];
	$("#aid_save").val("断开");
	swal({
		icon: "success",
		title: "连接网关成功！",
		text: "已连接到"+config["id"],
		timer: 2000,
		button: false
	});
}
var lost_num = 0, lost_timer = null;
var reconnect_timer;
var isHandLost = false;
function onConnectLost(){
	$(".setup").removeClass("setup-on");
	rtc._connect = false;
	$("#aid_save").val("连接");
	// 判断当前是否为手动断开，手动断开的不自动连接
	if(!isHandLost){
		var num = 1;
		reconnect_timer= setInterval(function () {
			num--;
		},1000);
		lost_timer= setTimeout(function () {
			if(reconnect_timer)
				clearInterval(reconnect_timer);
			$("#aid_save").click();
			lost_num++;
		}, 3000);
		swal({
			icon: "info",
			title: "连接智云网关失败！",
			text: "连接智云网关失败，请正确输入ID、KEY和mac地址连接智云数据中心！",
			timer: 2000,
			button: false
		});
	}else{
		if(isHandConnect){
			swal({
				icon: "info",
				title: "连接智云网关失败！",
				text: "连接智云网关失败，请正确输入Server、ID、KEY连接智云数据中心！",
				timer: 2000,
				button: false
			});
		}else{
			swal({
				icon: "success",
				title: "连接已断开！",
				text: "当前连接已成功断开！",
				timer: 2000,
				button: false
			});
		}
	}
	if(lost_num>0){
		if(lost_timer)
			clearTimeout(lost_timer);
		if(reconnect_timer)
			clearInterval(reconnect_timer);
		isHandLost = false;
	}
}
function onmessageArrive(mac, dat) {
	console.log(mac+" >>> "+dat);
	if (dat[0]=='{' && dat[dat.length-1]=='}') {
		dat = dat.substr(1, dat.length-2);
		var its = dat.split(',');
		for (var i=0; i<its.length; i++) {
			var it = its[i].split('=');
			if (it.length == 2) {
				var tag = it[0];
				var val = it[1];
				process_tag(mac, tag, val);
			}
		}
	}
	// 如果不是type,检查是否在数组mac2type中且目标节点未全部上线，没有的话查询
    if (!mac2typeAll[mac] && JSON.stringify(mac2type).split(",").length < 6) { //不存在
        rtc.sendMessage(mac, "{TYPE=?}")
        console.log(mac, "{TYPE=?}----------------------------------------");
    }
}

function clear_load_timer(){
	clearTimeout(load_timer);
	load_timer;
}

function ctrl_2_set(id, st) {
	console.log("ctrl 2 set", id, st);
	var cid = "#id_"+id;
	if (st != 0){
		if(cid=="#id_led"&&st == 48){
			document.getElementById('led-state').innerText = "ON";
			$("span[id='led-state']").attr("class","state atvite");
			$("img[name='led']").attr('src', 'images/light-on.gif');
		}else if(cid!="#id_led"){
			if(id=="fan"){
				document.getElementById('fan-state').innerText = "ON";
    			$("span[id='fan-state']").attr("class","state atvite");
    			$("img[name='fan']").attr('src', 'images/fan-on.gif');
			}else if(id=="curtain"){
				document.getElementById('curtain-state').innerText = "ON";
				$("span[id='curtain-state']").attr("class","state atvite");
				$("img[name='curtain']").attr('src', 'images/curtains-on.png');
			}else if(id=="relay"){
				document.getElementById('relay-state').innerText = "ON";
				$("span[id='relay-state']").attr("class","state atvite");
				$("img[name='relay']").attr('src', 'images/air-conditioning-on.gif');
			}
		}
	} else{
		if(id=="fan"){
			document.getElementById('fan-state').innerText = "OFF";
			$("span[id='fan-state']").attr("class","state");
			$("img[name='fan']").attr('src', 'images/fan-off.png');
		}else if(id=="curtain"){
			document.getElementById('curtain-state').innerText = "OFF";
			$("span[id='curtain-state']").attr("class","state");
			$("img[name='curtain']").attr('src', 'images/curtains-off.png');
		}else if(id=="relay"){
			document.getElementById('relay-state').innerText = "OFF";
			$("span[id='relay-state']").attr("class","state");
			$("img[name='relay']").attr('src', 'images/air-conditioning-off.png');
		}else if(id=="led"){
			document.getElementById('led-state').innerText = "OFF";
			$("span[id='led-state']").attr("class","state");
			$("img[name='led']").attr('src', 'images/light-off.png');
		}
	}
	$(id).attr('custom', st.toString());
	clear_load_timer();
}

function operate(sensor_id){
	if(!rtc._connect){
		swal({
			icon: "error",
			title: "连接网关失败！",
			text: "当前未连接，请连接后重试！",
			timer: 2000,
			button: false
		});
		return;
	}
	var id = "#"+sensor_id;
    if($(id).attr('custom')==0){
    	if(sensor_id=="led"){
    		openLed();
		}else if(sensor_id=="fan"){
    		openFan();
		}
		else if(sensor_id=="curtain"){
    		openCurtains();
		}
		else if(sensor_id=="relay"){
    		openAirConditioning();
		}
		$(id).attr('custom', '1');
    }else{
    	if(sensor_id=="led"){
    		closeLed();
		}else if(sensor_id=="fan"){
    		closeFan();
		}
		else if(sensor_id=="curtain"){
    		closeCurtains();
		}
		else if(sensor_id=="relay"){
    		closeAirConditioning();
		}
		$(id).attr('custom', '0');
    }
}

function openFan(){
	if(!rtc._connect){
		swal({
			icon: "error",
			title: "连接网关失败！",
			text: "当前未连接，请连接后重试！",
			timer: 2000,
			button: false
		});
		return;
	}
	rtc.sendMessage(wsn_sensor.control.mac, wsn_sensor.control.controller.fan.cmd_open);
	document.getElementById('fan-state').innerText = "ON";
    $("span[id='fan-state']").attr("class","state atvite");
    $("img[name='fan']").attr('src', 'images/fan-on.gif');
}

function closeFan(){
	if(!rtc._connect){
		swal({
			icon: "error",
			title: "连接网关失败！",
			text: "当前未连接，请连接后重试！",
			timer: 2000,
			button: false
		});
		return;
	}
	rtc.sendMessage(wsn_sensor.control.mac, wsn_sensor.control.controller.fan.cmd_close);
	document.getElementById('fan-state').innerText = "OFF";
    $("span[id='fan-state']").attr("class","state");
    $("img[name='fan']").attr('src', 'images/fan-off.png');
}

function openCurtains(){
	if(!rtc._connect){
		swal({
			icon: "error",
			title: "连接网关失败！",
			text: "当前未连接，请连接后重试！",
			timer: 2000,
			button: false
		});
		return;
	}
	rtc.sendMessage(wsn_sensor.control.mac, wsn_sensor.control.controller.curtain.cmd_open);
	document.getElementById('curtain-state').innerText = "ON";
    $("span[id='curtain-state']").attr("class","state atvite");
    $("img[name='curtain']").attr('src', 'images/curtains-on.png');
}

function closeCurtains(){
	if(!rtc._connect){
		swal({
			icon: "error",
			title: "连接网关失败！",
			text: "当前未连接，请连接后重试！",
			timer: 2000,
			button: false
		});
		return;
	}
	rtc.sendMessage(wsn_sensor.control.mac, wsn_sensor.control.controller.curtain.cmd_close);
	document.getElementById('curtain-state').innerText = "OFF";
    $("span[id='curtain-state']").attr("class","state");
    $("img[name='curtain']").attr('src', 'images/curtains-off.png');
}

function openAirConditioning(){
	if(!rtc._connect){
		swal({
			icon: "error",
			title: "连接网关失败！",
			text: "当前未连接，请连接后重试！",
			timer: 2000,
			button: false
		});
		return;
	}
	rtc.sendMessage(wsn_sensor.control.mac, wsn_sensor.control.controller.relay.cmd_open);
	document.getElementById('relay-state').innerText = "ON";
    $("span[id='relay-state']").attr("class","state atvite");
    $("img[name='relay']").attr('src', 'images/air-conditioning-on.gif');
}

function closeAirConditioning(){
	if(!rtc._connect){
		swal({
			icon: "error",
			title: "连接网关失败！",
			text: "当前未连接，请连接后重试！",
			timer: 2000,
			button: false
		});
		return;
	}
	rtc.sendMessage(wsn_sensor.control.mac, wsn_sensor.control.controller.relay.cmd_close);
	document.getElementById('relay-state').innerText = "OFF";
    $("span[id='relay-state']").attr("class","state");
    $("img[name='relay']").attr('src', 'images/air-conditioning-off.png');
}

function openLed(){
	if(!rtc._connect){
		swal({
			icon: "error",
			title: "连接网关失败！",
			text: "当前未连接，请连接后重试！",
			timer: 2000,
			button: false
		});
		return;
	}
	rtc.sendMessage(wsn_sensor.control.mac, wsn_sensor.control.controller.led.cmd_open);
	document.getElementById('led-state').innerText = "ON";
    $("span[id='led-state']").attr("class","state atvite");
    $("img[name='led']").attr('src', 'images/light-on.gif');
}

function closeLed(){
	if(!rtc._connect){
		swal({
			icon: "error",
			title: "连接网关失败！",
			text: "当前未连接，请连接后重试！",
			timer: 2000,
			button: false
		});
		return;
	}
	rtc.sendMessage(wsn_sensor.control.mac, wsn_sensor.control.controller.led.cmd_close);
	document.getElementById('led-state').innerText = "OFF";
    $("span[id='led-state']").attr("class","state");
    $("img[name='led']").attr('src', 'images/light-off.png');
}

//统一发送数据
function sendMess(mac, cmd){
	if(rtc._connect && mac.indexOf("00:00:00")<0 && cmd){
		rtc.sendMessage(mac, cmd);
		console.log("%c 成功发送指令="+cmd, "color:red");
	}
	console.log("%c mac="+mac+"---cmd="+cmd, "color:red");
}
var modal_show_timer = null;
//根据传感器名区分是哪一种传感器：控制类、安防类
var controller2id = {
	curtain:"curtain",
	buzzer:"buzzer",
	fan: "fan",
	led:"led",
	relay:"relay"
};
var alarm2id = {
	gas:"id_gas",
	fire:"id_fire",
	fence:"id_fence",
	holzer:"id_holzer",
	vibration:"id_vibration",
	body:"id_body"
}
var collection2id = {
	temp:"id_temp",
	humi:"id_humi",
	illum:"id_illum",
	air:"id_air",
	pressure:"id_pressure",
	step:"id_step",
	voice: "id_voice"
};
var collection2id_unit = {
	temp:"℃",
	humi:"%",
	illum:"Lux",
	air:"",
	step:"",
	pressure:"hPa"
};


//处理服务器数据
function process_tag(mac, tag, val) {
	console.log(mac,tag,val);
	if(tag=="PN")return;
	if (tag == "TYPE") {
		var t = val.substr(2,3);
		mac2typeAll[mac] = t;
		if($.inArray(t, typeArr)>-1){
			update_config_mac(t, mac); // mac地址填入wsn_sensor对象中
			dev_init(mac, t); // 发送初始查询指令
			$("#type_"+t).val(mac);//mac地址填入输入框
			var success_content = "";
			if(t==601){
				config["601"] = mac;
				localStorage.setItem("smartHome", JSON.stringify(config));
				rtc.sendMessage(mac, '{A0=?,A1=?,A2=?.5,A3=?,A4=?,A5=?,A6=?}');
			}else if(t==602){
				config["602"] = mac;
				localStorage.setItem("smartHome", JSON.stringify(config));
			}else if(t==603){
				config["603"] = mac;
				localStorage.setItem("smartHome", JSON.stringify(config));
			}else if(t==604){
				config["604"] = mac;
				localStorage.setItem("smartHome", JSON.stringify(config));
			}else if(t==605){
				config["605"] = mac;
				localStorage.setItem("smartHome", JSON.stringify(config));
			}else if(t==606){
				config["606"] = mac;
				localStorage.setItem("smartHome", JSON.stringify(config));
			}
		}
	}else{
		var sensor;
		try{
			sensor = mac2sensor[mac][tag];
		}catch(e){
			//sendMess(mac, "{TYPE=?,A0=?,A1=?,A2=?,A3=?,A4=?,A5=?,A6=?,A7=?,D1=?}");
		}
		if(sensor){
			var s = wsn_sensor[sensor];
			if (s.mac == mac && s.channel == tag) {
				// 控制类传感器获取数据
				if (sensor == "control") {
					var controllerObj = s.controller;
					for(var i in controllerObj){
						var v = parseInt(val) & controllerObj[i].mask;
						ctrl_2_set(controller2id[i], v);
					}
				}
				// 警报类传感器获取数据
				else if(alarm2id[sensor]){
					//$("#"+alarm2id[sensor]).text(val);
					if(val==1){
						$("#"+alarm2id[sensor]).addClass("active");
						if(sensor=="fence"){
							takePhoto(1);
						}else if(sensor=="fire"){
							takePhoto(2);
						}
					}else{
						$("#"+alarm2id[sensor]).removeClass("active");
					}
					alarmSensor_state[sensor] = val;
				}
				// 采集类传感器获取数据
				else if (collection2id[sensor]) {
					//小于0或大于99的湿度值，跳过以下语句
					if ("%" == collection2id_unit[sensor] && (val >99 || val < 0)) return;
					// 采集类数据赋值到对应节点
					//$("#"+collection2id[sensor]).text(val+collection2id_unit[sensor]);
					$("#"+collection2id[sensor]).text(val);
                }
				// rfid单独获取数据
				else if(sensor == "rfid"){
					if(modal_show_timer)
						clearTimeout(modal_show_timer);
					var report_rfid = function () {
						$("#confirmModal").modal("hide");
					}
					swal({
						icon: "error",
						title: "连接网关失败！",
						text: "当前未连接，请连接后重试！",
						timer: 2000,
						button: false
					});
					console.log("检测到刷卡操作", val, report_rfid);

					//发送开锁指令
					rtc.sendMessage(wsn_sensor["lock"]["mac"], wsn_sensor["lock"]["cmd_open"]);
				}
			}
		}
	}
	//run_auto_ctrl(mac, tag, val);
}

//数据连接对象
var rtc = new WSNRTConnect();
rtc.onConnect = onConnect;
rtc.onConnectLost = onConnectLost;
rtc.onmessageArrive = onmessageArrive;
rtc._connect = false;

function initConnect(){
	if (config["server"] && config["id"] && config["key"]) {
		rtc.setIdKey(config["id"], config["key"]);
		rtc.setServerAddr(config["server"]);
		swal({
			icon: "info",
			title: "连接网关！",
			text: "正在连接智云网关，请稍候！",
			button: false
		});
		rtc.connect();

		console.log("%c 建立连接", "color:red");
	}else{
		swal({
			icon: "info",
			title: "请连接智云网关！",
			text: "请前往设置页面配置好网关信息并进行连接！",
			timer: 2000,
			button: false
		});
	}
}

function storeStorage(){
	localStorage.setItem("smartHome", JSON.stringify(config));
	console.log("保存成功："+localStorage.getItem("smartHome"));
}

function get_localStorage(){
	var idList = JSON.parse(localStorage.getItem("information_mainList")).idList
	config["id"] = idList[0].value*1
	config["key"] = idList[1].value
	config["server"] = idList[2].value
	initConnect();
}

$(function(){
	get_localStorage();
});
