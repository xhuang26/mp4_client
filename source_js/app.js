var app = angular.module('mp4', ['ngRoute', 'mp4Controllers', 'mp4Services']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.
    when('/firstview', {
    templateUrl: 'partials/firstview.html',
    controller: 'FirstController'
  }).
  when('/secondview', {
    templateUrl: 'partials/secondview.html',
    controller: 'SecondController'
  }).
  when('/settings', {
    templateUrl: 'partials/settings.html',
    controller: 'SettingsController'
  }).
  when('/llamalist', {
    templateUrl: 'partials/llamalist.html',
    controller: 'LlamaListController'
  }).
  when('/tasklist', {
      templateUrl: 'partials/tasklist.html',
      controller: 'tasklistController'
  }).
  when('/tasklist/:num/:taskType/:sortby', {
      templateUrl: 'partials/tasklist.html',
      controller: 'tasklistController'
  }).
  when('/taskdetails', {
      templateUrl: 'partials/taskdetails.html',
      controller: "taskdetailsController"
  }).
  when('/newtask', {
      templateUrl: 'partials/newTask.html',
      controller: 'newTaskController'
  }).
  when('/edittask', {
      templateUrl: 'partials/editTask.html',
      controller: 'editTaskController'
  }).
  otherwise({
    redirectTo: '/settings'
  });
}]);
