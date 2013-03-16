scrumApp.provider('storyProvider', function(){
    var tasks1 = [
        {id:1, title:'Task 1', points: 1, assignedTo: 'kevin.kemp', order: 0, status: TaskStatus.todo},
        {id:2, title:'Task 2', points: 2, assignedTo: 'kevin.kemp', order: 1, status: TaskStatus.todo},
        {id:3, title:'Task 3', points: 3, assignedTo: 'kevin.kemp', order: 0, status: TaskStatus.inProgress},
        {id:4, title:'Task 4', points: 4, assignedTo: 'kevin.kemp', order: 0, status: TaskStatus.impeded},
        {id:5, title:'Task 5', points: 5, assignedTo: 'kevin.kemp', order: 0, status: TaskStatus.done},
        {id:6, title:'Task 6', points: 6, assignedTo: 'kevin.kemp', order: 1, status: TaskStatus.done},
        {id:7, title:'Task 7', points: 7, assignedTo: 'kevin.kemp', order: 2, status: TaskStatus.done},
        {id:8, title:'Task 8', points: 8, assignedTo: 'kevin.kemp', order: 3, status: TaskStatus.done}
    ];
    var tasks2 = [
        {id:1, title:'Task 1', points: 1, assignedTo: 'john.doe', order: 0, status: TaskStatus.todo},
        {id:2, title:'Task 2', points: 2, assignedTo: 'john.doe', order: 1, status: TaskStatus.todo},
        {id:3, title:'Task 3', points: 3, assignedTo: 'john.doe', order: 0, status: TaskStatus.inProgress},
        {id:4, title:'Task 4', points: 4, assignedTo: 'john.doe', order: 0, status: TaskStatus.impeded},
        {id:5, title:'Task 5', points: 5, assignedTo: 'john.doe', order: 0, status: TaskStatus.done},
        {id:6, title:'Task 6', points: 6, assignedTo: 'john.doe', order: 1, status: TaskStatus.done}
    ];
    var tasks3 = [
        {id:1, title:'Task 1', points: 1, assignedTo: 'jane.doe', order: 0, status: TaskStatus.inProgress},
        {id:2, title:'Task 2', points: 2, assignedTo: 'jane.doe', order: 1, status: TaskStatus.inProgress},
        {id:3, title:'Task 3', points: 3, assignedTo: 'jane.doe', order: 2, status: TaskStatus.inProgress},
        {id:4, title:'Task 4', points: 4, assignedTo: 'jane.doe', order: 0, status: TaskStatus.impeded},
        {id:5, title:'Task 5', points: 5, assignedTo: 'jane.doe', order: 3, status: TaskStatus.inProgress},
        {id:6, title:'Task 6', points: 6, assignedTo: 'jane.doe', order: 4, status: TaskStatus.inProgress},
        {id:7, title:'Task 7', points: 7, assignedTo: 'jane.doe', order: 0, status: TaskStatus.done},
        {id:8, title:'Task 8', points: 8, assignedTo: 'jane.doe', order: 1, status: TaskStatus.done}
    ];
    var stories = [
        {id: 1, title: 'First story', tasks: tasks1},
        {id: 2, title: 'Second story', tasks: tasks2},
        {id: 3, title: 'Third story', tasks: tasks3}
    ];

    return {
        $get: function() {
            return stories;
        }
    }
});

scrumApp.service('storiesService', function (storyProvider) {
    var self = this;
    self.stories = function() {
        return storyProvider;
    }
});

scrumApp.service('tasksService', function (storyProvider) {
    var self = this;

    self.tasks = function (storyId) {
        var stories = storyProvider;
        var tasks = _.findWhere(stories, {id: storyId}).tasks;
        return tasks;
    }

    self.addTask = function (storyId, taskCreationString) {
        var tasks = self.tasks(storyId);
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
        return true;
    }
    self.deleteTask = function (storyId, taskId) {
        var tasks = self.tasks(storyId);
        var indexToRemove = 0;
        angular.forEach(tasks, function (task) {
            if (task.id === taskId) {
                //using a method that alters the original copy is a must because of how angular databinds: splice
                tasks.splice(indexToRemove, 1);
                return true;
            }
            indexToRemove ++;
        });
        return false;
    }
})