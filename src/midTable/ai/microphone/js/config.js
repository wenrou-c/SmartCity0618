var config = {
    'id' : 1591161372,
    'key' : 'WHXhDeLi4KWHjoBfNyefgn7q9Z1QF09d',
    'server' : 'api.zhiyun360.com:28080',
    '601':'',
    '602':'',
    '603':'',
    '604':'',
    '605':'',
    '606':''
}

wsn_sensor = {
    temp:{
        mac:"00:00:00:00:00:00",
        channel:"A0",
        query:"{A0=?}",
        type:"601"
    },
    humi:{
        mac:"00:00:00:00:00:00",
        channel:"A1",
        query:"{A1=?}",
        type:"601"
    },
    illum:{
        mac:"00:00:00:00:00:00",
        channel:"A2",
        query:"{A2=?}",
        type:"601"
    },
    air:{
        mac:"00:00:00:00:00:00",
        channel:"A3",
        query:"{A3=?}",
        type:"601"
    },
    pressure:{
        mac:"00:00:00:00:00:00",
        channel:"A4",
        query:"{A4=?}",
        type:"601"
    },
    curtain:{
        mac:"00:00:00:00:00:00",
        channel:"D1",
        cmd_open:"{OD1=4,D1=?}", // 正转
        cmd_close:"{CD1=4,D1=?}", // 反转
        mask:0x04,
        type:"602"
    },
    fan:{
        mac:"00:00:00:00:00:00",
        channel:"D1",
        cmd_open:"{OD1=1,D1=?}",
        cmd_close:"{CD1=1,D1=?}"
    },
    belt:{
        mac:"00:00:00:00:00:00",
        channel:"D1",
        cmd_open:"{OD1=2}",
        cmd_close:"{CD1=2}",
    },
    slide:{
        mac:"00:00:00:00:00:00",
        channel:"D1",
        cmd_open:"{OD1=4}",
        cmd_close:"{CD1=4}",
    },
    buzzer:{
        mac:"00:00:00:00:00:00",
        channel:"D1",
        cmd_open:"{OD1=8,D1=?}",
        cmd_close:"{CD1=8,D1=?}",
        mask:0x08,
        type:"602"
    },
    led:{
        mac:"00:00:00:00:00:00",
        channel:"D1",
        cmd_open:"{OD1=16,OD1=32,D1=?}",
        cmd_close:"{CD1=16,CD1=32,D1=?}",
        mask:0xB0,
        type:"602"
    },
    relay:{
        mac:"00:00:00:00:00:00",
        channel:"D1",
        cmd_open:"{OD1=64,OD1=128,D1=?}",
        cmd_close:"{CD1=64,CD1=128,D1=?}",
        mask:0x40,
        type:"602"
    },
    // 控制类集中处理
    control : {
        mac:"00:00:00:00:00:00",
        channel:"D1",
        type:"602",
        controller : {
            curtain:{
                cmd_open:"{OD1=4,D1=?}", // 正转
                cmd_close:"{CD1=4,D1=?}", // 反转
                mask:0x04,
            },
            fan:{
                cmd_open:"{OD1=8,D1=?}",
                cmd_close:"{CD1=8,D1=?}",
                mask:0x08,
            },
            buzzer:{
                cmd_open:"{OD1=8,D1=?}",
                cmd_close:"{CD1=8,D1=?}",
                mask:0x08,
            },
            led:{
                cmd_open:"{OD1=16,OD1=32,D1=?}",
                cmd_close:"{CD1=16,CD1=32,D1=?}",
                mask:0xB0,
            },
            relay:{
                cmd_open:"{OD1=64,OD1=128,D1=?}",
                cmd_close:"{CD1=64,CD1=128,D1=?}",
                mask:0x40,
            },
            belt:{
                cmd_open:"{OD1=2}",
                cmd_close:"{CD1=2}",
                mask:0x40,
            },
            slide:{
                cmd_open:"{OD1=4}",
                cmd_close:"{CD1=4}",
                mask:0x40,
            },
        }
    },
    gas:{
        mac:"00:00:00:00:00:00",
        channel:"A4",
        query:"{A4=?}",
        type:"603"
    },
    fire:{
        mac:"00:00:00:00:00:00",
        channel:"A3",
        query:"{A3=?}",
        type:"603"
    },
    fence:{
        mac:"00:00:00:00:00:00",
        channel:"A5",
        query:"{A5=?}",
        type:"603"
    },
    vibration:{
        mac:"00:00:00:00:00:00",
        channel:"A1",
        query:"{A1=?}",
        type:"603"
    },
    body:{
        mac:"00:00:00:00:00:00",
        channel:"A0",
        query:"{A0=?}",
        type:"603"
    },
    holzer:{
        mac:"00:00:00:00:00:00",
        channel:"A2",
        query:"{A2=?}",
        type:"603"
    },
    lcd:{
        mac:"00:00:00:00:00:00",
        channel:"D1",
        cmd:"{V1=?}",
        type:"604"
    },
    led:{
        mac:"00:00:00:00:00:00",
        channel:"D1",
        cmd:"{V2=?}",
        type:"604"
    },
    rfid:{
        mac:"00:00:00:00:00:00",
        channel:"A0",
        query:"{A0=?}",
        type:"605"
    },
    lock:{
        mac:"00:00:00:00:00:00",
        channel:"D1",
        cmd_open:"{OD1=64,D1=?}",
        cmd_close:"{CD1=64,D1=?}",
        mask:0x40,
        type:"605"
    },
    etc:{
        mac:"00:00:00:00:00:00",
        channel:"D1",
        cmd_open:"{OD1=1,D1=?}",
        cmd_close:"{CD1=1,D1=?}",
        type:"606"
    }
};
var typeArr = ["601", "602", "603", "604", "605", "606"];