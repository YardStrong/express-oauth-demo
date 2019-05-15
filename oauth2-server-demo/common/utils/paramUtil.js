/** 参数过滤判断方法 **/

/**
 * 判断参数是否为null或者空字符串
 * @Param {string} param 参数
 * @Return {bool} 返回判断结果
 **/
module.exports.isNullOrEmpty = function(param) {
    if(param) return false;
    return true;
}

/**
 * 简单判断参数是否合法
 * @Param {string} param 参数
 * @Return {bool} 返回判断结果
 **/
module.exports.isValid = function(param) {
    if(!param) return false;
    if(typeof(param) == 'string' && param.length > 40) return false;
    // 不接收对象和数组类型！！！！
    if(typeof(param) == 'object') return false;
    return true;
}

/**
 * 判断uri
 * @Param {string} param 参数
 * @Return {bool} 返回判断结果
 **/
module.exports.isURI = function(param) {
    if(!param) return false;
    if(param.match(/^(http|https):\/\/[0-9a-z:.]+[0-9a-zA-Z\/]+$/)) return true;
    return false;
}

/**
 * 判断数字
 * @Param {string} param 参数
 * @Return {bool} 返回判断结果
 **/
module.exports.isNumberString = function(param) {
    if(!param) return false;
    if(param.match(/^\d+$/)) return true;
    return false;
}

/**
 * 判断mail
 * @Param {string} param 参数
 * @Return {bool} 返回判断结果
 **/
module.exports.isEmail = function(param) {
    if(!param) return false;
    if(param.match(/^[a-z0-9]{1,11}@[a-z0-9]{1,11}.[a-z0-9]{1,11}$/)) return true;
    return false;
}

/**字符串转日期
 * @Param {string} dateString 字符串类型日期`YYYY-MM-DD`或`YYYY-MM-DD hh:mm:ss`
 * @Return {date} 返回日期对象或null
 **/
module.exports.toDate = function(dateString) {
    if(!dateString) return null;
    if(dateString.match(/^\d{4}-\d{2}-\d{2}$/) || dateString.match(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)) {
        return new Date((dateString).replace(/-/g,"/"));
    }
    return null;
}
