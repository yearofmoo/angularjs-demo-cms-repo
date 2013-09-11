angular.module('databus.config', ['ngRoute'])

  .constant('CACHE_VERSION', 1)

  .constant('TPL_PATH', '/templates')

  .run(function($rootScope, TPL_PATH) {
    $rootScope.partial = function(path) {
      return TPL_PATH + path;
    };
  });
