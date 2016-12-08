angular.module('at', ['at.services','ngRoute'])
.config(function($routeProvider, $httpProvider) {
  $routeProvider
  .when('/', {
    templateUrl: './app/allApps/allApps.html',
    controller: 'allAppsController',
    authenticate: false //change to true once auth works
  })
  .when('/addApps', {
    templateUrl: './app/addApps/addApps.html',
    controller: 'addAppsController',
    authenticate: false //change to true once auth works
  })
  .when('/login', {
    templateUrl: './login/login.html',
    controller: 'AuthController'
  })
  .when('/signup', {
    templateUrl: './login/signup.html',
    controller: 'AuthController'
  })
  .otherwise({
    redirectTo: '/'
  });
  $httpProvider.interceptors.push('AttachTokens'); // will attach token to the localStorage
})

.factory('AttachTokens', function ($window) {
  var attach = {
    request: function (object) {
      var jwt = $window.localStorage.getItem('app-track');
      if (jwt) {
        object.headers['x-access-token'] = jwt;
      }
      object.headers['Allow-Control-Allow-Origin'] = '*';
      return object;
    }
  };
  return attach;
})
.run(function ($rootScope, $location, Auth) { // handles the authentication where authentication: true above
  $rootScope.$on('$routeChangeStart', function (evt, next, current) {
    if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
      $location.path('/login');
    }
  });
});
