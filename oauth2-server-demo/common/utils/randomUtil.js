exports.getRandom = function(source, num) {
    let str = '';
    let length = source.length;
    for(var i = 0;i < num;i++) {
        str += source[Math.floor(Math.random() * length)];
    }
    return str;
}

exports.getRandomStr = function(num) {
    return exports.getRandom('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', num);
}

exports.getRandomInt = function(num) {
    return exports.getRandom('0123456789', num);
}

exports.getRandomStr2 = function(num) {
    let tempString = '';
    for (var i = 0; i < num; i++) tempString += Math.floor(Math.random() * 36).toString(36);
    return tempString;
}
