'use strict';

define(['angular','require'], function(angular, require) {
  var app = angular.module('portal.main.controllers', []);

  app.controller('PortalMainController', ['$localStorage', '$sessionStorage','$scope', '$rootScope', '$document', '$location', 'NAMES', 'MISC_URLS', 'APP_FLAGS','THEMES','miscService', function($localStorage, $sessionStorage, $scope, $rootScope, $document, $location, NAMES, MISC_URLS, APP_FLAGS,THEMES, miscService) {
    var defaults = {
            layoutMode : 'list' //other option is 'widgets
            };

    function setTitle(){
      var frameTitle = "";
      if($rootScope.portal && $rootScope.portal.theme) {
        frameTitle = $rootScope.portal.theme.title;
        if(frameTitle !== NAMES.title && !APP_FLAGS.isWeb) {
          frameTitle = " | " + frameTitle;
        } else {
          //since frame title equals the title in NAMES lets not duplicate it
          frameTitle = "";
        }
      }
      $document[0].title=NAMES.title + frameTitle;
    }

    //=====functions ======
    var init = function(){
      $scope.$storage = $localStorage.$default(defaults);

      $scope.NAMES=NAMES;
      $scope.APP_FLAGS=APP_FLAGS;
      $scope.MISC_URLS=MISC_URLS;
      $scope.THEMES = THEMES.themes;

      if(NAMES.title) {
        setTitle();
      }

      $rootScope.$watch('portal.theme', function(newValue, oldValue) {
        if(newValue && newValue !== oldValue) {
          setTitle();
        }
      });

      //class for ng-view
      $scope.routeClass = "route" + angular.lowercase($location.path().replace(new RegExp('/', 'g'), '-'));
    }

    $scope.resetAll = function(){
      $scope.resetLocal();
      $scope.resetSession();
      $scope.reload();
    }

    $scope.resetLocal = function() {
        $localStorage.$reset(defaults);
    };

    $scope.resetSession = function() {
        $sessionStorage.$reset();
    };

    $scope.reload = function() {
        location.reload();
    }
    $scope.pushGAEvent = function (category, action, label) {
      miscService.pushGAEvent(category, action, label);
    }

    //run init
    init();
  } ]);

  /* Username */
  app.controller('SessionCheckController', [ '$scope', 'mainService', 'NAMES', 'FOOTER_URLS', '$rootScope', function($scope, mainService, NAMES, FOOTER_URLS, $rootScope) {
    var that = this;
    that.user = [];

    $scope.FOOTER_URLS = FOOTER_URLS;
    $scope.usernameOptionOpen = false;

    mainService.getUser().then(function(result){
      that.user = result;
      //check if is guest
      if (NAMES.guestUserName && that.user && that.user.userName === NAMES.guestUserName)
        $rootScope.GuestMode = true;

    });
  }]);

  /* Header */
  app.controller('PortalHeaderController', ['$rootScope', '$scope','$location', 'NAMES', 'APP_FLAGS', 'MISC_URLS','notificationsService', function($rootScope, $scope, $location, NAMES, APP_FLAGS, MISC_URLS, notificationsService) {
    this.navbarCollapsed = true;
    this.showLogout = true;
    $scope.showSearch = false;
    $scope.showSearchFocus = false;
    $scope.APP_FLAGS = APP_FLAGS;
    $scope.MISC_URLS = MISC_URLS;

    this.toggleSearch = function() {
        $scope.showSearch = !$scope.showSearch;
        $scope.showSearchFocus = !$scope.showSearchFocus;
        this.navbarCollapsed = true;
    }
    this.toggleMenu = function () {
      $scope.showSearch = false;
      this.navbarCollapsed = !this.navbarCollapsed;
    }
  }]);

  /* Footer */
  app.controller('PortalFooterController', ['$scope', function($scope) {
      $scope.date = new Date();

  }]);

  return app;

});
