$(function () {
    //返回
    $(".back_home").click(function () {
        window.history.go(-1);
    });
    // 区块链平台tab
    $('.info').hide().eq(0).show();
    $(".infotitle button").click(function (index) {
        var i = $(this).index();
        $('.info').hide().eq(i).show();
        $(this).addClass("select").siblings().removeClass("select");
    });
    // $.ajax({
    //     url: 'js/fabric-network.json',
    //     method: 'GET',
    //     dataType: 'json',
    //     success(result) {
    //         //有服务器情况下，引用json
    //         loadNodes(result.network)
    //     },
    //     error(error) {
    //         //无服务器情况下，引用js
    //         loadScript('js/fabric-network.js', function () {
    //             loadNodes(localnetwork.network)
    //         })
    //     }
    // })
});
//网络拓扑
function loadNodes(network) {
    var canvas = document.getElementById('canvas');
    var stage = new JTopo.Stage(canvas); // 创建一个舞台对象
    var scene = new JTopo.Scene(stage); // 创建一个场景对象
    scene.alpha = 1; //透明度
    // scene.backgroundColor = '7,15,74';
    // scene.backgroundColor = '4,15,33';
    var arr = []
    var showText = []
    var ip = []
    var currentNode = null;
    var width = parseInt($('#canvas').attr('width'))
    var height = parseInt($('#canvas').attr('height'))
    for (var i = 0; i < network.length; i++) {
        var node = new JTopo.Node("节点：" + network[i].ip); // 创建一个节点
        var textArray = network[i].service;
        var textContent = ''
        for (var j = 0; j < textArray.length; j++) {
            textContent += '<li>' + textArray[j].serviceType + '&nbsp:&nbsp;' + textArray[j].serviceName + '</li>'

        }
        node.setLocation(width * network[i].locationx, height * network[i].locationy); // 设置节点坐标      
        // node.fontColor = '1,226,233'; //节点字体颜色
        node.fontColor = '0,0,0'; //节点字体颜色
        node.font = "14px Consolas";
        node.setImage(network[i].picture); // 设置图片 
        node.setSize(90, 90)
        node.zIndex = 999
        node.shadow = false;
        scene.add(node); // 放入到场景中
        //  scene.background = 'img/node_bg.png'
        node.addEventListener('mouseover', function (event) {
            currentNode = this;
            var thisip = this.text.replace("节点：", "")
            for (var m = 0; m < ip.length; m++) {
                if (ip[m] == thisip) {
                    $("#contextmenu").html(showText[m])
                }
            }
            $("#contextmenu").css({
                top: this.y - 15,
                left: this.x + 120
            }).show();
        });
        node.addEventListener('mouseout', function (event) {
            $("#contextmenu").hide()
        });
        arr.push(node)
        showText.push(textContent)
        ip.push(network[i].ip)
    }
    for (var i = 0; i < arr.length; i++) {
        for (var j = i + 1; j < arr.length; j++) {
            var link = new JTopo.Link(arr[i], arr[j]); // 增加连线
            link.strokeColor = '54,136,255';
            link.lineWidth = 1;
            link.shadow = false;
            scene.add(link);
        }
    }
}

function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (typeof (callback) != "undefined") {
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
                    callback();
                }
            };
        } else {
            script.onload = function () {
                callback();
            };
        }
    };
    script.src = url;
    document.body.appendChild(script);
}
