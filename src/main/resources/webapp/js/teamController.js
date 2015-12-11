'use strict';

/* Controllers */

soaRepControllers.controller('TeamCtrl', ['$scope', '$routeParams', '$uibModal', '$http', 'User', 'Team',
    function ($scope, $routeParams, $uibModal, $http, User, Team) {
        selectTreeNode($routeParams.teamId);

        $scope.users = User.get();

        Team.get({teamId: $routeParams.teamId}, function (team) {
            $scope.team = team;
        });

        $scope.openAddUserModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/addUserToTeam.html',
                controller: 'ModalAddUserToTeamCtrl',
                resolve: {
                    users: function () {
                        return $scope.users;
                    },
                    team: function () {
                        return $scope.team;
                    }
                }
            });
            modalInstance.result.then(function () {
                $location.path('/ui/#/tree', true);
            }, function () {
            });
        };

        $scope.removeUserFromTeam = function (username) {
            var responsePromise = $http.delete("/v1/team/" + $scope.team.teamId + "/" + username, {}, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                $modalInstance.close();
            });
            responsePromise.error(function (data, status, headers, config) {
                alert("Request to create new team has failed!");
            });
        };

        $scope.openAddServiceModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/addService.html',
                controller: 'ModalAddServiceCtrl',
                resolve: {
                    team: function () {
                        return $scope.team;
                    }
                }
            });
            modalInstance.result.then(function () {
                $location.path('/ui/#/tree', true);
            }, function () {
            });
        };
    }]);

soaRepControllers.controller('ModalAddUserToTeamCtrl',
        function ($scope, $http, $modalInstance, $route, users, team) {
            $scope.users = users;
            $scope.team = team;

            $scope.formAddUserToTeam = {};
            $scope.formAddUserToTeam.user = "";

            $scope.save = function () {
                var responsePromise = $http.put("/v1/team/" + $scope.team.teamId + "/" + $scope.formAddUserToTeam.user.username, {}, {});
                responsePromise.success(function (dataFromServer, status, headers, config) {
                    $modalInstance.close();
                    $route.reload();
                });
                responsePromise.error(function (data, status, headers, config) {
                    alert("Request to create new team has failed!");
                });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });

soaRepControllers.controller('ModalAddServiceCtrl',
        function ($scope, $http, $modalInstance, $window, Config, team) {
            Config.get({}, function (config) {
                $scope.config = config;

                $scope.team = team;

                $scope.formSaveService = {};
                $scope.formSaveService.serviceAbbr = "";
                $scope.formSaveService.serviceName = "";
                $scope.formSaveService.description = "";
                $scope.formSaveService.runAs = "";
                $scope.formSaveService.gitPath = "";
                $scope.formSaveService.mavenGroupId = "";
                $scope.formSaveService.mavenArtifactId = "";
                $scope.formSaveService.artifactType = "";
                $scope.formSaveService.artifactSuffix = "";
                $scope.formSaveService.versionUrl = "{host}.mydomain.com:9090/version";
                $scope.formSaveService.availabilityUrl = "{host}.mydomain.com:9090/availability";
                $scope.formSaveService.startCmdLine = "start";
                $scope.formSaveService.stopCmdLine = "stop";

                $scope.save = function () {
                    var dataObject = {
                        serviceAbbr: $scope.formSaveService.serviceAbbr,
                        serviceName: $scope.formSaveService.serviceName,
                        teamId: $scope.team.teamId,
                        description: $scope.formSaveService.description,
                        runAs: $scope.formSaveService.runAs,
                        gitPath: $scope.formSaveService.gitPath,
                        mavenGroupId: $scope.formSaveService.mavenGroupId,
                        mavenArtifactId: $scope.formSaveService.mavenArtifactId,
                        artifactType: $scope.formSaveService.artifactType,
                        artifactSuffix: $scope.formSaveService.artifactSuffix,
                        versionUrl: $scope.formSaveService.versionUrl,
                        availabilityUrl: $scope.formSaveService.availabilityUrl,
                        startCmdLine: $scope.formSaveService.startCmdLine,
                        stopCmdLine: $scope.formSaveService.stopCmdLine
                    };

                    var responsePromise = $http.post("/v1/service/service", dataObject, {});
                    responsePromise.success(function (dataFromServer, status, headers, config) {
                        $modalInstance.close();
                        $window.location.reload();
                    });
                    responsePromise.error(function (data, status, headers, config) {
                        alert("Request to create new service has failed!");
                    });
                };

                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            });
        });