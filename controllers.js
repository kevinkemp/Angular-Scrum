scrumApp.controller('StoryController', ['$scope', '$filter', 'storiesService', function ($scope, $filter, storiesService) {
    $scope.stories = storiesService.stories();
}]);

scrumApp.controller('TaskController', ['$scope', '$filter', 'tasksService', function ($scope, $filter, tasksService) {
    $scope.tasks = tasksService.tasks($scope.storyId);
    //need to redo filters whenever tasks changes
    $scope.$watch('tasks', function (newValue, oldValue) {
        setFilteredTaskViews();
    }, true);
    $scope.statuses = TaskStatus;
    $scope.titles = Titles;
    setFilteredTaskViews();

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
            if (tasksService.addTask($scope.storyId, taskCreationString)) {
                resetForm();
            }
        }
    };
    function resetForm () {
        $scope.taskCreationString = '';
    };
}]);