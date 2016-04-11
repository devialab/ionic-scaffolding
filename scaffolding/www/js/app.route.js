(function() {
  'use strict';

  angular
    .module('app')
    .config(appConfig)
    .run(appRun);


  /* @ngInject */
  function appConfig($stateProvider, $urlRouterProvider, CONFIG) {

    var base = 'js/modules/';

    $stateProvider.state('ui-layout', {
      templateUrl: base + 'ui/components/ui-layout.html',
      controller: 'UILayoutCtrl',
      controllerAs: 'vm',
      bindToController: true,
      abstract: true
    });

    $stateProvider.state('tabs', {
      parent: 'ui-layout',
      url: '/tabs/:tabIndex',
      templateUrl: base + 'tabs/tabs.html',
      controller: 'TabsCtrl',
      controllerAs: 'vm',
      bindToController: true,
      // optional path params: https://github.com/angular-ui/ui-router/issues/108
      params: {
        tabIndex: {
          value: null,
          squash: true
        }
      },
      data: {
        requireLogin: true
      }
    })

    .state('login', {
      url: '/login',
      templateUrl: base + 'login/login.html',
      controller: 'LoginCtrl',
      controllerAs: 'vm',
      bindToController: true
    })

    .state('profile', {
      parent: 'ui-layout',
      url: '/profile',
      templateUrl: base + 'profile/profile.html',
      controller: 'ProfileCtrl',
      controllerAs: 'vm',
      bindToController: true,
      data: {
        requireLogin: true
      }
    })


    .state('about', {
      parent: 'ui-layout',
      url: '/about',
      templateUrl: base + 'about/about.html',
      data: {
        requireLogin: false
      }
    });

    // $urlRouterProvider.otherwise('/login');
    $urlRouterProvider.otherwise(function($injector) {
      var usersService = $injector.get('usersService');
      return usersService.isLoggedSync() ? '/' + CONFIG.defaultState : '/login';
    });

  }

  /* @ngInject */
  function appRun($rootScope, $state, usersService) {

    $rootScope.$on('$stateChangeStart', function(event, toState) {
      toState.data = toState.data || {};
      var requireLogin = toState.data.requireLogin;

      if (requireLogin && !usersService.isLoggedSync()) {
        event.preventDefault();
        return $state.go('login');
      }
    });

  }

})();
