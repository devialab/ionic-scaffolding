(function() {
  'use strict';

  /**
   * app.usersService Module
   *
   * usersService utils
   */
  angular.module('app.social').factory('facebook', facebook);

  /* @ngInject */
  function facebook($window, ngFB, config) {

    var services = {
      login: login,
      userProfile: userProfile
    };

    return services;

    function fb() {
      return $window.facebookConnectPlugin;
    }


    function login() {
      return _isWeb() ? webLogin() : nativelogin();
    }

    function userProfile() {
      return _isWeb() ? webUserProfile() : nativeUserProfile();
    }

    function nativelogin() {
      return new Promise(function(resolve, reject) {
        fb().login(config.get('facebook.scopes'),
          function(response) {
            if (response.status === 'connected') {
              console.log('Facebook login succeeded', response);
              return nativeUserProfile().then(function(user) {
                var ret = angular.copy(user);
                ret.accessToken = response.authResponse.accessToken;
                resolve(ret);
              });
            } else {
              reject(response);
            }
          },
          function(error) {
            reject(error);
          });
      });
    }

    function nativeUserProfile() {
      return new Promise(function(resolve, reject) {
        fb().api('/me?fields=id,first_name,last_name,email,age_range,birthday,gender,hometown', ['email', 'public_profile', 'user_birthday'], resolve, reject);
      }).then(_asUser);
    }

    function _asUser(facebookProfile) {
      return {
        id: facebookProfile.id,
        /* jshint ignore:start */
        firstName: facebookProfile['first_name'],
        lastName: facebookProfile['last_name'],
        /* jshint ignore:end */
        email: facebookProfile.email,
        birthday: facebookProfile.birthday,
        gender: facebookProfile.gender
      };
    }

    function _isWeb() {
      return fb() === undefined;
    }

    function webLogin() {
      return ngFB.login({
        scope: config.get('facebook.scopes').join(',')
      }).then(
        function(response) {
          if (response.status === 'connected') {
            console.log('Facebook login succeeded', response);
            return webUserProfile().then(function(user) {
              var ret = angular.copy(user);
              ret.accessToken = response.authResponse.accessToken;
              return ret;
            });
          } else {
            alert('Facebook login failed');
            throw response;
          }
        });
    }

    function webUserProfile() {
      return ngFB.api({
          path: '/me',
          params: {
            fields: 'id,first_name,last_name,email,age_range,birthday,gender,hometown'
          }
        })
        .then(_asUser);
    }
  }


})();
