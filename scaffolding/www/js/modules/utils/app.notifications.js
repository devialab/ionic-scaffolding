(function() {
  'use strict';

  angular
    .module('app')
    .run(registerPushNotifications);

  /* @ngInject */
  function registerPushNotifications($rootScope, $localStorage, $state, $log, $ionicPlatform, $cordovaPush, $cordovaMedia, config, ionicReady) {

    ionicReady().then(function() {
      if (!window.PushNotification) {
        return;
      }
      var push = window.PushNotification.init({
        android: {
          senderID: config.get('google.projectId'),
          forceShow: true,
          iconColor: config.get('brand.primary')
        },
        ios: {
          alert: true,
          badge: true,
          sound: true,
          clearBadge: true
        },
        windows: {}
      });

      push.on('registration', function(notification) {
        if (notification.registrationId.length > 0) {
          $log.debug('registration ID = ' + notification.registrationId);
          $localStorage.deviceToken = notification.registrationId;
        }
      });

      push.on('notification', function(notification) {
        $log.debug('Received push notification: ' + JSON.stringify(notification));
        if (!notification.additionalData.foreground) {
          switch (notification.additionalData.type) {
            case 'EVENTS':
              if (notification.additionalData.id) {
                $state.go('event-detail', {
                  id: notification.additionalData.id
                });
              } else {
                $state.go('events-me');
              }
              break;
            case 'MESSAGE':
              break;
            default:
              break;
          }

        }
      });

      push.on('error', function(e) {
        $log.error('GCM error = ' + e.message);
      });
    });

  }
})();
