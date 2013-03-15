scrumApp.directive('story', function () {
    return {
        restrict: 'E',
        scope: {
            tasks: '=',
            title: '@'
        },
        templateUrl: 'directives/story-directive.html',
        link: function (scope, element, attrs) {

        }
    }
});