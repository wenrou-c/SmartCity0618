var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
var wavesurfer, context, processor, recorder, play_wavesurfer;


//获取cookie值
function getCookie(name) {
    var value = '; ' + document.cookie
    var parts = value.split('; ' + name + '=')
    if (parts.length === 2) {
        return parts.pop().split(';').shift()
    }
}

function startRecording(button) {
    if (wavesurfer === undefined) {
        var AudioContext =
            window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
        processor = context.createScriptProcessor(1024, 1, 1);
        navigator.mediaDevices.getUserMedia({
            audio: true
        }).then((stream) => {
            var input = context.createMediaStreamSource(stream);
            // eslint-disable-next-line no-undef
            recorder = new Recorder(input);
            // Init wavesurfer
            wavesurfer = WaveSurfer.create({
                container: '#yysb_audio_waveform',
                waveColor: '#00ffff',
                interact: false,
                cursorWidth: 0,
                audioContext: context || null,
                audioScriptProcessor: processor || null,
                plugins: [
                    WaveSurfer.microphone.create({
                        bufferSize: 4096,
                        numberOfInputChannels: 1,
                        numberOfOutputChannels: 1,
                        constraints: {
                            video: false,
                            audio: true
                        }
                    })
                ]
            });
            //放音声纹
            play_wavesurfer = WaveSurfer.create({
                container: '#yysb_audio_waveform2',
                waveColor: '#00ffff',

            });

            wavesurfer.microphone.on('deviceReady', function () {
                console.info('Device ready!');
            });
            wavesurfer.microphone.on('deviceError', function (code) {
                console.warn('Device error: ' + code);
            });
            wavesurfer.on('error', function (e) {
                console.warn(e);
            });
            wavesurfer.microphone.start();
            recorder && recorder.record();
            button.disabled = true;
            button.nextElementSibling.disabled = false;
        })

    } else {
        wavesurfer.microphone.start();
        recorder && recorder.record();
        button.disabled = true;
        button.nextElementSibling.disabled = false;
    }

}

//结束录音
function stopRecording(button) {
    wavesurfer.microphone.stop();
    recorder && recorder.stop();
    createDownloadLink();
    recorder.clear();
    button.disabled = true;
    button.previousElementSibling.disabled = false;
}

function createDownloadLink() {
    recorder && recorder.exportWAV(function (blob) {
        let url = URL.createObjectURL(blob);
        play_wavesurfer.load(url);

        let formData = new FormData();
        formData.set('file1_name', blob, 'audio.wav');
        //formData.append('algorithm_id', '7');
        formData.append('algorithm_name', 'baidu_speech_recognition');
        formData.append('type_id', '5');

        swal({
            title: "语音识别",
            icon: "info",
            text: "正在上传语音并进行识别！",
            //timer: 2000,
            button: false
        });
        $.ajax({
            url: 'http://127.0.0.1:8002/API/algorithms/',
            method: 'POST',
            processData: false, // 必须
            contentType: false, // 必须
            dataType: 'json',
            data: formData,
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            success(result) {
                var synthesis_content = "";
                console.log(result);
                if (result.code == 200) {
                    $('#yysb_result').html(result.msg)
                    var control_type = 0;
                    if (result.msg.indexOf("开") != -1) {
                        if (result.msg.indexOf("风扇") != -1) {
                            var flag = openFan();
                            if (flag) {
                                swal({
                                    title: "打开风扇",
                                    icon: "success",
                                    text: "风扇已打开！",
                                    timer: 2000,
                                    button: false
                                });
                            }
                        } else if (result.msg.indexOf("传送带") != -1) {
                            openBelt();
                            swal({
                                title: "打开传送带",
                                icon: "success",
                                text: "传送带已打开！",
                                timer: 2000,
                                button: false
                            });
                        } else if (result.msg.indexOf("滑台") != -1) {
                            openSlide();
                            swal({
                                title: "打开滑台",
                                icon: "success",
                                text: "滑台已打开！",
                                timer: 2000,
                                button: false
                            });
                        } else {
                            swal({
                                title: "识别成功",
                                icon: "success",
                                text: "没有相关的控制指令！",
                                timer: 2000,
                                button: false
                            });
                        }
                    } else if (result.msg.indexOf("关") != -1) {
                        if (result.msg.indexOf("风扇") != -1) {
                            closeFan();
                            swal({
                                title: "关闭风扇",
                                icon: "success",
                                text: "风扇已关闭！",
                                timer: 2000,
                                button: false
                            });
                        } else if (result.msg.indexOf("传送带") != -1) {
                            closeBelt();
                            swal({
                                title: "关闭传送带",
                                icon: "success",
                                text: "传送带已关闭！",
                                timer: 2000,
                                button: false
                            });
                        } else if (result.msg.indexOf("滑台") != -1) {
                            closeSlide();
                            swal({
                                title: "关闭滑台",
                                icon: "success",
                                text: "滑台已关闭！",
                                timer: 2000,
                                button: false
                            });
                        } else {
                            swal({
                                title: "识别成功",
                                icon: "success",
                                text: "没有相关的控制指令！",
                                timer: 2000,
                                button: false
                            });
                        }
                    } else if (result.msg.indexOf("温度") != -1) {
                        //control_type = 1;
                        synthesis_content = "当前温度是" + $("#id_temp").text() + "摄氏度";
                    } else if (result.msg.indexOf("湿度") != -1) {
                        //control_type = 2;
                        synthesis_content = "当前湿度是百分之" + $("#id_humi").text();
                    } else if (result.msg.indexOf("光强") != -1) {
                        //control_type = 3;
                        synthesis_content = "当前光强是" + $("#id_illum").text() + "坎德拉";
                    } else if (result.msg.indexOf("空气") != -1) {
                        //control_type = 4;
                        synthesis_content = "当前空气质量指数是" + $("#id_air").text();
                    } else if (result.msg.indexOf("大气压") != -1) {
                        //control_type = 5;
                        synthesis_content = "当前标准大气压是" + $("#id_pressure").text() + "千帕";
                    } else {
                        swal({
                            title: "识别成功",
                            icon: "success",
                            text: "没有相关的控制指令！",
                            timer: 2000,
                            button: false
                        });
                    }
                    if (synthesis_content != "") {
                        swal({
                            title: "语音识别成功！",
                            icon: "success",
                            text: "识别成功，正在查询",
                            //timer: 2000,
                            button: false
                        });
                        //语音合成播报
                        var formData = new FormData();
                        //formData.append('algorithm_id', '8');
                        formData.append('algorithm_name', 'baidu_speech_synthesis');
                        formData.append('type_id', '1');
                        formData.append('predict_classes', synthesis_content)
                        $.ajax({
                            url: 'http://127.0.0.1:8002/API/algorithms/',
                            method: 'POST',
                            processData: false, // 必须
                            contentType: false, // 必须
                            dataType: 'json',
                            data: formData,
                            headers: {
                                'X-CSRFToken': getCookie('csrftoken')
                            },
                            success(result) {
                                if (result.code == 200) {
                                    swal({
                                        title: "查询成功",
                                        icon: "success",
                                        text: "查询成功！",
                                        timer: 1000,
                                        button: false
                                    });
                                    if (result.hasOwnProperty("audio")) {
                                        $("audio[name='synthesis-audio']").attr('src', result.audio);
                                        $("audio[name='synthesis-audio']").attr('autoplay', 'autoplay');
                                    }
                                } else {
                                    swal({
                                        title: "查询失败",
                                        icon: "error",
                                        text: "查询失败！",
                                        timer: 1000,
                                        button: false
                                    });
                                }
                            },
                            error(error) {
                                console.log(error);
                                swal({
                                    title: "查询失败",
                                    icon: "error",
                                    text: "查询失败！",
                                    timer: 1000,
                                    button: false
                                });
                            }
                        })
                    }

                } else {
                    swal({
                        title: "识别失败！",
                        icon: "error",
                        text: "2秒后自动关闭。",
                        timer: 2000,
                        button: false
                    })
                }
            },
            error(error) {
                console.log(error);
                swal('数据异常', {
                    icon: "error",
                    button: false,
                    timer: 2000,
                });
            }
        })
    });
}

