app.controller('ChatCtrl', ['$scope', '$http', 'Backand', ChatCtrl]);

function ChatCtrl($scope, $http, Backand) {

    var baseUrl = '/1/objects/';
    var objectName = 'chat';

    $scope.todos = null;

    Backand.on('todo_updated', function (data) {
      //Get the event and refresh the list
      console.log("event:" + data);
      $scope.readList();
    });

    $scope.readList = function () {
      return $http ({
        method: 'GET',
        url: Backand.getApiUrl() + '/1/objects/chat',
        params: {
          pageSize: 50,
          pageNumber: 1,
          filter: null,
          sort: '[{fieldName:\'id\', order:\'desc\'}]'
        }
      }).then(function(response) {
        $scope.todos = response.data.data;
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

}
