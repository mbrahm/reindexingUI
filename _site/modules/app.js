var app = angular.module('reindexingFront', ['ngRoute', "esurls"]);

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/reindex', {
                templateUrl: 'partials/reindex.html',
                controller: 'ReindexController'
            }).
            when('/movealias', {
                templateUrl: 'partials/movealias.html',
                controller: 'MoveAliasController'
            }).
            when('/createalias', {
                templateUrl: 'partials/createalias.html',
                controller: 'CreateAliasController'
            }).
            when('/runningprocesses', {
                templateUrl: 'partials/runningprocesses.html',
                controller: 'RunningProcessesController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }]);

app.controller('ReindexController', ['$scope', '$http', "urls", "$location", "runningProcessesService", function ($scope, $http, urls, $location, runningProcessesService) {
    $http.get(urls.stats).success(function (response) {
        $scope.status = response;
    });
    angular.isDefined

    $scope.submit = function () {
        $http.put('/' + $scope.newIndex, $scope.mapping);
        $http.post('/' + $scope.oldIndex + '/' + urls.reindex + '/' + $scope.newIndex).success(function (response) {
            $scope.newIndex = "";
            $scope.oldIndex = "";
            $scope.mapping = "";
            $location.path("/runningprocesses");
        });
    }

    $scope.oldIndexChanged = function () {
        var regex = /(.*)-v-([0-9]+)/g;
        var match = regex.exec($scope.oldIndex);
        if (match != null && match.length == 3) {
            var version = parseInt(match[2]) + 1
            $scope.newIndex = match[1] + "-v-" + version;
        } else {
            $scope.newIndex = $scope.oldIndex + "-v-1";
        }
        $http.get('/' + $scope.oldIndex + "/_settings,_mappings").success(function (response) {
            console.log(response);
            $scope.mapping = JSON.stringify(response[$scope.oldIndex], null, 4);
        });
    };


}]);

app.controller('MoveAliasController', ['$scope', '$http',"urls",  function ($scope, $http, urls) {
    $http.get('/_stats').success(function (response) {
        $scope.status = response;
        $scope.aliases = []
    });
    angular.isDefined

    $scope.submit = function () {
        var moveAlias = '{' +
            '"actions" : [' +
            '{ "remove" : { "index" : "' + $scope.from + '", "alias" : "' + $scope.alias + '" } },' +
            '{ "add" : { "index" : "' + $scope.to + '", "alias" : "' + $scope.alias + '" } }' +
            ']' +
            '}';
        $http.post(urls.aliases, moveAlias).success(function (response) {
            $scope.from = "";
            $scope.to = "";
            $scope.alias = "";
        });
    }

    $scope.fromIndexChanged = function () {
        $http.get('/' + $scope.from + urls.aliases).success(function (response) {
            $scope.aliases = response[$scope.from].aliases;
        });
    };


}]);

app.controller('CreateAliasController', ['$scope', '$http',"urls",  function ($scope, $http, urls) {
    $http.get(urls.stats).success(function (response) {
        $scope.status = response;
    });
    angular.isDefined

    $scope.submit = function () {
        var createAlias = '{' +
            '"actions" : [' +
            '{ "add" : { "index" : "' + $scope.index + '", "alias" : "' + $scope.alias + '" } }' +
            ']' +
            '}';
        $http.post(urls.aliases, createAlias).success(function (response) {
            $scope.index = "";
            $scope.alias = "";
        });
    };
}]);

app.controller('RunningProcessesController', ['$scope', '$http',"urls", "runningProcessesService",  function ($scope, $http, urls, runningProcessesService) {
    loadRunningProcesses();

    $scope.delete = function(name) {
       $http.delete('/' + urls.reindex + '/' + name).success(function(response) {
            loadRunningProcesses();
        });
    }

    function loadRunningProcesses() {
        $http.get('/' + urls.reindex).success(function (response) {
            $scope.runningProcesses = response;
        });
    }
}]);

app.controller('HeaderController', ['$scope', '$route', '$location', function ($scope, $route, $location) {
    angular.isDefined

    $scope.click = function (current) {
        return current === $location.path();
    };
}]);

app.factory('runningProcessesService', function() {
    var savedData = new Array()
    function addProcess(process) {
        savedData[process.name] = process;
    }

    function get(name) {
        return savedData[name];
    }
});

