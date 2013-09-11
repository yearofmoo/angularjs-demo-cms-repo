angular.module('databus.storage', [])

  .factory('storageLocal', function($window) {
    var ss = $window.localStorage;
    return function(key) {
      if(arguments.length == 2) {
        ss.setItem(key, arguments[1]);
      }
      else {
        return ss.getItem(key);
      }
    }
  })

  .factory('appStorage', function(storageLocal) {
    return function(key) {
      if(arguments.length == 2) {
        var data = JSON.stringify(arguments[1]);
        storageLocal(key, data);
      }
      else {
        return JSON.parse(storageLocal(key));
      }
    }
  });
