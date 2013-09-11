angular.module('databus.homePages', ['ngRoute', 'databus.config'])
  .config(function($routeProvider, TPL_PATH) {
    $routeProvider
      .when('/', {
        redirectTo : '/lists'
      })
  })
