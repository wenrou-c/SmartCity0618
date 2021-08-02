var config = {
    'id': '4078338416',
    'key': 'XpRfpZibpJ0k1mW7FoX0dAo3pPBORKwv',
    'server': 'api.zhiyun360.com',
}
var sensor = {
    // bit0-bit2分别表示车锁,寻车音乐和预约的开关，0表示关闭，1表示打开(寻车和预约功能将会在一段时间后自动关闭)
    ofo: {
        item1: "A0",                                            //纬度经度
        switch1: "D1",                                          //开关控制
        ofoOpen1: "{OD1=1}",                                    //车锁开（单车1）-------bit0
        ofoClose1: "{CD1=1}",                                   //车锁关（单车1）-------bit0
        orderOpen1: "{OD1=4}",                                  //预约开（单车1）-------bit2
        orderClose1: "{CD1=4}",                                 //预约关（单车1）-------bit2
        query1: "{A0=?,D1=?}",
        query2: "{A1=?,D1=?}"
    },
}
