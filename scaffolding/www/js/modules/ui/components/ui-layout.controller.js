(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name  app.ui:UILayoutCtrl
   * @description
   */
  angular.module('app.ui')
    .controller('UILayoutCtrl', UILayoutCtrl);

  /* @ngInject */
  function UILayoutCtrl($window, $state, $timeout, _, $rootScope, $scope, usersService, goNativeService) {

    var vm = this;

    vm.goToState = goToState;

    vm.profileImage = '';
    vm.backTransition = 'left';

    vm.logout = logout;

    _init();

    return vm;

    function _init() {
      // _updateUser();
      // _addEventListener();
    }

    function goToState(state, params) {
      $state.go(state, params);
    }

    function logout() {
      return usersService.logout().then(function() {
        $state.go('login');
      }).catch(function() {
        $state.go('login');
      });
    }


    function _addEventListener() {
      $rootScope.$on('user:change', _updateUser);
      $rootScope.$on('go-native:start', _setBackTransition);
    }

    function _updateUser(evt, value) {
      var user = usersService.getMe(true).then(function(user) {
        if (user.images) {
          var images = user.images.filter(function(image) {
            return image.is_profile_img === "1";
          });
          if (images.length) {
            vm.profileImage = images[0].image_url;
          }
        }
        vm.userName = user.name;
        vm.user_id = user.user_id;
      });
    }

    function _setBackTransition(evt, params) {
      console.log(params.direction);
      vm.backTransition = goNativeService.getReversalDirection(params.direction);
      console.log(vm.backTransition);
    }

  }

})();
