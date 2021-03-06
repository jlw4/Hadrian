'use strict';

/* Controllers */

var hadrianControllers = angular.module('hadrianControllers', []);

var tree;
var selectTreeNode = function (id) {
    var n = tree.get_first_branch();
    if (n) {
        while (true) {
            if (n === null) {
                return;
            }
            if (n.data.id === id) {
                tree.select_branch(n);
                return;
            }
            n = tree.get_next_branch(n);
        }
    } else {
        window.setTimeout(function () {
            selectTreeNode(id)
        }, 100);
    }
};

hadrianControllers.controller('MenuCtrl', ['$scope', '$location', 'Tree',
    function ($scope, $location, Tree) {
        $scope.my_tree_handler = function (branch) {
            if (branch.data.id < 0) {
                $location.path(branch.data.type);
            } else {
                $location.path(branch.data.type + '/' + branch.data.id);
            }
        };
        $scope.my_data = Tree.query();
        $scope.my_tree = tree = {};
    }]);

hadrianControllers.controller('HomeCtrl', ['$scope',
    function ($scope) {
    }]);

hadrianControllers.controller('GraphCtrl', ['$scope', '$http', 'Services',
    function ($scope, $http, Services) {
        selectTreeNode("-2");

        $scope.services = Services.get();

        $scope.formGraph = {};
        $scope.formGraph.style = "all";
        $scope.formGraph.service = null;

        $scope.doGraph = function () {
            if ($scope.formGraph.style == "all") {
                var responsePromise = $http.get("/v1/graph/all", {});
                responsePromise.success(function (dot, status, headers, config) {
                    document.getElementById("viz").innerHTML = Viz(dot);
                });
            } else if ($scope.formGraph.style == "fanIn") {
                var responsePromise = $http.get("/v1/graph/fanin/" + $scope.formGraph.service.serviceId, {});
                responsePromise.success(function (dot, status, headers, config) {
                    document.getElementById("viz").innerHTML = Viz(dot);
                });
            } else if ($scope.formGraph.style == "fanOut") {
                var responsePromise = $http.get("/v1/graph/fanout/" + $scope.formGraph.service.serviceId, {});
                responsePromise.success(function (dot, status, headers, config) {
                    document.getElementById("viz").innerHTML = Viz(dot);
                });
            }
        }
    }]);

hadrianControllers.controller('ParametersCtrl', ['$scope', 'Config',
    function ($scope, Config) {
        $scope.config = Config.get();
        selectTreeNode("-8");
    }]);

hadrianControllers.controller('WorkItemsCtrl', ['$scope', '$http', '$route', 'WorkItem',
    function ($scope, $http, $route, WorkItem) {
        selectTreeNode("-6");

        $scope.workItemSortType = 'requestDate';
        $scope.workItemSortReverse = false;
        $scope.workItemSearch = '';

        $scope.formSelectWorkItem = {};

        $scope.workItems = WorkItem.get();

        $scope.completeWorkItem = function () {
            for (var key in $scope.workItems.workItems) {
                var wi = $scope.workItems.workItems[key];
                for (var key2 in $scope.formSelectWorkItem) {
                    if (wi.id == key2 && $scope.formSelectWorkItem[key2]) {
                        var dataObject = {
                            requestId: wi.id,
                            status: "success",
                            errorCode: 0,
                            errorDescription: " ",
                            output: "Manually performed"
                        };
                        $http.post("/webhook/callback", dataObject, {});
                    }
                }
            }
            $route.reload();
        };

        $scope.cancelWorkItem = function () {
            for (var key in $scope.workItems.workItems) {
                var wi = $scope.workItems.workItems[key];
                for (var key2 in $scope.formSelectWorkItem) {
                    if (wi.id == key2 && $scope.formSelectWorkItem[key2]) {
                        var dataObject = {
                            requestId: wi.id,
                            status: "error",
                            errorCode: 0,
                            errorDescription: " ",
                            output: "Manually performed"
                        };
                        $http.post("/webhook/callback", dataObject, {});
                    }
                }
            }
            $route.reload();
        };

    }]);

hadrianControllers.controller('UsersCtrl', ['$scope', '$route', '$uibModal', 'User',
    function ($scope, $route, $uibModal, User) {
        selectTreeNode("-5");

        $scope.userSortType = 'username';
        $scope.userSortReverse = false;
        
        $scope.users = User.get();

        $scope.openAddTeamModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/addTeam.html',
                controller: 'ModalAddTeamCtrl',
                resolve: {
                    users: function () {
                        return $scope.users;
                    }
                }
            });
            modalInstance.result.then(function () {
                $route.reload();
            }, function () {
            });
        };

        $scope.openUpdateUserModal = function (user) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/updateUser.html',
                controller: 'ModalUpdateUserCtrl',
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });
            modalInstance.result.then(function () {
                $route.reload();
            }, function () {
            });
        };
    }]);

hadrianControllers.controller('ModalAddTeamCtrl', ['$scope', '$http', '$modalInstance', '$window', 'users',
    function ($scope, $http, $modalInstance, $window, users) {
        $scope.users = users;
        $scope.errorMsg = null;

        $scope.formSaveTeam = {};
        $scope.formSaveTeam.name = "";
        $scope.formSaveTeam.email = "";
        $scope.formSaveTeam.irc = "";
        $scope.formSaveTeam.slack = "";
        $scope.formSaveTeam.gitGroup = "";
        $scope.formSaveTeam.calendarId = "";
        $scope.formSaveTeam.user = users.users[0];

        $scope.save = function () {
            var dataObject = {
                teamName: $scope.formSaveTeam.name,
                teamEmail: $scope.formSaveTeam.email,
                teamIrc: $scope.formSaveTeam.irc,
                teamSlack: $scope.formSaveTeam.slack,
                gitGroup: $scope.formSaveTeam.gitGroup,
                calendarId: $scope.formSaveTeam.calendarId,
                user: $scope.formSaveTeam.user
            };

            var responsePromise = $http.post("/v1/team/create", dataObject, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                $modalInstance.close();
                $window.location.reload();
            });
            responsePromise.error(function (data, status, headers, config) {
                $scope.errorMsg = data;
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

hadrianControllers.controller('ModalUpdateUserCtrl', ['$scope', '$http', '$modalInstance', '$route', 'user',
    function ($scope, $http, $modalInstance, $route, user) {
        $scope.user = user;
        $scope.errorMsg = null;

        $scope.formUpdateUser = {};
        $scope.formUpdateUser.username = user.username;
        $scope.formUpdateUser.fullName = user.fullName;
        $scope.formUpdateUser.admin = user.admin;
        $scope.formUpdateUser.deploy = user.deploy;
        $scope.formUpdateUser.audit = user.audit;

        $scope.save = function () {
            var dataObject = {
                username: $scope.user.username,
                fullName: $scope.formUpdateUser.fullName,
                admin: $scope.formUpdateUser.admin,
                deploy: $scope.formUpdateUser.deploy,
                audit: $scope.formUpdateUser.audit
            };

            var responsePromise = $http.put("/v1/user/modify", dataObject, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                $modalInstance.close();
                $route.reload();
            });
            responsePromise.error(function (data, status, headers, config) {
                $scope.errorMsg = data;
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    }]);

hadrianControllers.controller('HelpCtrl', ['$scope',
    function ($scope) {
    }]);
