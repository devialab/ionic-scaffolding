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
    'angular-corbel',

    // Cross module dependencies
    'app.defaultLang',
    'app.config'
  ]);

})();
