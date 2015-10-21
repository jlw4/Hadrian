'use strict';

/* Controllers */

var soaRepControllers = angular.module('soaRepControllers', []);

soaRepControllers.controller('TreeCtrl', ['$scope', '$http', '$location', '$uibModal', 'Tree', 'Team', 'Service', 'DataStore',
    function ($scope, $http, $location, $uibModal, Tree, Team, Service, DataStore) {
        //$scope.config = Config.get();

        $scope.my_tree_handler = function (branch) {
            $scope.displayTeam = false;
            $scope.displayService = false;
            $scope.displayDataStore = false;
            $scope.displayLoading = true;
            if (branch.data.type === "Team") {
                Team.get({teamId: branch.data.id}, function (team) {
                    $scope.team = team;
                    $scope.displayLoading = false;
                    $scope.displayTeam = true;
                });
            } else if (branch.data.type === "Services") {
                $scope.displayLoading = false;
            } else if (branch.data.type === "Service") {
                Service.get({serviceId: branch.data.id}, function (service) {
                    $scope.labelService = service;
                    $scope.displayLoading = false;
                    $scope.displayService = true;
                });
            } else if (branch.data.type === "DataStores") {
                $scope.displayLoading = false;
            } else if (branch.data.type === "DataStore") {
                DataStore.get({dataStoreId: branch.data.id}, function (dataStore) {
                    $scope.labelDataStore = dataStore;
                    $scope.displayLoading = false;
                    $scope.displayDataStore = true;
                });
            } else {
                $scope.displayLoading = false;
            }
            $scope.formSelectVip = {};
            $scope.formSelectHost = {};
        };

        $scope.my_data = Tree.query();

        var tree;
        $scope.my_tree = tree = {};

        $scope.selectTreeNode = function (id) {
            var n;
            n = tree.get_first_branch();
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
        };

        $scope.refresh = function () {
            $scope.my_tree_handler(tree.get_selected_branch());
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

        $scope.formSelectVip = {};
        $scope.formSelectHost = {};

        $scope.openAddUsesModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/addUses.html',
                controller: 'ModalAddUsesCtrl',
                resolve: {
                    service: function () {
                        return $scope.labelService;
                    }
                }
            });
            modalInstance.result.then(function () {
                $scope.my_tree_handler(tree.get_selected_branch());
            }, function () {
            });
        };

        $scope.deleteServiceRef = function (clientId, serviceId) {
            var responsePromise = $http.delete("/v1/service/" + clientId + "/uses/" + serviceId, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                $scope.my_tree_handler(tree.get_selected_branch());
            });
            responsePromise.error(function (data, status, headers, config) {
                alert("Request to delete host has failed!");
                $scope.my_tree_handler(tree.get_selected_branch());
            });
        };

        $scope.openAddVipModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/addVip.html',
                controller: 'ModalAddVipCtrl',
                resolve: {
                    service: function () {
                        return $scope.labelService;
                    }
                }
            });
            modalInstance.result.then(function () {
                $scope.my_tree_handler(tree.get_selected_branch());
            }, function () {
            });
        };

        $scope.openUpdateVipModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/updateVip.html',
                controller: 'ModalUpdateVipCtrl',
                resolve: {
                    service: function () {
                        return $scope.labelService;
                    },
                    vips: function () {
                        return $scope.formSelectVip;
                    }
                }
            });
            modalInstance.result.then(function () {
                $scope.my_tree_handler(tree.get_selected_branch());
            }, function () {
            });
        };

        $scope.deleteVip = function (id) {
            var responsePromise = $http.delete("/v1/vip/" + id, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                $scope.my_tree_handler(tree.get_selected_branch());
            });
            responsePromise.error(function (data, status, headers, config) {
                alert("Request to delete host has failed!");
                $scope.my_tree_handler(tree.get_selected_branch());
            });
        };

        $scope.openAddHostModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/addHost.html',
                controller: 'ModalAddHostCtrl',
                resolve: {
                    service: function () {
                        return $scope.labelService;
                    }
                }
            });
            modalInstance.result.then(function () {
                $scope.my_tree_handler(tree.get_selected_branch());
            }, function () {
            });
        };

        $scope.openUpdateHostModal = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'partials/updateHost.html',
                controller: 'ModalUpdateHostCtrl',
                resolve: {
                    service: function () {
                        return $scope.labelService;
                    },
                    hosts: function () {
                        return $scope.formSelectHost;
                    }
                }
            });
            modalInstance.result.then(function () {
                $scope.my_tree_handler(tree.get_selected_branch());
            }, function () {
            });
        };

        $scope.restartHost = function () {
            var dataObject = {
                serviceId: $scope.labelService.serviceId,
                hosts: $scope.formSelectHost
            };

            var responsePromise = $http.put("/v1/host/restart", dataObject, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                $scope.my_tree_handler(tree.get_selected_branch());
            });
            responsePromise.error(function (data, status, headers, config) {
                alert("Request to create new host has failed!");
                $scope.my_tree_handler(tree.get_selected_branch());
            });
        }

        $scope.deleteHost = function (id) {
            var responsePromise = $http.delete("/v1/host/" + id, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                $scope.my_tree_handler(tree.get_selected_branch());
            });
            responsePromise.error(function (data, status, headers, config) {
                alert("Request to delete host has failed!");
                $scope.my_tree_handler(tree.get_selected_branch());
            });
        };

        $scope.addHostToVip = function () {
            var dataObject = {
                serviceId: $scope.labelService.serviceId,
                vips: $scope.formSelectVip,
                hosts: $scope.formSelectHost
            };

            var responsePromise = $http.post("/v1/host/vips", dataObject, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                $scope.my_tree_handler(tree.get_selected_branch());
            });
            responsePromise.error(function (data, status, headers, config) {
                alert("Request to create new host has failed!");
                $scope.my_tree_handler(tree.get_selected_branch());
            });
        }

        $scope.deleteHostFromVip = function (hostId, vipId) {
            var responsePromise = $http.delete("/v1/host/" + hostId + "/" + vipId, {});
            responsePromise.success(function (dataFromServer, status, headers, config) {
                $scope.my_tree_handler(tree.get_selected_branch());
            });
            responsePromise.error(function (data, status, headers, config) {
                alert("Request to delete host has failed!");
                $scope.my_tree_handler(tree.get_selected_branch());
            });
        }
    }]);

