var courtDev = angular.module("courtDev", ['restangular']);

courtDev.config(function (RestangularProvider) {
    RestangularProvider.setBaseUrl('http://courtdev-api.azurewebsites.net/');
});

courtDev.controller("splashController", function($scope, $log, Restangular){
    
    var vm = this;
    vm.promiseAwait = false;
    vm.registerForm = {};

    vm.register = function(){

        vm.promiseAwait = true;
        var registerObj = {
            "name": vm.registerForm.name,
            "court": vm.registerForm.court,
            "email": vm.registerForm.email,
            "jobRole": vm.registerForm.role,
            "phone": vm.registerForm.phoneNumber
        };
        console.log(registerObj);

        Restangular.all('api/registration').customPOST(registerObj).then(function (resp) {
            console.log("return");
            console.log(resp);
            vm.promiseAwait = false;
        }, function (err) {
            vm.promiseAwait = false;
            $log.error(err);
        });

  
    }

   
});