(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name  app.login:LoginCtrl
   * @description
   * # LoginCtrl
   * A module to manage login form
   */
  angular.module('app.login')
    .controller('LoginCtrl', LoginCtrl);

  /* @ngInject */
  function LoginCtrl($log, $scope, $rootScope, $state, $ionicLoading, $translate, usersService, config, $analytics) {

    var vm = this;
    vm.error = '';
    vm.login = login;


    return vm;

    function login(username, password) {
      $ionicLoading.show();
      vm.error = '';
      return usersService.login(username, password, true).then(function() {
        $ionicLoading.hide();

        $analytics.eventTrack('login');

        $state.go(config.get('defaultState'));

      }).catch(function(error) {
        if (error.status === 404) {
          $state.go('tabs');
        } else {
          $translate('login.form.error.generic').then(function(translation) {
            vm.error = translation;
            $scope.$digest();
          });
          $log.error('Failed to authenticate user', error);
          //retrigger error
          throw error;
          //@todo: feedback to user
        }
        $ionicLoading.hide();
      });

    }

  }

})();
