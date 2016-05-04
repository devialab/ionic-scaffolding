(function() {
  'use strict';

  /**
   * app.utils Module
   * http://www.gajotres.net/handling-native-view-animations-with-ionic-framework/
   */
  angular.module('app.utils').run(function($ionicPlatform) {

    $ionicPlatform.ready(function() {

      // then override any default you want
      if (window.plugins && window.plugins.nativepagetransitions) {
        window.plugins.nativepagetransitions.globalOptions.duration = 300;
        window.plugins.nativepagetransitions.globalOptions.iosdelay = 350;
        window.plugins.nativepagetransitions.globalOptions.androiddelay = 400;
        window.plugins.nativepagetransitions.globalOptions.winphonedelay = 350;
        window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 4;
        // these are used for slide left/right only currently
        window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
        window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;
      }

    });

  }).service('goNativeService', function() {

    var services = {
      getReversalDirection: getReversalDirection,
      setNextDirection: setNextDirection,
      getNextDirection: getNextDirection
    };

    var nextDirection = [];

    return services;

    function getReversalDirection(direction) {
      switch (direction) {
        case 'right':
          return 'left';
        case 'left':
          return 'right';
        case 'up':
          return 'down';
        case 'down':
          return 'up';
        default:
          return 'left';
      }
    }

    function setNextDirection(direction) {
      nextDirection.push(direction);
    }

    function getNextDirection() {
      return nextDirection.length ? nextDirection.pop() : 'right';
    }

  }).directive('goNative', function($rootScope, $ionicGesture, $ionicPlatform, ionicReady, goNativeService) {
    return {
      restrict: 'A',
      priority: 1,
      link: function(scope, element, attrs) {
        $ionicGesture.on('tap', function(e) {

          if (!window.plugins || !window.plugins.nativepagetransitions) {
            return;
          }

          console.log(e);

          var direction = attrs.direction || 'left';
          var transitiontype = attrs.transitiontype || 'slide';

          console.log({
            direction: direction,
            transition: transitiontype
          });

          $rootScope.$broadcast('go-native:start', {
            direction: direction,
            transition: transitiontype
          });

          ionicReady().then(function() {
            switch (transitiontype) {
              case 'fade':
                window.plugins.nativepagetransitions.fade({},
                  function(msg) {
                    console.log('success: ' + msg);
                  },
                  function(msg) {
                    alert('error: ' + msg);
                  }
                );
                break;
              case 'drawer':
                window.plugins.nativepagetransitions.drawer({
                    'origin': direction,
                    'action': 'open'
                  },
                  function(msg) {
                    console.log('success: ' + msg);
                  },
                  function(msg) {
                    alert('error: ' + msg);
                  }
                );
                break;

              default:
                window.plugins.nativepagetransitions.slide({
                    'direction': direction
                  },
                  function(msg) {
                    console.log('success: ' + msg);
                  },
                  function(msg) {
                    alert('error: ' + msg);
                  }
                );
                break;
            }

            goNativeService.setNextDirection(goNativeService.getReversalDirection(direction));

          });
        }, element);
      }
    };
  });

})();
