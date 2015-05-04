var todoApp = angular.module('ToDoList', []);

todoApp.controller("toDoController", ['$scope', function($scope) {

    $scope.toDoItems = [
        { title: "First simple to do item", done: false }
    ];
        
    $scope.addToDoItem = function () {
        $scope.toDoItems.unshift({ title: $scope.new_todo, done: false });
        $scope.new_todo = '';
    };

    $scope.removeToDoItem = function(item) {
        var index = $scope.toDoItems.indexOf(item);
        $scope.toDoItems.splice(index, 1);
    };

}]);