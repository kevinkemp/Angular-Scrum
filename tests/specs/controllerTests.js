describe("Task Controller", function() {
	var scope, ctrl, $httpBackend;
	beforeEach(function() {
		module('scrum');
	});
	beforeEach(inject(function (_$httpBackend_, $rootScope) {
		
	    $httpBackend = _$httpBackend_;
	    scope = $rootScope.$new();
	    scope.storyId = 1;
	}));
	it("should set scope", inject(function($controller, $filter, tasksService) {
		ctrl = $controller('TaskController', { $scope: scope, $filter: $filter, tasksService: tasksService});
	    expect(ctrl).not.toBeUndefined();
	    expect(scope).not.toBeUndefined();
	    expect(scope.statuses).not.toBeUndefined();
	    expect(scope.titles).not.toBeUndefined();
	    expect(scope.todoTasks).not.toBeUndefined();
	    expect(scope.impededTasks).not.toBeUndefined();
	    expect(scope.inProgressTasks).not.toBeUndefined();
	    expect(scope.doneTasks).not.toBeUndefined();
	    expect(scope.addTask).not.toBeUndefined();
	}));
});