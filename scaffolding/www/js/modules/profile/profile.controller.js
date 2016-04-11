(function() {
  'use strict';

  angular
    .module('app.profile')
    .controller('ProfileCtrl', ProfileCtrl);

  /* @ngInject */
  function ProfileCtrl(
    $rootScope,
    $log,
    $scope,
    $timeout,
    $state,
    $ionicLoading,
    defaultLang,
    usersService
  ) {

    var vm = this;

    vm.user = {};
    vm.password = {};

    vm.updateAccount = updateAccount;
    vm.changePassword = changePassword;

    _init();

    return vm;


    function _init() {

      // _addEventListeners();

      // @todo: improve this

      return _loadMe().then(function() {
        $scope.$digest();
      });
    }

    function _addEventListeners() {
      $scope.$watch('vm.email', function(newValue) {
        usersService.isEmailAvailable(newValue).catch(function() {
          vm.error = 'conflict';
        });
      });
    }

    function _loadMe() {
      return usersService.getMe().then(function(user) {
        vm.user = user;
      });
    }

    function updateAccount() {
      $ionicLoading.show();
      return usersService.update({
        username: vm.user.email,
        email: vm.user.email,
        firstName: vm.user.firstName,
        lastName: vm.user.lastName,
        properties: {
          birthdate: vm.user.birthdate,
          phone: vm.user.phone,
          lang: vm.user.lang
        }
      }).then(function() {
        $ionicLoading.hide();
      }).catch(_submitErrorHandler);
    }

    function changePassword() {
      $ionicLoading.show();
      return usersService.confirm(vm.password.current).then(function() {

        return usersService.update({
          password: vm.password.new
        });

      }).then(function() {
        $ionicLoading.hide();
      }).catch(_submitErrorHandler);
    }

    function _submitErrorHandler(response) {
      vm.error = response.data.error;
      $scope.$digest();
      $ionicLoading.hide();
    }

  }

})();
