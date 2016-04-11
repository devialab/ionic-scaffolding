(function() {
  'use strict';


  angular
    .module('app')
    .factory('ionicReady', ionicReady);

  /* @ngInject */
  function ionicReady($ionicPlatform) {
    var readyPromise;

    return function() {
      if (!readyPromise) {
        readyPromise = $ionicPlatform.ready();
      }
      return readyPromise;
    };
  }

})();
