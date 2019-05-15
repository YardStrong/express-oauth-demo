const popsicle = require('popsicle');

exports.get = function(url, callback) {

}


exports.post = function(url, data, callback) {
    popsicle.request({
        method: 'POST',
        url: 'url',
        body: data
    })
    .use(popsicle.plugins.parse('json'))
    .then(function (res) {
        if(res.status == 200) { return callback(null, res.body); }
        callback(new Error(res.status), null);
    })

}
