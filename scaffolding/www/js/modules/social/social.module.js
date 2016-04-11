(function() {
  'use strict';

  angular.module('app.social', ['ngOpenFB']).run(function(ngFB, config) {
    ngFB.init({appId: config.get('facebook.appId')});
  });

})();
