/**
 * HomeController -
 * This is really only here due to needing a policy function
 * to run before every single pageload. Because sailsjs will
 * not allow you to run policies if your route directly
 * sends you to a view, this controller exists.
 */

module.exports = {
  index: function (req, res) {
     return res.view("home");
  },
  termsAndContact: function (req, res) {
     return res.view("termsAndContact");
  },
};
