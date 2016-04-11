(function() {
  'use strict';

  /**
   * app.usersService Module
   *
   * usersService utils
   */
  angular.module('app').factory('usersService', usersService);

  /* @ngInject */
  function usersService($rootScope, $localStorage, corbelDriver, facebook) {

    // persistent by default
    var storage = $localStorage;

    var services = {
      login: login,
      // loginOauth: loginOauth,
      logout: logout,
      signup: signup,
      isLogged: isLogged,
      isLoggedSync: isLoggedSync,
      getMe: getMe,
      getMeOauth: getMeOauth,
      setToken: setToken,
      update: update
    };

    var imageUrl = '/users_pics/';

    var oauthProviders = {
      facebook: {
        login: _facebookLogin
      },
      google: {
        login: _googleLogin
      }
    };

    return services;


    function login(email, accessToken, oauthProvider) {
      // Let other modules to manage Storage
      $rootScope.$broadcast('login:before');

      _resetAll();

      if (persistent) {
        storage = $localStorage;
      }
      return corbelDriver.iam.token().create({
        claims: {
          'basic_auth.username': username,
          'basic_auth.password': password,
          scope: config.get('corbel.userScopes')
        }
      }).then(function(response) {
        storage.token = response.data;
        return getMe(true);
      }).then(function(user) {
        $rootScope.$broadcast('login', user);
        return user;
      });    
    }

    // function loginOauth(oauthProvider) {
    //   storage.oauthProvider = oauthProvider;
    //   return oauthProviders[oauthProvider].login();
    // }


    function _regenerateToken() {
      _resetAll();
      return corbelDriver.iam.token().create();
    }

    function logout() {
      $rootScope.$broadcast('logout');
      return corbelDriver.iam.user('me').signOut()
        .then(_regenerateToken)
        .catch(_regenerateToken);
    }

    function signup(email, password) {
      return corbelDriver.iam.users().create({
        firstName: '',
        lastName: '',
        email: email,
        username: email,
        password: password
      });
    }

    /**
     * Returns whenever user is logged in or not
     * Checks if there is a persisted session and config corbelDriver with it
     * @param  {boolean}  force Forces backend request check
     * @return {Promise}        A promise that resolves if the user is logged. Otherwise, rejects
     */
    function isLogged(force) {
      if ($localStorage.token) {
        storage = $localStorage;
      }
      if (storage.token) {
        corbelDriver.config.set(corbel.Iam.IAM_TOKEN, storage.token);
      }

      return getMe(force);
    }

    /**
     * Returns whenever user is logged in or not
     * @return {Boolean} true if the user is logged. Otherwise, false
     */
    function isLoggedSync() {
      if ($localStorage.token) {
        storage = $localStorage;
      }
      if (storage.token) {
        corbelDriver.config.set(corbel.Iam.IAM_TOKEN, storage.token);
      }

      return storage.user;
    }

    function getMe(force) {
      if (force) {
        return corbelDriver.iam.user('me').get().then(function(response) {
          storage.user = response.data;
          return response.data;
        });
      } else {
        return storage.user ? Promise.resolve(storage.user) : Promise.reject();
      }
    }


    function getMeOauth() {
      // @todo: implement force behavior
      var oauthProvider = storage.oauthProvider;
      if (storage[oauthProvider]) {
        return Promise.resolve(storage[oauthProvider].user);
      } else {
        return Promise.reject('undefined:' + oauthProvider + ':oauthUser', 'Try to login with oauthProvider before this operation');
      }
    }

    /**
     * Sets the token object value
     * @param {object} token
     * @param {string} token.accessToken
     * @param {number} token.expiresAt
     * @param {string} token.refreshToken
     */
    function setToken(token) {
      if ($localStorage.token) {
        storage = $localStorage;
      }
      storage.token = token;
    }

    /**
     * Updates user info
     * @param  {Object} user
     * @param  {string} user.email
     * @param  {string} user.username
     * @param  {string} user.password
     * @param  {string} user.firstName
     * @param  {string} user.lastName
     * @param  {Object} user.properties
     * @return {Promise}
     */
    function update(user) {
      return corbelDriver.iam.user('me').update(user).then(function() {
        user = _.omit(user, 'password');
        angular.merge(storage.user, user);
        $rootScope.$broadcast('user:change', storage.user);
      });
    }

    function _facebookLogin() {
      return facebook.login().then(function(oauthUser) {
        oauthUser.oauthProvider = 'facebook';
        // unify oauthUser format
        oauthUser.oauthId = oauthUser.id;
        oauthUser.birthdate = oauthUser.birthday.split('/').reverse().join('/');
        storage['facebook'] = storage['facebook'] || {};
        storage['facebook'].user = oauthUser;
        return oauthUser;
      });
    }

    // @todo
    function _googleLogin() {
      return Promise.reject({
        error: 'not:implemented'
      });
    }

  }

})();
