
// 默认配置
var defaultSetting = {
    setting: {
        table: {
            row: 10,
            col: 15,
            tr: {
                height: 25
            },
            td: {
                width: 100
            },
            coordinateBarHorizontal: 25,
            coordinateBarVertical: 60
        }
    }
}

$(function() {
    $.fn.extend({
        initPrintTool: function (options) {
            // 合并默认配置
            var op = $.extend(true, {}, defaultSetting, options)

            return this.each(function() {
                var printTool = $(this)
                // 清空容器
                printTool.empty()
                printTool.addClass('print-tool')
                if (op.data) {
                    
                } else {
                    initToolbar(printTool, op.setting)
                    initTable(printTool, op.setting)
                }
            })
        }
    })
})

function initToolbar(el, setting) {
    var toolbar
    toolbar = $(`<div></div>`).addClass('toolbar').appendTo(el)
    initSelectTdInput(toolbar)
}

function initSelectTdInput(el) {
    var selectTdInput
    selectTdInput = $(
        `<div class="selectTdInput" >
            <input type="text" id="selectTdInput" />
        </div>`
    ).appendTo(el)
}

// 初始化 table
function initTable(el, setting) {
    var table
    table = $(`<table></table>`).appendTo(el)
    for (var i = 0; i < setting.table.row; i++) {
        var tr = $(`<tr></tr>`).height(setting.table.tr.height).appendTo(table)
        for (var j = 0; j < setting.table.col; j++) {
            $(`<td></td>`).width(setting.table.td.width).appendTo(tr)
        }
    }
    setTableHeader(table, setting)
    eventBind(table, el);
}

// table 绑定事件
function eventBind(table, el) {
    table.mousedown(function(e) {
        // 鼠标右键按下
        if (e.button == 0) {
            table.find("td").removeClass('selectTd')
            // 不是坐标栏
            if (!$(e.target).hasClass("coordinate-bar-td")) {
                tdMousedown(e.target, table)
                settingInput(e.target)
                // triggerStyle(e.target, table)
            }
            mouseMove(table, el)
        }
    })
}

function mouseMove(table, el) {
    table.mouseover(function (e) {
        table.find("td").removeClass("td-chosen-muli-css")
        table.find("td").removeClass("td-chosen-css")
        selectTable(table, el, e)
    })
}

function selectTable(table, el, e) {
    var ele = $(e.target);
    console.log(ele);
    if (!ele.hasClass("coordinate-bar-td")) {
        clearPositionCss(table)
        if (!ele.is("table") && table.data("beg-td-ele") && table.data("beg-td-ele").is(ele)) {
            ele.addClass("td-chosen-css");
            var posi = getTdPosition(ele);
            table.find("tr").find("td:eq(" + posi.col + ")").addClass("td-position-css");
            table.find("tr:eq(" + posi.row + ")").find("td").addClass("td-position-css")
        } else {
            getChosenList(table, getTdPosition(table.data("beg-td-ele")), getTdPosition(ele))
        }
        drawChosenArea(table, t)
    }
}

function clearPositionCss(table) {
    table.find("td").removeClass("td-position-css")
}


// 点击td 设置样式栏中各项的值
function triggerStyle(e, table) {
    $('.sub-bottom').children().removeClass('buttonBgColor');
    let ele = $(e);
    let fontFamily = ele.css('font-family');
    $('#fontfamily').val(fontFamily);

    let fontSize = ele.css('font-size');
    $('#fontsize').val(fontSize);

    let fontWeight = ele.css('font-weight');
    if (fontWeight !== '400') {
        $('.btn-bold').addClass('buttonBgColor');
    }

    let fontItalic = ele.css('font-style');
    if (fontItalic !== 'normal') {
        $('.btn-italic').addClass('buttonBgColor');
    }

    let underline = ele.css('text-decoration-line');
    if (underline === 'underline') {
        $('.btn-underline').addClass('buttonBgColor');
    }

    let fontStrike = ele.css('text-decoration-line');
    if (fontStrike === 'line-through') {
        $('.btn-strike').addClass('buttonBgColor');
    }

    let valign = ele.css('vertical-align');
    $('.btn-av').removeClass('buttonBgColor');
    if (valign === 'top') {
        $('.btn-htTop').addClass('buttonBgColor');
    } else if (valign === 'middle') {
        $('.btn-htMiddle').addClass('buttonBgColor');
    } else if (valign === 'bottom') {
        $('.btn-htBottom').addClass('buttonBgColor');
    }

    let textAlign = ele.css('text-align');
    $('.btn-ah').removeClass('buttonBgColor');
    if (textAlign === 'left') {
        $('.btn-htLeft').addClass('buttonBgColor');
    } else if (textAlign === 'center') {
        $('.btn-htCenter').addClass('buttonBgColor');
    } else if (textAlign === 'right') {
        $('.btn-htRight').addClass('buttonBgColor');
    }

    let whiteSpace = ele.css('whiteSpace');
    if (whiteSpace !== 'nowrap') {
        $('.whiteSpace').addClass('buttonBgColor');
    } else {
        $('.whiteSpace').removeClass('buttonBgColor');
    }
}

//设置点击td时   赋值文本框的事件
function settingInput(e) {
    let pos = getTdPosition($(e))
    // 选中的td坐标 赋值给 table 的第一个td
    $(e).closest("table") .find("tr").first().find("td").first().html('<span>' + getChar(pos.col - 1) + pos.row + "</span>")
    setSelectTdValue(e)
}

// 赋值文本框   改变之后赋值到td内
function setSelectTdValue(e) {
    let val = $(e).html()
    let $input = $('#selectTdInput')
    $input.val(val)
    setTimeout(function () {
        $input.select();
    }, 10);
}

// 获取选中td位置
function getTdPosition(td) {
    if (td != undefined && td.length == 1) {
        var pos = {}
        var table = td.closest("table")  
        var tr = td.closest("tr")
        pos.row = table.find("tr").index(tr)
        pos.col = tr.find("td").index(td)
        return pos
    }
}

// 选中td
function tdMousedown(e, table) {
    selectTd = $(e);
    table.find("td").removeClass("td-chosen-css");
    table.removeData("beg-td-ele");
    table.data("beg-td-ele", $(e));
    $(e).addClass('selectTd');
    $(e).attr('id', 'selectTdValue');
}

// 设置表头
function setTableHeader(table, setting) {
    console.log(table.find("tr").find("td:eq(0)"));
    var index = 0;
    table.find("tr").first().height(setting.table.coordinateBarHorizontal)
    // 匹配第一行除了第一个单元格
    table.find("tr").first().find("td:gt(0)").each(function () {
        var char = getChar(index);
        $(this).addClass("coordinate-bar-td coordinate-bar-td-horizontal ").css("text-align", "center").html(char);
        index++
    });
    index = 0;
    // 匹配所有行的第一个单元格
    table.find("tr").find("td:eq(0)").each(function () {
        $(this).width(setting.table.coordinateBarVertical).addClass("coordinate-bar-td coordinate-bar-td-vertical").css("text-align", "center").html(index === 0 ? "" : index);
        index++
    });
}

// 纵向坐标生成
function getChar(index) {
    var char = String.fromCharCode(65 + index);
    if (index >= 26) {
        char = String.fromCharCode(65 + (parseInt(index / 26) - 1)) + String.fromCharCode(65 + index % 26)
    }
    return char;
}