var TaskStatus = {
    todo: 'todo',
    inProgress: 'in-progress',
    impeded: 'impeded',
    done: 'done'
};
var Titles = {
    todo: 'To Do',
    inProgress: 'In Progress',
    impeded: 'Impeded',
    done: 'Done'
};

angular.module('myApp', [])
    .service('tasksService', function () {
        var self = this;
        var data = [
            {id:1, title:'Task 1', points: 1, assignedTo: 'kevin.kemp', order: 0, status: TaskStatus.todo},
            {id:2, title:'Task 2', points: 2, assignedTo: 'kevin.kemp', order: 1, status: TaskStatus.todo},
            {id:3, title:'Task 3', points: 3, assignedTo: 'kevin.kemp', order: 0, status: TaskStatus.inProgress},
            {id:4, title:'Task 4', points: 4, assignedTo: 'kevin.kemp', order: 0, status: TaskStatus.impeded},
            {id:5, title:'Task 5', points: 5, assignedTo: 'kevin.kemp', order: 0, status: TaskStatus.done},
            {id:6, title:'Task 6', points: 6, assignedTo: 'kevin.kemp', order: 1, status: TaskStatus.done},
            {id:7, title:'Task 7', points: 7, assignedTo: 'kevin.kemp', order: 2, status: TaskStatus.done},
            {id:8, title:'Task 8', points: 8, assignedTo: 'kevin.kemp', order: 3, status: TaskStatus.done}
        ];
        var data2 = [
            {id:1, title:'Task 1', points: 1, assignedTo: 'john.doe', order: 0, status: TaskStatus.todo},
            {id:2, title:'Task 2', points: 2, assignedTo: 'john.doe', order: 1, status: TaskStatus.todo},
            {id:3, title:'Task 3', points: 3, assignedTo: 'john.doe', order: 0, status: TaskStatus.inProgress},
            {id:4, title:'Task 4', points: 4, assignedTo: 'john.doe', order: 0, status: TaskStatus.impeded},
            {id:5, title:'Task 5', points: 5, assignedTo: 'john.doe', order: 0, status: TaskStatus.done},
            {id:6, title:'Task 6', points: 6, assignedTo: 'john.doe', order: 1, status: TaskStatus.done}
        ];
        var data3 = [
            {id:1, title:'Task 1', points: 1, assignedTo: 'jane.doe', order: 0, status: TaskStatus.inProgress},
            {id:2, title:'Task 2', points: 2, assignedTo: 'jane.doe', order: 1, status: TaskStatus.inProgress},
            {id:3, title:'Task 3', points: 3, assignedTo: 'jane.doe', order: 2, status: TaskStatus.inProgress},
            {id:4, title:'Task 4', points: 4, assignedTo: 'jane.doe', order: 0, status: TaskStatus.impeded},
            {id:5, title:'Task 5', points: 5, assignedTo: 'jane.doe', order: 3, status: TaskStatus.inProgress},
            {id:6, title:'Task 6', points: 6, assignedTo: 'jane.doe', order: 4, status: TaskStatus.inProgress},
            {id:7, title:'Task 7', points: 7, assignedTo: 'jane.doe', order: 0, status: TaskStatus.done},
            {id:8, title:'Task 8', points: 8, assignedTo: 'jane.doe', order: 1, status: TaskStatus.done}
        ];
        var tasks;

        self.tasks = function () {
            if (angular.isUndefined(tasks)) {
                //simulate different result sets
                var random = Math.random()*3;
                if (random < 1) {
                    tasks = data;
                } else if (random < 2){
                    tasks = data2;
                } else {
                    tasks = data3;
                }
            }
            return tasks;
        }
        self.addTask = function (taskCreationString) {
            var tokens = taskCreationString.split(' ');
            var lastToken = tokens[tokens.length - 1];
            var effort = parseInt(lastToken);
            var title = taskCreationString.replace(lastToken, '').trim();
            if (_.isNaN(effort)) {
                effort = 1;
                title = taskCreationString;
            }
            var currentIndex = tasks.length + 1;
            tasks.push({
                id: currentIndex, title: title, points: effort, assignedTo: 'no one', status: TaskStatus.todo
            });
        }
        self.deleteTask = function (id) {
            var indexToRemove = 0;
            angular.forEach(tasks, function (task) {
                if (task.id === id) {
                    //using a method that alters the original copy is a must because of how angular databinds: splice
                    tasks.splice(indexToRemove, 1);
                }
                indexToRemove ++;
            });
            
        }
    })
    .directive('taskStatus', function ($log) {
        return {
            restrict: 'E',
            scope: {
                tasks: '=',
                status: '=',
                title: '='
            },
            templateUrl: "partials/task-status-directive.html",
            link: function (scope, element, attrs) {
                var updateOrder = function() {
                    angular.forEach($('task-status task'), function(element) {
                        var task = _.findWhere(scope.$parent.tasks, {id: parseInt(element.id)});
                        task.order = $(element).closest('li').index();
                    });
                }
                var updateTask = function(event, ui) {
                    var id = parseInt($('task', ui.item).attr('id'));
                    var task = _.findWhere(scope.$parent.tasks, {id: id});
                    task.status = scope.status;
                    if (task.status === TaskStatus.todo) {
                        task.assignedTo = 'no one';
                    } else {
                        task.assignedTo = 'kevin.kemp';
                    }
                    updateOrder();
                    //necessary because only child scopes are checked by default
                    scope.$parent.$digest();
                }
                $('.thumbnails', element).sortable({
                    placeholder: 'ui-state-highlight',
                    forcePlaceholderSize: true,
                    connectWith: '.thumbnails',
                    dropOnEmpty: true,
                    tolerance: 'pointer',
                    receive: updateTask,//for receiving from a different list
                    change: updateOrder//for receiving from same list
                });
            }
        };
    })
    //decided to inject the service here rather than putting deleteTask on the taskController and binding the method b/c method binding is so terrible in angular
    .directive('task', function (tasksService) {
        return {
            restrict: 'E',
            scope: {
                task: '='
            },
            link:function (scope, element, attrs) {
                scope.deleteTask = function(id) {
                    tasksService.deleteTask(id);
                }
                //todo: find way to make this fire only after already instantiated?
                // element = element.closest('li');
                // element.addClass('recently-dropped');
                // setTimeout(function(){
                //     element.removeClass('recently-dropped')
                // }, 1000);
            }
        };
    })
    .controller('TaskController', ['$scope', '$filter', 'tasksService', function ($scope, $filter, tasksService) {

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