angular.module('databus',
  ['databus.config',
   'databus.directives',
   'databus.homePages',
   'databus.storage',
   'databus.listPages',
   'ngAnimate'])

  .controller('AppCtrl', function($scope, $rootScope) {
    $scope.path = function(value) {
      if(arguments.length == 1) {
        $rootScope._path = value;
      }
      return $rootScope._path || '/';  
    }
  });
