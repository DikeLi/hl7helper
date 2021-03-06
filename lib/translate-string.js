'use strict';
/**
 * 逆向工程
 * LINESYMBOL(换行符)
 * PIPE(字段分隔符)
 * HAT(组件分隔符)
 * SEGMENTREPEAT(字段重复分隔符)
 * ESC(转义字符)
 * SUBCOMPONENT(子组件分隔符)
 */
var LINESYMBOL = '\r';
var PIPE = '|';
var HAT = '^';
var SEGMENTREPEAT = '~';
var ESC = '\\';
var SUBCOMPONENT = '&';

/**
 * 将HL7对象转换为HL7格式字符串
 * 
 * @param pipe
 * @returns String
 */
function parseString(data) {
    var result = '';

    if (!data && typeof (data) !== "Array") {
        return null;
    } else {
        if (data[0][0] === 'MSH') {
            //设置默认值
            PIPE = data[0][1];
            HAT = data[0][2][0];
            SEGMENTREPEAT = data[0][2][1];
            ESC = data[0][2][2];
            SUBCOMPONENT = data[0][2][3];
        }
        result = parseLine(data);
    }
    return result;
}

function parseLine(data) {
    var result = '';
    data.forEach(function (lineObj) {
        var lines = parsePipe(lineObj);
        result += (lines + '\n');
    });
    return result;
}

function parsePipe(lineObj) {
    var result = '';
    if (lineObj[0] === 'MSH')
        lineObj.splice(1, 1)
    lineObj.forEach(function (pipe) {
        pipe = parseSegmentRepeat(pipe);
        pipe += PIPE;
        result += pipe;
    });
    result = result.substring(0, result.length - 1);
    return result;
}

function parseSegmentRepeat(pipe) {
    var result = '';
    if (typeof (pipe) !== "object") {
        return pipe;
    } else {
        var len = pipe.length;
        var js = len - 1;
        for (var i = 0; i < len; i++) {
            var segment = parseHat(pipe[i]);
            if (i !== js)
                segment += SEGMENTREPEAT;
            result += segment;
        }
        return result;
    }
}

function parseHat(segment) {
    var result = '';
    if (typeof (segment) !== "object") {
        return segment;
    } else {
        var len = segment.length;
        var js = len - 1;
        for (var i = 0; i < len; i++) {
            var hat = parseSubcomponent(segment[i]);
            if (i !== js)
                hat += HAT;
            result += hat;
        }
        return result;
    }
}

function parseSubcomponent(hat) {
    var result = '';
    if (typeof (hat) !== "object") {
        return hat;
    } else {
        var len = hat.length;
        var js = len - 1;
        for (var i = 0; i < len; i++) {
            var subcomponent = hat[i];
            if(i !== js)
                subcomponent += SUBCOMPONENT;
            result += subcomponent;
        }
        return result;
    }
}

module.exports = {
    parseString: parseString
};
