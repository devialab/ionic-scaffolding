(function() {
  'use strict';
  // Ionic App

  // angular.module is a global place for creating, registering and retrieving Angular modules
  // 'app' is the name of this angular module example (also set in a <body> attribute in index.html)
  // the 2nd parameter is an array of 'requires'
  // 'app.controllers' is found in controllers.js
  angular.module('app', [
    'app.core',

    'app.about',
    'app.login',
    'app.profile',
    'app.tabs',
    'app.social',
    'app.ui',
    'app.utils'
  ])

  .run(function($rootScope, $ionicPlatform, $state, ionicReady, goNativeService, $cordovaStatusbar, config, corbelDriver, usersService, $log) {

    /**
     * IONIC
     */
    ionicReady().then(function() {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        window.StatusBar.styleDefault();
        // from _variables.scss $calm or $primary
        $cordovaStatusbar.styleHex(config.get('brand.primary'));
      }

    });

    $ionicPlatform.registerBackButtonAction(function(event) {
      event.preventDefault();
      event.stopPropagation();

      if ($state.current.name === 'tabs' || $state.current.name === 'login') {
        navigator.app.exitApp();
      } else {
        navigator.app.backHistory();
      }

      window.plugins.nativepagetransitions.slide({
          'direction': goNativeService.getNextDirection()
        },
        function(msg) {
          console.log('success: ' + msg);
        }, // called when the animation has finished
        function(msg) {
          alert('error: ' + msg);
        } // called in case you pass in weird values
      );

      return false;
    }, 110);


    /**
     * CORBEL
     */
    corbelDriver.on('token:refresh', function(token) {
      $log.debug('app.module:token:refresh');
      usersService.setToken(token);
    });

    usersService.isLogged().catch(function() {
      return corbelDriver.iam.token().create();
    });

    corbelDriver.on('service:request:after', function(response) {

      switch (response.status) {
        case 401:
          $state.go('login');
          break;
        case 0:
          $rootScope.$broadcast('server:disconnect');
          $log.warn('server:disconnect');
          break;
      }

    });


    /**
     * GOOGLE ANALYTICS
     */
    /* jshint ignore:start */
    (function(i, s, o, g, r, a, m) {
      i['GoogleAnalyticsObject'] = r;
      i[r] = i[r] || function() {
        (i[r].q = i[r].q || []).push(arguments)
      }, i[r].l = 1 * new Date();
      a = s.createElement(o),
        m = s.getElementsByTagName(o)[0];
      a.async = 1;
      a.src = g;
      m.parentNode.insertBefore(a, m)
    })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');
    ga('create', config.get('googleAnalyticsCode'), 'auto');
    /* jshint ignore:end */

  }).config(function($logProvider, $compileProvider, $ionicConfigProvider, $sceDelegateProvider, $sanitizeProvider, corbelDriverProvider, configProvider) {

    /**
     * ANGULAR-CORBEL
     */
    corbelDriverProvider.setConfig({
      urlBase: configProvider.get('corbel.urlBase'),
      clientId: configProvider.get('corbel.clientId'),
      clientSecret: configProvider.get('corbel.clientSecret'),
      domain: configProvider.get('corbel.domain'),
      resourcesEndpoint: configProvider.get('resourcesEndpoint'),
      iamEndpoint: configProvider.get('iamEndpoint'),
      scopes: configProvider.get('corbel.scopes'),
      audience: configProvider.get('corbel.audience')
    });

    // due breaking change introduced in 1.4 -> 1.5
    // https://docs.angularjs.org/guide/migration#migrating-from-1-4-to-1-5
    $sanitizeProvider.enableSvg(true);

    $ionicConfigProvider.views.transition('none');

    $logProvider.debugEnabled(!configProvider.get('production'));
    $compileProvider.debugInfoEnabled(!configProvider.get('production'));

    if (ionic.Platform.isAndroid()) {
      $ionicConfigProvider.scrolling.jsScrolling(true);
    }

    $sceDelegateProvider.resourceUrlWhitelist([
      // Allow same origin resource loads.
      'self',
      // Allow loading from our assets domain.  Notice the difference between * and **.
      // 'http://*.eu-west-1.compute.amazonaws.com/api/**'
    ]);

  });

})();
