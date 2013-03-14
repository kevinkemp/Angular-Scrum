//decided to inject the service here rather than putting deleteTask on the taskController and binding the method b/c method binding is so terrible in angular
scrumApp.directive('task', function (tasksService) {
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
});