app.controller('MainCtrl', ['$scope', '$http', 'Backand', MainCtrl]);

function MainCtrl($scope, $http, Backand) {
    // console.log("main ctrl...")
    // $scope.main = {
    //     results: []
    // }

    // $scope.getResults = function () {
    //     console.log("getting results...")
    //     if (_everyoneHasVoted()) {
    //         console.log("herrreee!!")
    //
    //         return $http ({
    //           method: 'GET',
    //           url: Backand.getApiUrl() + '/1/objects/votes',
    //           params: {
    //             pageSize: 500,
    //             pageNumber: 1,
    //             filter: null,
    //             sort: ''
    //           }
    //         }).then(function(response) {
    //           $scope.main.results = response.data.data;
    //           console.log("results: ", $scope.main.results);
    //         });
    //     }
    // };
    //
    //
    // var _everyoneHasVoted = function() {
    //     // console.log("list of users: ", $scope.userList.lunchUsers);
    //     // for (var i=0; i<$scope.userList.lunchUsers.length; i++) {
    //     //     if ($scope.userList.lunchUser[i].hasVoted === false) {
    //     //         return false;
    //     //     }
    //     // }
    //     return true;
    // }

}
