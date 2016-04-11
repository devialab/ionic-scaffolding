(function() {
  'use strict';

  /**
   * @ngdoc function
   * @name app.ui
   * @description ui module
   */
  angular.module('app.ui', []).config(configUi);

  /* @ngInject */
  function configUi($ionicConfigProvider){
    $ionicConfigProvider.backButton.text('');
    $ionicConfigProvider.backButton.previousTitleText(false);
  }

})();
