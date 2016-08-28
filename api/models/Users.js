module.exports = {
  attributes: {

    // using a name 'personID' instead of default generated 'id'
    personID: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true,
      unique: true,
    },

    UserName: {
      type: 'string',
      required: true,
      unique: true,
      alphanumericdashed: true,
      maxLength: 25,
      minLength: 3,
    },

    Password: {
      type: 'string',
      required: true,
      maxLength: 50,
      minLength: 4,
    },
    EmailAddress: {
      type: 'email',
      required: true,
      unique: true,
      maxLength: 50,
      minLength: 7,
    },
    FirstName: {
      type: 'string',
      defaultsTo: '',
      maxLength: 25,
      minLength: 0,
      //alphanumericdashed: true,
    },
    LastName: {
      type: 'string',
      defaultsTo: '',
      maxLength: 25,
      minLength: 0,
      //alphanumericdashed: true,
    },
  }
};



/*
CREATE TABLE `users` (
  `personID` int(11) NOT NULL AUTO_INCREMENT,
  `UserName` varchar(25) NOT NULL,
  `Password` varchar(25) NOT NULL,
  `EmailAddress` varchar(50) NOT NULL,
  `FirstName` varchar(25) DEFAULT NULL,
  `LastName` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`personID`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1 AUTO_INCREMENT=531 ;
*/
