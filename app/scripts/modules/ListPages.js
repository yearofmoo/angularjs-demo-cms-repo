angular.module('databus.listPages', ['ngRoute', 'databus.config'])

  .constant('LIST_STORAGE_KEY', 'lists')

  .run(function($rootScope, appStorage, $routeParams, LIST_STORAGE_KEY, $filter) {
    $rootScope.routeParams = $routeParams;
    $rootScope.lists = appStorage(LIST_STORAGE_KEY) || [];
    $rootScope.hasLists = function() {
      return $filter('clearEmpty')($rootScope.lists).length > 0;
    };
  })

  .config(function($routeProvider, $locationProvider, TPL_PATH) {
    $routeProvider
      .when('/lists', {
        templateUrl : TPL_PATH + '/lists/index.html',
        controller : 'ListIndexCtrl'
      })
      .when('/lists/new', {
        templateUrl : TPL_PATH + '/lists/form.html',
        controller : 'ListFormCtrl'
      })
      .when('/lists/:list_id/edit', {
        templateUrl : TPL_PATH + '/lists/form.html',
        controller : 'ListFormCtrl'
      })
      .when('/lists/:list_id', {
        templateUrl : TPL_PATH + '/lists/show.html',
        controller : 'ListShowCtrl'
      });
  })

  .controller('ListIndexCtrl', function($scope, $routeParams, $rootScope) {
    $scope.lists = $rootScope.lists;
  })

  .controller('ListShowCtrl', function($scope, $rootScope, $routeParams, $location, appStorage, LIST_STORAGE_KEY) {
    var listID = $routeParams.list_id;
    $scope.list = $scope.lists[listID];

    if(!$scope.list) {
      $location.path('/');
      return;
    }

    $scope.destroy = function() {
      delete $rootScope.lists[$scope.list.id];
      appStorage(LIST_STORAGE_KEY, $rootScope.lists);
      $location.path('/');
    }
  })

  .controller('ListEntriesFormCtrl', function($scope, $location, $rootScope, appStorage, paddResults, trimTrailing) {
    if(!$scope.list) return;

    var listID = $scope.list.id;
    var padding = 5;

    $scope.changed = false;
    $scope.entries = paddResults(20, padding, $scope.entries || $scope.list.entries, []);
    $scope.checkBounds = function() {
      var count = trimTrailing($scope.entries, keepEntry).length;
      if(count >= ($scope.entries.length - padding)) {
        $scope.entries.push({});
      }
    };

    $scope.checkBounds();

    $scope.submit = function() {
      angular.forEach($scope.entries, function(entry) {
        entry.isNew = false;
      });

      var entries = trimTrailing($scope.entries, keepEntry);
      var data = [];
      angular.forEach(entries, function(entry) {
        data.push(entry);
      });

      $rootScope.lists[listID].entries = data;
      appStorage('lists', $rootScope.lists);
    };

    function keepEntry(entry) {
      return entry.content && entry.content.length > 0;
    };
  })

  .controller('ListFormCtrl', function($scope, $routeParams, $location, $rootScope, appStorage, LIST_STORAGE_KEY) {
    var id = $routeParams.list_id;
    if(id >= 0) {
      $scope.list = $rootScope.lists[id];
      if(!$scope.list) {
        $location.path('/');
        return;
      }
    }
    else {
      $scope.list = {}; //new list
      $scope.newList = true;
    }

    $scope.submit = function() {
      if($scope.listForm.$valid) {
        var id = $scope.list.id >= 0 ?
          $scope.list.id :
          $scope.lists.length;
        $scope.list.id = id;
        $rootScope.lists[id] = $scope.list;
        appStorage(LIST_STORAGE_KEY, $rootScope.lists);
        $scope.$destroy();
        $location.path('/lists/' + id);
      }
    };
  })

  .factory('trimTrailing', function() {
    return function(records, check) {
      var emptyIndex = null;
      angular.forEach(records, function(record, index) {
        if(!check(record)) {
          emptyIndex = emptyIndex || index;
        }
        else {
          emptyIndex = null;
        }
      });
      return records.slice(0, emptyIndex || records.length);
    }
  })

  .factory('paddResults', function() {
    return function(min, padding, data, former) {
      data = data || [];
      var total = Math.max(min, (data.length || 0) + padding);
      for(var i=0;i<total;i++) {
        former[i] = data[i] || {};
      }
      return former;
    };
  })

  .filter('clearEmpty', function() {
    return function(arr) {
      var array = [];
      angular.forEach(arr, function(a) {
        a && a.id >= 0 && array.push(a);
      });
      return array;
    }
  });