function openFan() {
    if (!rtc._connect) {
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
    // $("button[id='fan-state']").attr("class","atvite");
    $("img[name='fan']").attr('src', 'img/fan_on.gif');
    return true
}

function closeFan() {
    if (!rtc._connect) {
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
    // $("button[id='fan-state']").attr("class", "state");
    $("img[name='fan']").attr('src', 'img/fan_off.png');
}

function openSlide() {
    if (!rtc._connect) {
        swal({
            icon: "error",
            title: "连接网关失败！",
            text: "当前未连接，请连接后重试！",
            timer: 2000,
            button: false
        });
        return;
    }
    rtc.sendMessage(wsn_sensor.control.mac, wsn_sensor.control.controller.slide.cmd_open);
    document.getElementById('slide-state').innerText = "ON";
    // $("button[id='slide-state']").attr("class","state atvite");
    $("img[name='slide']").attr('src', 'img/slide_on.gif');
}

function closeSlide() {
    if (!rtc._connect) {
        swal({
            icon: "error",
            title: "连接网关失败！",
            text: "当前未连接，请连接后重试！",
            timer: 2000,
            button: false
        });
        return;
    }
    rtc.sendMessage(wsn_sensor.control.mac, wsn_sensor.control.controller.slide.cmd_close);
    document.getElementById('slide-state').innerText = "OFF";
    // $("button[id='slide-state']").attr("class","state");
    $("img[name='slide']").attr('src', 'img/slide_off.png');
}

function openBelt() {
    if (!rtc._connect) {
        swal({
            icon: "error",
            title: "连接网关失败！",
            text: "当前未连接，请连接后重试！",
            timer: 2000,
            button: false
        });
        return;
    }
    rtc.sendMessage(wsn_sensor.control.mac, wsn_sensor.control.controller.belt.cmd_open);
    document.getElementById('belt-state').innerText = "ON";
    // $("button[id='belt-state']").attr("class","state atvite");
    $("img[name='belt']").attr('src', 'img/relay_on.gif');
}

function closeBelt() {
    if (!rtc._connect) {
        swal({
            icon: "error",
            title: "连接网关失败！",
            text: "当前未连接，请连接后重试！",
            timer: 2000,
            button: false
        });
        return;
    }
    rtc.sendMessage(wsn_sensor.control.mac, wsn_sensor.control.controller.belt.cmd_close);
    document.getElementById('belt-state').innerText = "OFF";
    // $("button[id='belt-state']").attr("class","state");
    $("img[name='belt']").attr('src', 'img/relay_off.png');
}
$(function () {
    $("#backHome").click(function () {
        window.history.go(-1);
    })
})