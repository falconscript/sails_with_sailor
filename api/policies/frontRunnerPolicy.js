/**
 * frontRunnerPolicy
 *
 * @module      :: Policy
 * @description :: Runs before every single page load (controller calls)

 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
var fs = require('fs');
var sha1 = require('sha1');
var uuid = require('node-uuid');


module.exports = function(req, res, next) {
  var pageView = JSON.stringify({
      'type': req.method,
      'url': req.url,
      'clientIp': req.ip,
      'time': new Date().toString(),
      'referer': req.headers['referer'],
      'host': req.host,
  });

  // Log this request to file (a+ append + create if not exist)
  fs.writeFileSync('sails.log', pageView + '\n', {flag: "a+"})

  // handle log back in for users who had checked box "stayloggedin"
  if (!req.session.user && req.cookies.stayloggedin) {
      var c = req.cookies.stayloggedin.split('++++');
      var username = c[0];
      var password = CryptoService.decrypt(c[1]);

      // Do login
      sails.controllers.user.login(username, password, function (user) {
          req.session.user = user; // will delete fakeaccount keys
          res.clearCookie('pcid');
          if (req.cookies.pcid) delete req.cookies.pcid;
      });
  }

  return next(); // continue sails propagation

};
