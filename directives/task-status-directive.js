scrumApp.directive('taskStatus', function ($log) {
    return {
        restrict: 'E',
        scope: {
            tasks: '=',
            status: '=',
            title: '='
        },
        templateUrl: 'partials/task-status-directive.html',
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
});