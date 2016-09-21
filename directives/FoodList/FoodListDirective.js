app.directive('foodListDirective', function($http, $location, $filter,  Backand, UserService) {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'directives/FoodList/FoodListDirective.html',
    link: function(scope, elem, attr) {
        scope.$watch("userSelected", function(val) {
            if (val) {
                $('#food-list-directive').delay('300').fadeIn(700);
            } else {
                $('#food-list-directive').delay('0').fadeOut(500);
            }
        })
    },
    controller: function($scope, $http, $location, $filter, Backand, UserService) {
        var baseUrl = '/1/objects/';
        var objectName = 'foodplace';
        var bulk = '/1/bulk';

        $scope.foodplaces = null;

        Backand.on('todo_updated', function (data) {
          console.log("event:" + data);
          $scope.readList();
        });

        $scope.readList = function () {
          return $http ({
            method: 'GET',
            url: Backand.getApiUrl() + '/1/objects/foodplace',
            params: {
              pageSize: 50,
              pageNumber: 1,
              filter: null,
              sort: ''
            }
          }).then(function(response) {
            $scope.foodplaces = response.data.data;
            $scope.foodplaces = $filter('orderBy')($scope.foodplaces, 'name');
                $scope.models = {
                    selected: null,
                    lists: {"A": $scope.foodplaces, "B": [], "C": []}
                };
                console.log("lists: ", $scope.models);

          });
        };

        $scope.readOne = function (id) {
          return $http({
            method: 'GET',
            url: Backand.getApiUrl() + baseUrl + objectName + '/' + id
          }).then(function(response) {
            return response.data;
          });
        };





        // Model to JSON for demo purpose
        $scope.$watch('models', function(model) {
            $scope.modelAsJson = angular.toJson(model, true);
        }, true);


        $scope.dropCallback = function(event, index, item, external, type, allowedType) {
            console.log("list B size: ", $scope.models.lists.B.length);
            console.log("list B: ", $scope.models.lists.B);
            if ($scope.models.lists.B.length > 4) {
                return false;
            }
            return item;
        };

        $scope.userVoted = function() {
            if ($scope.models.lists.B.length <= 0) {
                console.log("You haven't chosen anything yet...")
                $location.path('submit');
                return;
            }


            var bulkEntry = [
                {
                    "method": "PUT",
                    "url": Backand.getApiUrl() + $scope.userList.url + '/' + UserService.userId,
                    "data": {
                        "id": UserService.userId,
                        "hasVoted": true
                    }
                }
            ];

            var max = 5;
            for (var i=0; i<$scope.models.lists.B.length; i++) {
                var entry =    {
                    "method": "POST",
                    "url": Backand.getApiUrl() + '/1/objects/votes',
                    "data": {
                    	"lunchUsers": UserService.userId,
                    	"username": UserService.user.name,
                    	"foodplaceId": $scope.models.lists.B[i].id,
                    	"foodplace": $scope.models.lists.B[i].name,
                    	"weight": UserService.user.weight,
                    	"choice": (max - i),
                    	"weightedVote": UserService.user.weight * (max - i),
                    }
                }
                bulkEntry.push(entry);
            }

          return $http({
            method: 'POST',
            url : Backand.getApiUrl() + bulk,
            data: bulkEntry
          }).then(function(response) {
            $location.path('submit');
            $scope.userList.updateUserList();
            return response.data;
          });
        }

    }
  };
});
