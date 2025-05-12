  let app = angular.module("vehicleApp", ["ngRoute"]);
  app.config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "view/home.html",
      })
      .when("/login", {
        templateUrl: "view/login.html",
        controller: "loginController",
      })
      .when("/register", {
        templateUrl: "view/register.html",
        controller: "registerController",
      })
      .when("/customerHome", {
        templateUrl: "view/customer/customerHome.html",
        controller: "customerController",
      })
      .when("/adminHome", {
        templateUrl: "view/admin/adminHome.html",
        controller: "adminController",
      })
      .when("/forgot-password", {
        templateUrl: "view/resetPassword.html",
        controller: "password",
      })
      .otherwise({ redirectTo: "/" });
  });
  