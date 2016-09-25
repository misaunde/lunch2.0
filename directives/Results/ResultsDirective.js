var imDumb = true;

app.directive('resultsDirective', function($http, Backand, $interval) {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'directives/Results/ResultsDirective.html',
    link: function(scope, elem, attr) {
        scope.$watch("userSelected", function(val) {
            if (val) {
                elem.delay('300').fadeIn(700);
            } else {
                elem.delay('0').fadeOut(500);
            }

        });

        if (imDumb) {
            imDumb = false;
            var dots = 0;
            console.log("GOT HERERE....")
            crap = $interval(function() {
                if(dots < 3) {
                    $('#dots').append('.');
                    dots++;
                } else {
                    $('#dots').html('');
                    dots = 0;
                }
            }, 600);
        }

    },
    controller: function($scope, $http, Backand) {
        $scope.results = {
            results: [],
            votesUrl: '/1/objects/votes',
            resultsUrl: '/1/objects/results'
        }

        Backand.on('todo_updated', function (data) {
          $scope.readList();
        });

        // $scope.getResults = function () {
        //     console.log("getting results...")
        //     if (_everyoneHasVoted()) {
        //         // return $http ({
        //         //   method: 'GET',
        //         //   url: Backand.getApiUrl() + '/1/objects/todo',
        //         //   params: {
        //         //     pageSize: 50,
        //         //     pageNumber: 1,
        //         //     filter: null,
        //         //     sort: '[{fieldName:\'id\', order:\'desc\'}]'
        //         //   }
        //         // }).then(function(response) {
        //         //   $scope.todos = response.data.data;
        //         // });
        //     }
        //
        // };

        $scope.create = function (newTodo) {
          return $http({
            method: 'POST',
            url : Backand.getApiUrl() + baseUrl + objectName,
            data: newTodo,
            params: {
              returnObject: true
            }
          }).then(function(response) {
            $scope.readList();
            return response.data;
          });
        };

        $scope.update = function (todo) {
          return $http({
            method: 'PUT',
            url : Backand.getApiUrl() + baseUrl + objectName + '/' + todo.id,
            data: todo
          }).then(function(response) {
            $scope.readList();
            return response.data;
          });
        };

        $scope.delete = function (todo) {
          return $http({
            method: 'DELETE',
            url : Backand.getApiUrl() + baseUrl + objectName + '/' + todo.id
          }).then(function(response) {
            $scope.readList();
            return response.data;
          });
        };



            $scope.getResultWeight = function(key) {
                return $scope.resultsMap[key];
            }


            $scope.getUsersFor = function(result) {
                var names = [];
                for (var i=0; i<$scope.surveyResults.length; i++) {
                    if (result === $scope.surveyResults[i].foodplace && names.indexOf($scope.surveyResults[i].username) === -1) {
                        names.push($scope.surveyResults[i].username);
                    }
                }

                var votes = '[';
                for (var i=0; i<names.length; i++) {
                    votes = votes + (votes === '[' ? '' : ', ') +  names[i] + ": " + $scope.resultsDataMap[result].choice
                }
                return votes + ']';
            }

    }


  };
});
