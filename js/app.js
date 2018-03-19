var courtDev = angular.module("courtDev", ['restangular']);

courtDev.config(function (RestangularProvider) {
    RestangularProvider.setBaseUrl('https://courtdev-api.azurewebsites.net/');
});

courtDev.controller("splashController", function($scope, $log, Restangular, $http){
    
    var vm = this;
    vm.promiseAwait = false;
    vm.registerForm = {};
    vm.courts = [];

    init();    

    function init () {
        getCourts();
    }

    function getCourts () {
        $http.get('/data.json').then(function(resp) {
            vm.courts = resp.data['Counties'];
         });
    }

    vm.register = function(registerForm){
        if (registerForm.$invalid) {
            angular.element('#registerForm').addClass("was-validated")
        }
        else {
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
                swal({
                    title: "Thank you for registering!",
                    text: "We're looking forward to seeing you at the event!",
                    icon: "success",
                    buttons: false,
                    timer: 5000
                });              
                vm.promiseAwait = false;
                resetForm();
            }, function (err) {
                swal({
                    title: "We encountered an error in your submission.",
                    text: "Please try again soon!",
                    icon: "error",
                    buttons: false,
                    timer: 5000
                });       
                vm.promiseAwait = false;
                $log.error(err);
            });
        }

        function resetForm() {
            angular.element('#registerForm').removeClass("was-validated")
            vm.registerForm.name = "";
            vm.registerForm.court = "";
            vm.registerForm.email = "";
            vm.registerForm.role = "";
            vm.registerForm.phoneNumber = "";
        }
    }

   
});
