// CryptoService.js
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = sails.config.cryptoPassword;


module.exports = {
    encrypt: function (text, additionalKey) {
        var cipher = crypto.createCipher(algorithm, password + (additionalKey || ''))
        var crypted = cipher.update(text,'utf8','hex')
        crypted += cipher.final('hex');
        return crypted;
    },
    decrypt: function (text, additionalKey) {
        var decipher = crypto.createDecipher(algorithm, password + (additionalKey || ''))
        var dec = decipher.update(text,'hex','utf8')
        dec += decipher.final('utf8');
        return dec;
    },
};