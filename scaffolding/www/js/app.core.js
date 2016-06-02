(function() {
  'use strict';

  angular.module('app.core', [
    // Angular modules
    'ionic',
    'ngCordova',

    'underscore',
    'ngStorage',
    'pascalprecht.translate',
    'ngSanitize',
    'angularMoment',
    'angulartics',
    'angulartics.google.analytics',
    'ionicLazyLoad',
    'ionic-native-transitions',
    'angular-corbel',

    // Cross module dependencies
    'app.config',
    'app.defaultLang',
    'app.templates'
  ]);

})();
