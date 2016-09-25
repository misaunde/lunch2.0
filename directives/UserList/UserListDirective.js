app.directive('userListDirective', function($http, $location, Backand, UserService) {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'directives/UserList/UserListDirective.html',
    link: function(scope, elem, attr) {
        attr.$observe('scope.voted', function(value) {
           console.log("value??? ", value);
        });

        scope.$watch("userSelected", function(newVal) {
            // console.log("old: ", oldVal)
            if (newVal) {
                console.log("got here!!!!");
                // elem.css('display', 'none');
                // $(elem).fadeOut(1000, function() {
                // $('#test').addClass('user-list-slim');
                // $("#test").width(inherit);
                // elem.removeClass('user-list');
                // elem.addClass('user-list-slim');

                // elem.removeClass('width100');
                elem.animate({width:'25%'}, 500);
                $('#select-a-user').slideUp(500);

                    // done();
                // });
            } else {
                console.log("oh crap...")
                elem.animate({width:'100%'}, 500);
            }
        })

    },
    controller: function($scope, $http, $location, Backand, UserService) {
        $scope.userSelected = false;
        $scope.selectedUser = null;
        $scope.voted = false;
        $scope.userList = {
            lunchUsers: null,
            url: '/1/objects/lunchUsers'
        };


        Backand.on('user_voted', function (data) {
          //Get the event and refresh the list
          console.log("event:" + data);
          $scope.userList.updateUserList();
        });

        Backand.on('winner_posted', function (data) {
          console.log("event:" + data);
            if (!$scope.resultsArray) {
                console.log("getting results for everyone!!!")
                $scope.getResults();
            }
        });

        $scope.userList.updateUserList = function () {
          return $http ({
            method: 'GET',
            url: Backand.getApiUrl() + '/1/objects/lunchUsers',
            params: {
              pageSize: 50,
              pageNumber: 1,
              filter: null,
              sort: ''
            }
          }).then(function(response) {
            $scope.userList.lunchUsers = response.data.data;
          });
        };

        $scope.userList.userVoted = function (lunchUser) {
            lunchUser.hasVoted = !lunchUser.hasVoted;
            console.log("updated user: ", lunchUser);
            $scope.voted = lunchUser.hasVoted;
          return $http({
            method: 'PUT',
            url : Backand.getApiUrl() + $scope.userList.url + '/' + lunchUser.id,
            data: lunchUser
          }).then(function(response) {
            $scope.userList.updateUserList();
            return response.data;
          });
        };

        $scope.userList.selectUserOnServer = function (lunchUser) {
          return $http({
            method: 'PUT',
            url : Backand.getApiUrl() + $scope.userList.url + '/' + lunchUser.id,
            data: lunchUser,
            params: {
              returnObject: true
            }
          }).then(function(response) {
            $scope.userList.updateUserList();
            console.log("here? ", response)
            return response;
          });
        };

        $scope.userList.selectUser = function(user) {
            if (!$scope.userSelected) {
                UserService.user = user;
                console.log("user is: ", user);
                UserService.userId = user.id;
                $scope.selectedUser = user.id;
                $scope.userList.selectUserOnServer(user);
                if (user.hasVoted) {
                    $location.path('submit');
                } else {
                    $location.path('/');
                }
            }
            $scope.userSelected = true;
        }

        $scope.userList.reset = function() {
            $scope.userSelected = false;
            UserService.userId = null;
            UserService.user = null;
            $scope.selectedUser = null;
        }






        $scope.getResults = function () {
            if (_everyoneHasVoted()) {
                return $http ({
                  method: 'GET',
                  url: Backand.getApiUrl() + '/1/objects/votes',
                  params: {
                    pageSize: 500,
                    pageNumber: 1,
                    filter: null,
                    sort: ''
                  }
                }).then(function(response) {
                  $scope.surveyResults = response.data.data;
                  _createMapping($scope.surveyResults);
                  console.log("results: ", $scope.surveyResults);
                });
            }
        };


        var _everyoneHasVoted = function() {
            // console.log("list of users: ", $scope.userList.lunchUsers);
            // for (var i=0; i<$scope.userList.lunchUsers.length; i++) {
            //     if ($scope.userList.lunchUser[i].hasVoted === false) {
            //         return false;
            //     }
            // }
            return true;
        }

        var _createMapping = function(data) {
            var map = {};
            $scope.resultsDataMap = {};
            for (var i=0; i<data.length; i++) {
                var num = map[data[i].foodplace] ? map[data[i].foodplace] : 0;
                map[data[i].foodplace] = num + data[i].weightedVote;
                $scope.resultsDataMap[data[i].foodplace] = data[i];
            }
            $scope.resultsMap = map;
            $scope.resultsArray = _getSortedResultKeys(map);
            console.log("resultsMap: ", $scope.resultsMap);
            console.log("resultsArray: ", $scope.resultsArray);

            $scope.postResults();
        }

        function _getSortedResultKeys(obj) {
            var keys = []; for(var key in obj) keys.push(key);
            return keys.sort(function(a,b){return obj[b]-obj[a]});
        }

        $scope.get = function(k) {
            return map[k];
        }




        $scope.postResults = function() {
            var restaurant = $scope.resultsArray[0];
            var winner = {
                foodplaceId: $scope.resultsDataMap[restaurant].foodplaceId,
                foodplace: restaurant,
                weight: $scope.resultsDataMap[restaurant].weightedVote,
                timestamp: (new Date()).toISOString().substring(0, 19).replace('/T.*/', ' ')
            }
          return $http({
            method: 'POST',
            url : Backand.getApiUrl() + '/1/objects/results',
            data: winner,
            params: {
            //   returnObject: true
            }
          }).then(function(response) {
            // $scope.chat.loadChats();
            // $scope.chat.newMessage = '';
            return response.data;
          });
        };



    }
  };
});
