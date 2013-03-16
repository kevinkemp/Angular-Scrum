scrumApp.directive('story', function () {
    return {
        restrict: 'E',
        scope: {
            storyId: '=id',
            tasks: '=',
            title: '='
        },
        templateUrl: 'directives/story-directive.html',
        link: function (scope, element, attrs) {
            
        }
    }
});

scrumApp.directive('taskStatus', function ($log) {
    return {
        restrict: 'E',
        scope: {
            tasks: '=',
            status: '=',
            title: '='
        },
        templateUrl: 'directives/task-status-directive.html',
        link: function (scope, element, attrs) {
            scope.storyId = scope.$parent.storyId;
            var updateOrder = function() {
                angular.forEach($('task-status task'), function(element) {
                    var task = _.findWhere(scope.$parent.tasks, {id: parseInt(element.id)});
                    if (task) {
                        task.order = $(element).closest('li').index();
                    }
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

//decided to inject the service here rather than putting deleteTask on the taskController and binding the method b/c method binding is so terrible in angular
scrumApp.directive('task', function (tasksService) {
    return {
        restrict: 'E',
        scope: {
            task: '='
        },
        link:function (scope, element, attrs) {
            scope.storyId = scope.$parent.storyId;
            scope.deleteTask = function(taskId) {
                tasksService.deleteTask(scope.storyId, taskId);
            }
            //todo: find way to make this fire only after already instantiated?
            // element = element.closest('li');
            // element.addClass('recently-dropped');
            // setTimeout(function(){
            //     element.removeClass('recently-dropped')
            // }, 1000);
        }
    };
});