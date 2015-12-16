// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var todoApp = angular.module('starter', ['ionic', 'firebase', 'timer']);
var fb = null;

todoApp.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
      fb = new Firebase("https://hackit.firebaseio.com/");
  });
});


todoApp.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        })
        .state('todo', {
            url: '/todo',
            templateUrl: 'templates/todo.html',
            controller: 'TodoController'
        });
    $urlRouterProvider.otherwise('/login')
});

todoApp.controller("LoginController", function ($scope, $firebaseAuth, $location) {
    $scope.login = function (username, password) {
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$authWithPassword({
                email: username,
                password: password
        }).then(function(authData){
            $location.path("/todo");
        }).catch(function(error){
            alert("ERROR: " + error);
        });
    }

    $scope.register = function(username, password){
        var fbAuth = $firebaseAuth(fb);
        fbAuth.$createUser({email: username, password: password}).then(function() {
            return fbAuth.$authWithPassword({
                email: username,
                password: password
            });
        }).then(function(authData){
            $location.path("/todo");
        }).catch(function(error){
            alert("ERROR " + error);
        });
    }
});

todoApp.controller("TodoController", function ($scope, $firebaseObject, $ionicPopup, $ionicScrollDelegate, $location) {

    $scope.list = function(){
        var fbAuth = fb.getAuth();
        if(fbAuth){
            var syncObject = $firebaseObject(fb.child("users/" + fbAuth.uid));
            syncObject.$bindTo($scope, "data");
        }

    }

    $scope.create = function(input) {
        console.log(input);
        if(input !== ""){
            if($scope.data.hasOwnProperty("todos") !== true) {
                $scope.data.todos = [];
            }
            var time = new Date().toLocaleTimeString();
            var toggle = false;
            $scope.data.todos.push({title: input, timeStamp: time, toggle: toggle});
        }else {
            console.log("Action not completed");
        };
        $ionicScrollDelegate.scrollTop(true);
    }
    $scope.updateToggle = function() {
        $scope.data.todos.child(input).set({ toggle: true});

    }

    $scope.logout = function() {
        $location.path("/login");
    }

})

todoApp.controller('ViewControl', function($scope, $ionicSideMenuDelegate) {

    $scope.toggleLeft = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };

});




todoApp.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});