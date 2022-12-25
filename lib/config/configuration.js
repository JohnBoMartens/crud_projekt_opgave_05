const configuration = {};

configuration.serverPath = 'http://localhost:3000/'
configuration.serverUsersPath = configuration.serverPath + '/users/';
configuration.serverCookieExpire = 1800;
configuration.secretKey = 'MY-SECRET-KEY-STRING';
configuration.port = 3000;

module.exports = configuration;