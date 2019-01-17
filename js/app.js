var courtDev = angular.module("courtDev", ['restangular', 'countUpModule']);

courtDev.config(function (RestangularProvider) {
    RestangularProvider.setBaseUrl('https://courtdev-api.azurewebsites.net/');
});

courtDev.controller("splashController", function($scope, $log, Restangular, $http){
    
    var vm = this;
    vm.promiseAwait = false;
    vm.registerForm = {};
    vm.courts = [];
    vm.firstVisit = true;
    vm.timer;
    vm.eventDate = new Date("2019-02-22T09:00:00-08:00")

    init();    

    function init () {
        getAttendeeCount();
        startTimer();
        getCourts();
    }

    function getCourts () {
        $http.get('/data.json').then(function(resp) {
            vm.courts = resp.data['Counties'];
         });
    }

    function startTimer() {
        vm.timer = setInterval(function() {
            timeBetweenDates(vm.eventDate);
        }, 1000);
    }



    function timeBetweenDates(toDate) {
    var dateEntered = toDate;
    var now = new Date();
    var difference = dateEntered.getTime() - now.getTime();

    if (difference <= 0) {
        // Event Reached
        clearInterval(vm.timer);
    } else {
        var seconds = Math.floor(difference / 1000);
        var minutes = Math.floor(seconds / 60);
        var hours = Math.floor(minutes / 60);
        var days = Math.floor(hours / 24);

        hours %= 24;
        minutes %= 60;
        seconds %= 60;

        if (vm.firstVisit === true) {
            var secAnim = new CountUp("seconds", 0, seconds);
            secAnim.start();
            var minAnim = new CountUp("minutes", 0, minutes);
            minAnim.start();
            var hrAnim = new CountUp("hours", 0, hours);
            hrAnim.start();
            var dayAnim = new CountUp("days", 0, days);
            dayAnim.start();
            vm.firstVisit = false;
        } 

        angular.element("#days").text(days);
        angular.element("#hours").text(hours);
        angular.element("#minutes").text(minutes);
        angular.element("#seconds").text(seconds);
    }
    }

    function getAttendeeCount () {
        Restangular.one("api/registration/count").get().then(function (resp) {
            vm.attendeeCount = resp;
            var numAnim = new CountUp("count", 0, vm.attendeeCount);
            numAnim.start();
        })
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

            if(registerObj.jobRole === 'Other') {
                registerObj.jobRole = registerObj.jobRole + ': ' + vm.registerForm.title;
            }
            
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