soaRepControllers.controller('ModalAddServiceCtrl',
        function ($scope, $http, $modalInstance, team) {
            $scope.team = team;

            $scope.formSaveService = {};
            $scope.formSaveService.serviceAbbr = "";
            $scope.formSaveService.serviceName = "";
            $scope.formSaveService.description = "";
            $scope.formSaveService.mavenGroupId = "";
            $scope.formSaveService.mavenArtifactId = "";
            $scope.formSaveService.versionUrl = ":9090/version";
            $scope.formSaveService.availabilityUrl = ":9090/availability";

            $scope.save = function () {
                var dataObject = {
                    serviceAbbr: $scope.formSaveService.serviceAbbr,
                    serviceName: $scope.formSaveService.serviceName,
                    teamId: $scope.team.teamId,
                    description: $scope.formSaveService.description,
                    mavenGroupId: $scope.formSaveService.mavenGroupId,
                    mavenArtifactId: $scope.formSaveService.mavenArtifactId,
                    versionUrl: $scope.formSaveService.versionUrl,
                    availabilityUrl: $scope.formSaveService.availabilityUrl
                };

                var responsePromise = $http.post("/v1/service/service", dataObject, {});
                responsePromise.success(function (dataFromServer, status, headers, config) {
                    $modalInstance.close();
                });
                responsePromise.error(function (data, status, headers, config) {
                    alert("Request to create new service has failed!");
                });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });

soaRepControllers.controller('ModalAddUsesCtrl',
        function ($scope, $http, $modalInstance, ServiceNotUses, service) {
            $scope.service = service;
            $scope.formSelectUses = {};

            ServiceNotUses.get({serviceId: service.serviceId}, function (notUses) {
                $scope.notUses = notUses;
            });
                
            $scope.save = function () {
                var dataObject = {
                    uses: $scope.formSelectUses
                };

                var responsePromise = $http.post("/v1/service/"+$scope.service.serviceId+"/ref", dataObject, {});
                responsePromise.success(function (dataFromServer, status, headers, config) {
                    $modalInstance.close();
                });
                responsePromise.error(function (data, status, headers, config) {
                    alert("Request to create new vip has failed!");
                });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });

soaRepControllers.controller('ModalAddVipCtrl',
        function ($scope, $http, $modalInstance, service) {
            $scope.service = service;

            $scope.formSaveVip = {};
            $scope.formSaveVip.vipName = "";
            $scope.formSaveVip.dns = "";
            $scope.formSaveVip.external = false;
            $scope.formSaveVip.network = "prd";
            $scope.formSaveVip.protocol = "HTTP";
            $scope.formSaveVip.vipPort = 80;
            $scope.formSaveVip.servicePort = 8080;

            $scope.save = function () {
                var dataObject = {
                    vipName: $scope.formSaveVip.vipName,
                    serviceId: $scope.service.serviceId,
                    dns: $scope.formSaveVip.dns,
                    external: $scope.formSaveVip.external,
                    network: $scope.formSaveVip.network,
                    protocol: $scope.formSaveVip.protocol,
                    vipPort: $scope.formSaveVip.vipPort,
                    servicePort: $scope.formSaveVip.servicePort
                };

                var responsePromise = $http.post("/v1/vip/vip", dataObject, {});
                responsePromise.success(function (dataFromServer, status, headers, config) {
                    $modalInstance.close();
                });
                responsePromise.error(function (data, status, headers, config) {
                    alert("Request to create new vip has failed!");
                });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });

soaRepControllers.controller('ModalUpdateVipCtrl',
        function ($scope, $http, $modalInstance, service, vips) {
            $scope.service = service;
            $scope.vips = vips;

            $scope.formUpdateVip = {};
            $scope.formUpdateVip.external = false;
            $scope.formUpdateVip.servicePort = 8080;

            $scope.save = function () {
                var dataObject = {
                    serviceId: $scope.service.serviceId,
                    external: $scope.formUpdateVip.external,
                    servicePort: $scope.formUpdateVip.servicePort,
                    vips: $scope.vips
                };

                var responsePromise = $http.put("/v1/vip/vip", dataObject, {});
                responsePromise.success(function (dataFromServer, status, headers, config) {
                    $modalInstance.close();
                });
                responsePromise.error(function (data, status, headers, config) {
                    alert("Request to update vips has failed!");
                });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });

soaRepControllers.controller('ModalAddHostCtrl',
        function ($scope, $http, $modalInstance, service) {
            $scope.service = service;

            $scope.formSaveHost = {};
            $scope.formSaveHost.dataCenter = "";
            $scope.formSaveHost.network = "";
            $scope.formSaveHost.env = "";
            $scope.formSaveHost.size = "";
            $scope.formSaveHost.version = "";

            $scope.save = function () {
                var dataObject = {
                    serviceId: $scope.service.serviceId,
                    dataCenter: $scope.formSaveHost.dataCenter,
                    network: $scope.formSaveHost.network,
                    env: $scope.formSaveHost.env,
                    size: $scope.formSaveHost.size,
                    version: $scope.formSaveHost.version
                };

                var responsePromise = $http.post("/v1/host/host", dataObject, {});
                responsePromise.success(function (dataFromServer, status, headers, config) {
                    $modalInstance.close();
                });
                responsePromise.error(function (data, status, headers, config) {
                    alert("Request to create new host has failed!");
                });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });

soaRepControllers.controller('ModalUpdateHostCtrl',
        function ($scope, $http, $modalInstance, service, hosts) {
            $scope.service = service;
            $scope.hosts = hosts;

            $scope.formUpdateHost = {};
            $scope.formUpdateHost.env = "";
            $scope.formUpdateHost.size = "";
            $scope.formUpdateHost.version = "";

            $scope.save = function () {
                var dataObject = {
                    serviceId: $scope.service.serviceId,
                    env: $scope.formUpdateHost.env,
                    size: $scope.formUpdateHost.size,
                    version: $scope.formUpdateHost.version,
                    hosts: $scope.hosts
                };

                var responsePromise = $http.put("/v1/host/host", dataObject, {});
                responsePromise.success(function (dataFromServer, status, headers, config) {
                    $modalInstance.close();
                });
                responsePromise.error(function (data, status, headers, config) {
                    alert("Request to update hosts has failed!");
                });
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('cancel');
            };
        });

soaRepControllers.controller('GraphCtrl', ['$scope', 'Graph',
    function ($scope, Graph) {
        $scope.data = Graph.query();
        $scope.options = {navigation: true, width: '100%', height: '600px'};
    }]);

soaRepControllers.controller('AdminCtrl', ['$scope', 'Config',
    function ($scope, Config) {
        $scope.config = Config.get();
    }]);

soaRepControllers.controller('HelpCtrl', ['$scope', 'Config',
    function ($scope, Config) {
        $scope.config = Config.get();
    }]);

