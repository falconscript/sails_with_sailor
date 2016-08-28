var fs = require('fs');

module.exports = {
  view_login_page: function(req, res) {
    return res.view("view_login_page");
  },
  // Registration
  create_user: function (req, res) {

    if (req.session.user && !req.session.user.fakeaccount) {
        return res.json({error: "Already logged in as: " + req.session.user.UserName});
    }

    // Another style:
    /*Users.validate(req.allParams(), function(err) {
        if(err) return res.send(JSON.stringify(err));
        Users.create(req.allParams()).exec(function(err, user) {
             // is ok
        });*/

    Users.create(req.allParams()).exec(function(err, user) {
        if (err) {
            return res.json(JSON.stringify(err));
        }

        // Delegate to transferring temp data
        this.transferUserTempData(req, res, user, function() {
            // Creation successful, now login
            req.session.user = user;

            // Return approved status. The UI will redirect to /register_complete
            return res.json({status: "ok"});
        });
    }.bind(this));

  },

  // Route login / logout
  login_or_out_action: function (req, res) {

    if (!req.session.user) {
        this.login(req.param('login'), req.param('password'), function(user) {
            if (user) {
                req.session.user = user;
                res.clearCookie('pcid');
                if(req.cookies.pcid) delete req.cookies.pcid;
                if(req.param('stayloggedin')) {
                    res.cookie('stayloggedin',
                         req.session.user.UserName +
                         "++++" +
                         CryptoService.encrypt(req.session.user.Password)
                    );
                }
                return res.send("SUCCESSFUL_LOGIN");
            } else {
                return res.send("FAILED_LOGIN");
            }
        });
    } else {
        return this.logout(req, res);
    }
  },

  // not publicly routable
  login: function(username, password, callback) {
    Users.findOne({UserName: username, Password: password})
    .exec(function (err, user) {
      if (err) sails.log.info(err);

      // user could be empty
      callback(user);
    });
  },

  // not publicly routable
  logout: function(req, res) {
      req.session.destroy(); // clear session
      res.clearCookie('pcid');
      if (req.cookies.pcid) delete req.cookies.pcid;
      return res.redirect("/");
  },

  check_unique_username: function (req, res) {
    Users.findOne({UserName: req.param('username')})
    .exec(function (err, user) {
       return res.send( (user) ? '1' : '0' );
    });
  },

  view_profile: function (req, res) {

    if (!req.session.user) {
        // could allow viewing other peoples' profiles...?
        return res.redirect("/");
    }
    return res.view("view_profile", {});
  },
  view_registration_form: function (req, res) {
    if (req.session.user && !req.session.user.fakeaccount) {
        return res.redirect("/");
    } else {
        return res.view('registration_form');
    }
  },
};
