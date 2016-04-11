(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name  app.tabs:TabsCtrl
   * @description
   */
  angular.module('app.tabs')
    .controller('TabsCtrl', TabsCtrl);

  /* @ngInject */
  function TabsCtrl($state, $rootScope, $ionicSlideBoxDelegate) {

    var vm = this;

    vm.currentIndex = $state.params && $state.params.tabIndex ? parseInt($state.params.tabIndex, 10) : 0;

    vm.slideHasChanged = slideHasChanged;
    vm.setTabIndex = setTabIndex;

    _init();

    return vm;

    function _init() {
      _updateSlide();
      setTabIndex(vm.currentIndex);
      $rootScope.$on('$ionicView.enter', _updateSlide);
    }

    function _updateSlide(evt, value) {
      if (!value || value.stateName === 'tabs') {
        slideHasChanged(vm.currentIndex);
      }
    }

    function setTabIndex(index) {
      $ionicSlideBoxDelegate.slide(index);
    }

    function slideHasChanged(index) {
      vm.currentIndex = index !== undefined ? index : vm.currentIndex;
      $rootScope.$broadcast('tabs:change', vm.currentIndex);
    }

  }

})();
