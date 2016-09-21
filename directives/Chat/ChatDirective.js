app.directive('chatDirective', function($http, Backand, UserService) {
  return {
    restrict: 'AE',
    replace: true,
    templateUrl: 'directives/Chat/ChatDirective.html',
    link: function(scope, elem, attr) {

        scope.$watch('chat.chats', function(val) {
            if (val) {
                var n = $('#chatMessages').height();
                $('#chat-directive').animate({ scrollTop: n }, 500);
            }
        })

        scope.$watch("userSelected", function(newVal) {
            if (newVal) {
                var n = $('#chatMessages').height();
                $('#chat-directive').animate({ scrollTop: n }, 500);
            }
        })

    },
    controller: function($scope, $http, Backand, UserService) {
        var baseUrl = '/1/objects/';
        var objectName = 'chat';

        $scope.chat = {
            chats: null,
            url: '/1/objects/chat'
        }

        Backand.on('chat_updated', function (data) {
          $scope.chat.loadChats();
        });

        $scope.chat.loadChats = function () {
          return $http ({
            method: 'GET',
            url: Backand.getApiUrl() + $scope.chat.url,
            params: {
              pageSize: 50,
              pageNumber: 1,
              filter: null,
              sort: ''
            }
          }).then(function(response) {
            $scope.chat.chats = response.data.data;
          });
        };

        $scope.chat.create = function (message) {
            var newChat = {
                message: message,
                lunchUsers: UserService.userId,
                timestamp: (new Date()).toISOString().substring(0, 19).replace('/T.*/', ' ')
            }
          return $http({
            method: 'POST',
            url : Backand.getApiUrl() + $scope.chat.url,
            data: newChat,
            params: {
              returnObject: true
            }
          }).then(function(response) {
            $scope.chat.loadChats();
            $scope.chat.newMessage = '';
            return response.data;
          });
        };
    }

  };
});
