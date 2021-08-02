var honeySwitch = {};
honeySwitch.themeColor = "rgb(100, 189, 99)";
honeySwitch.init = function() {
    var s = "<span class='slider'></span>";
    $("span[class^=switch]").append(s);
    $("span[class^=switch]").click(function() {
        var id = $(this).attr('id');
        if ($(this).hasClass("switch-disabled")) {
            return;
        }
        if ($(this).hasClass("switch-on")) {
            click_btn(id, 'close');
            $(this).removeClass("switch-on").addClass("switch-off");
            $(".switch-off").css({
                'border-color': '#dfdfdf',
                'box-shadow': 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
                'background-color': 'rgb(255, 255, 255)'
            });
        } else {
            click_btn(id, 'open');
            $(this).removeClass("switch-off").addClass("switch-on");
            if (honeySwitch.themeColor) {
                var c = honeySwitch.themeColor;
                $(this).css({
                    'border-color': c,
                    'box-shadow': c + ' 0px 0px 0px 16px inset',
                    'background-color': c
                });
            }
            if ($(this).attr('themeColor')) {
                var c2 = $(this).attr('themeColor');
                $(this).css({
                    'border-color': c2,
                    'box-shadow': c2 + ' 0px 0px 0px 16px inset',
                    'background-color': c2
                });
            }
        }
    });
    window.switchEvent = function(ele, on, off) {
        $(ele).click(function() {
            if ($(this).hasClass("switch-disabled")) {
                return;
            }
            if ($(this).hasClass('switch-on')) {
                if (typeof on == 'function') {
                    on();
                }
            } else {
                if (typeof off == 'function') {
                    off();
                }
            }
        });
    }
    if (this.themeColor) {
        var c = this.themeColor;
        $(".switch-on").css({
            'border-color': c,
            'box-shadow': c + ' 0px 0px 0px 16px inset',
            'background-color': c
        });
        $(".switch-off").css({
            'border-color': '#dfdfdf',
            'box-shadow': 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
            'background-color': 'rgb(255, 255, 255)'
        });
    }
    if ($('[themeColor]').length > 0) {
        $('[themeColor]').each(function() {
            var c = $(this).attr('themeColor') || honeySwitch.themeColor;
            if ($(this).hasClass("switch-on")) {
                $(this).css({
                    'border-color': c,
                    'box-shadow': c + ' 0px 0px 0px 16px inset',
                    'background-color': c
                });
            } else {
                $(".switch-off").css({
                    'border-color': '#dfdfdf',
                    'box-shadow': 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
                    'background-color': 'rgb(255, 255, 255)'
                });
            }
        });
    }
};
honeySwitch.showOn = function(ele) {
    $(ele).removeClass("switch-off").addClass("switch-on");
    if (honeySwitch.themeColor) {
        var c = honeySwitch.themeColor;
        $(ele).css({
            'border-color': c,
            'box-shadow': c + ' 0px 0px 0px 16px inset',
            'background-color': c
        });
    }
    if ($(ele).attr('themeColor')) {
        var c2 = $(ele).attr('themeColor');
        $(ele).css({
            'border-color': c2,
            'box-shadow': c2 + ' 0px 0px 0px 16px inset',
            'background-color': c2
        });
    }
}
honeySwitch.showOff = function(ele) {
    $(ele).removeClass("switch-on").addClass("switch-off");
    $(".switch-off").css({
        'border-color': '#dfdfdf',
        'box-shadow': 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
        'background-color': 'rgb(255, 255, 255)'
    });
}
$(function() {
    honeySwitch.init();
});