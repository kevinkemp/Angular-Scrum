scrumApp.controller('TaskController', ['$scope', '$filter', 'tasksService', function ($scope, $filter, tasksService) {

    $scope.tasks = tasksService.tasks();
    //need to redo filters whenever tasks changes
    $scope.$watch('tasks', function (newValue, oldValue) {
        setFilteredTaskViews();
    }, true);
    $scope.statuses = TaskStatus;
    $scope.titles = Titles;
    setFilteredTaskViews();

    //for debugging
    mytasks = $scope.tasks;

    function setFilteredTaskViews() {
        var sortedTasks = _.sortBy($scope.tasks, 'order');
        function filterByStatus(statusFilter) {
            return $filter('filter')(sortedTasks, function(element) {
                var matchesFilter = element.status === statusFilter;
                return matchesFilter;
            });
        }
        $scope.todoTasks = filterByStatus(TaskStatus.todo);
        $scope.impededTasks = filterByStatus(TaskStatus.impeded);
        $scope.inProgressTasks = filterByStatus(TaskStatus.inProgress);
        $scope.doneTasks = filterByStatus(TaskStatus.done);
    }
    $scope.addTask = function (taskCreationString) {
        if(taskCreationString != '') {
            tasksService.addTask(taskCreationString);
        }
    };
    $scope.resetForm = function() {
        $scope.taskCreationString = '';
    };
}]);