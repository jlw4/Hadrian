'use strict';

/* Controllers */

var soaRepControllers = angular.module('soaRepControllers', []);

soaRepControllers.controller('ServiceListCtrl', ['$scope', 'Config', 'Service',
    function($scope, Config, Service) {
        $scope.config = Config.get();

        $scope.services = Service.query();
    }]);

soaRepControllers.controller('ServiceDetailCtrl', ['$scope', '$routeParams', '$http', 'Config', 'Service',
    function($scope, $routeParams, $http, Config, Service) {
        $scope.config = Config.get();

        $scope.service = Service.get({serviceId: $routeParams.serviceId}, function(service) {
            $scope.mainImageUrl = service.imageLogo;
            service.envs.forEach(function(env) {
                env.hosts.forEach(function(host) {
                    host.implVersion = "Loading...";
                    var responsePromise = $http.get("/services/" + service._id + "/envs/" + env.name + "/hosts/" + host.name + ".json", {});
                    responsePromise.success(function(dataFromServer, status, headers, config) {
                        host.implVersion = dataFromServer;
                    });
                });
            });
        });
        $scope.setImage = function(imageUrl) {
            $scope.mainImageUrl = imageUrl;
        };
    }]);

soaRepControllers.controller('ServiceCreateCtrl', ['$scope', 'Config', '$http', '$window',
    function($scope, Config, $http, $window) {
        $scope.config = Config.get();

        $scope.createForm = {};
        $scope.createForm.state = "Stateless";
        $scope.createForm.access = "Internal";
        $scope.createForm.type = "Service";
        $scope.createForm.status = "Proposed";

        $scope.submitCreateServiceForm = function(item, event) {
            if ($scope.createForm._id && $scope.createForm.name && $scope.createForm.team && $scope.createForm.product && $scope.createForm.description && $scope.createForm.api) {
                var dataObject = {
                    _id: $scope.createForm._id,
                    name: $scope.createForm.name,
                    team: $scope.createForm.team,
                    product: $scope.createForm.product,
                    description: $scope.createForm.description,
                    state: $scope.createForm.state,
                    access: $scope.createForm.access,
                    type: $scope.createForm.type,
                    tech: $scope.createForm.tech,
                    mavenUrl: $scope.createForm.mavenUrl,
                    versionUrl: $scope.createForm.versionUrl,
                    api: $scope.createForm.api,
                    status: $scope.createForm.status
                };

                var responsePromise = $http.post("/services/services.json", dataObject, {});
                responsePromise.success(function(dataFromServer, status, headers, config) {
                    console.log(dataFromServer.title);
                    $window.location.href = "#/services/" + $scope.createForm._id;
                });
                responsePromise.error(function(data, status, headers, config) {
                    alert("Submitting form failed!");
                });
            }
        };
    }]);

soaRepControllers.controller('ServiceEditCtrl', ['$scope', '$routeParams', 'Config', 'Service', '$http', '$window',
    function($scope, $routeParams, Config, Service, $http, $window) {
        $scope.config = Config.get();

        $scope.editForm = {};
        Service.get({serviceId: $routeParams.serviceId}, function(service) {
            $scope.editForm._id = service._id;
            $scope.editForm.name = service.name;
            $scope.editForm.team = service.team;
            $scope.editForm.product = service.product;
            $scope.editForm.description = service.description;
            $scope.editForm.state = service.state;
            $scope.editForm.access = service.access;
            $scope.editForm.type = service.type;
            $scope.editForm.tech = service.tech;
            $scope.editForm.links = service.links;
            $scope.editForm.links.push({name: "", url: ""});
            $scope.editForm.haRatings = service.haRatings;
            $scope.editForm.classRatings = service.classRatings;
            $scope.editForm.mavenUrl = service.mavenUrl;
            $scope.editForm.versionUrl = service.versionUrl;
            $scope.editForm.actions = service.actions;
            $scope.editForm.actions.push({name: ""});
        });

        $scope.addServiceLink = function(item, event) {
            $scope.editForm.links.push({name: "", url: ""});
        };

        $scope.addServiceAction = function(item, event) {
            $scope.editForm.actions.push({name: ""});
        };

        $scope.submitEditServiceForm = function(item, event) {
            var dataObject = {
                _id: $scope.editForm._id,
                name: $scope.editForm.name,
                team: $scope.editForm.team,
                product: $scope.editForm.product,
                description: $scope.editForm.description,
                state: $scope.editForm.state,
                access: $scope.editForm.access,
                type: $scope.editForm.type,
                tech: $scope.editForm.tech,
                endpoints: $scope.editForm.endpoints,
                links: $scope.editForm.links,
                dataCenters: $scope.editForm.dataCenters,
                haRatings: $scope.editForm.haRatings,
                classRatings: $scope.editForm.classRatings,
                mavenUrl: $scope.editForm.mavenUrl,
                versionUrl: $scope.editForm.versionUrl,
                actions: $scope.editForm.actions
            };

            var responsePromise = $http.post("/services/" + $scope.editForm._id + ".json", dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
                console.log(dataFromServer.title);
                $window.location.href = "#/services/" + $scope.editForm._id;
            });
            responsePromise.error(function(data, status, headers, config) {
                alert("Submitting form failed!");
            });
        };
    }]);

soaRepControllers.controller('ImageAddCtrl', ['$scope', '$routeParams', '$upload', '$http', '$window',
    function($scope, $routeParams, $upload, $http, $window) {
        $scope.serviceId = $routeParams.serviceId;
        $scope.progress = ' ';

        $scope.onFileSelect = function($files) {
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                $scope.upload = $upload.upload({
                    url: '/services/' + $routeParams.serviceId + '/image.json',
                    data: {myObj: $routeParams.serviceId},
                    file: file
                }).progress(function(evt) {
                    $scope.progress = 'Upload process: ' + parseInt(100.0 * evt.loaded / evt.total) + '%';
                }).success(function(data, status, headers, config) {
                    $window.location.href = "#/services/" + $routeParams.serviceId;
                });
            }
        };
    }]);

soaRepControllers.controller('VersionCreateCtrl', ['$scope', '$routeParams', '$http', '$window',
    function($scope, $routeParams, $http, $window) {
        $scope.createForm = {};
        $scope.createForm._id = $routeParams.serviceId;
        $scope.createForm.status = "Proposed";

        $scope.submitCreateVersionForm = function(item, event) {
            if ($scope.createForm.api) {
                var dataObject = {
                    _id: $scope.createForm._id,
                    api: $scope.createForm.api,
                    status: $scope.createForm.status
                };

                var responsePromise = $http.post("/services/" + $scope.createForm._id + "/versions.json", dataObject, {});
                responsePromise.success(function(dataFromServer, status, headers, config) {
                    console.log(dataFromServer.title);
                    $window.location.href = "#/services/" + $scope.createForm._id;
                });
                responsePromise.error(function(data, status, headers, config) {
                    alert("Submitting form failed!");
                });
            }
        };
    }]);

soaRepControllers.controller('VersionEditCtrl', ['$scope', '$routeParams', 'Service', '$http', '$window',
    function($scope, $routeParams, Service, $http, $window) {
        $scope.editForm = {};
        Service.get({serviceId: $routeParams.serviceId}, function(service) {
            $scope.editForm._id = service._id;
            if ("envs" in service) {
                if (service.envs.length > 0) {
                    $scope.editForm.envUrl = service.envs[0].vip;
                }
            }
            service.versions.forEach(function(version) {
                if (version.api === $routeParams.versionId) {
                    $scope.editForm.api = version.api;
                    $scope.editForm.status = version.status;
                    $scope.editForm.links = version.links;
                    $scope.editForm.links.push({name: "", url: ""});
                    $scope.editForm.operations = version.operations;
                    $scope.editForm.operations.push({name: "", url: ""});
                    var responsePromise = $http.get("/services/" + $scope.editForm._id + "/versions/" + $scope.editForm.api + "/uses.json", {});
                    responsePromise.success(function(dataFromServer, status, headers, config) {
                        $scope.editForm.uses1 = [];
                        $scope.editForm.uses2 = [];
                        $scope.editForm.uses3 = [];
                        dataFromServer.forEach(function(element, index) {
                            if (index % 3 === 0) {
                                $scope.editForm.uses1.push(element);
                            } else if (index % 3 === 1) {
                                $scope.editForm.uses2.push(element);
                            } else if (index % 3 === 2) {
                                $scope.editForm.uses3.push(element);
                            }
                        });
                    });
                }
            });
        });

        $scope.addVersionLink = function(item, event) {
            $scope.editForm.links.push({name: "", url: ""});
        };

        $scope.addVersionOperation = function(item, event) {
            $scope.editForm.operations.push({name: "", url: ""});
        };

        $scope.submitEditVersionForm = function(item, event) {
            var dataObject = {
                _id: $scope.editForm._id,
                api: $scope.editForm.api,
                status: $scope.editForm.status,
                links: $scope.editForm.links,
                operations: $scope.editForm.operations,
                uses1: $scope.editForm.uses1,
                uses2: $scope.editForm.uses2,
                uses3: $scope.editForm.uses3
            };

            var responsePromise = $http.post("/services/" + $scope.editForm._id + "/versions/" + $scope.editForm.api + ".json", dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
                console.log(dataFromServer.title);
                $window.location.href = "#/services/" + $scope.editForm._id;
            });
            responsePromise.error(function(data, status, headers, config) {
                alert("Submitting form failed!");
            });
        };
    }]);

soaRepControllers.controller('EnvCreateCtrl', ['$scope', '$routeParams', '$http', '$window',
    function($scope, $routeParams, $http, $window) {
        $scope.createForm = {};
        $scope.createForm._id = $routeParams.serviceId;

        $scope.submitCreateEnvForm = function(item, event) {
            if ($scope.createForm.name) {
                var dataObject = {
                    _id: $scope.createForm._id,
                    name: $scope.createForm.name,
                    vip: $scope.createForm.vip
                };

                var responsePromise = $http.post("/services/" + $scope.createForm._id + "/envs.json", dataObject, {});
                responsePromise.success(function(dataFromServer, status, headers, config) {
                    console.log(dataFromServer.title);
                    $window.location.href = "#/services/" + $scope.createForm._id;
                });
                responsePromise.error(function(data, status, headers, config) {
                    alert("Submitting form failed!");
                });
            }
        };
    }]);

soaRepControllers.controller('EnvEditCtrl', ['$scope', '$routeParams', 'Config', 'Service', '$http', '$window',
    function($scope, $routeParams, Config, Service, $http, $window) {
        $scope.config = Config.get();
        $scope.editForm = {};
        Service.get({serviceId: $routeParams.serviceId}, function(service) {
            $scope.editForm._id = service._id;
            service.envs.forEach(function(env) {
                if (env.name === $routeParams.env) {
                    $scope.editForm.name = env.name;
                    $scope.editForm.vip = env.vip;
                    $scope.editForm.hosts = env.hosts;
                    $scope.editForm.hosts.push({dataCenter: "", name: "", status: "Active"});
                }
            });
        });

        $scope.addHost = function(item, event) {
            $scope.editForm.hosts.push({dataCenter: "", name: "", status: "Active"});
        };

        $scope.submitEditEnvForm = function(item, event) {
            var dataObject = {
                _id: $scope.editForm._id,
                name: $scope.editForm.name,
                vip: $scope.editForm.vip,
                hosts: $scope.editForm.hosts
            };

            var responsePromise = $http.post("/services/" + $scope.editForm._id + "/envs/" + $scope.editForm.name + ".json", dataObject, {});
            responsePromise.success(function(dataFromServer, status, headers, config) {
                $window.location.href = "#/services/" + $scope.editForm._id;
            });
            responsePromise.error(function(data, status, headers, config) {
                alert("Submitting form failed!");
            });
        };
    }]);

soaRepControllers.controller('EnvManageCtrl', ['$scope', '$routeParams', 'Config', 'Service', '$http', '$window',
    function($scope, $routeParams, Config, Service, $http, $window) {
        $scope.config = Config.get();
        $scope.manageForm = {};
        Service.get({serviceId: $routeParams.serviceId}, function(service) {
            $scope.manageForm._id = service._id;
            $scope.manageForm.actions = service.actions;
            service.envs.forEach(function(env) {
                if (env.name === $routeParams.env) {
                    $scope.manageForm.name = env.name;
                    $scope.manageForm.hosts = env.hosts;
                }
            });
        });

        var responsePromise = $http.get("/services/" + $routeParams.serviceId + "/packageVersions.json", {});
        responsePromise.success(function(dataFromServer, status, headers, config) {
            $scope.versions = dataFromServer;
        });

        $scope.checkAllActions = function(item, event) {
            $scope.manageForm.actions.forEach(function(action) {
                action.check = true;
            });
        };

        $scope.uncheckAllActions = function(item, event) {
            $scope.manageForm.actions.forEach(function(action) {
                action.check = false;
            });
        };

        $scope.checkAllHosts = function(item, event) {
            $scope.manageForm.hosts.forEach(function(host) {
                host.check = true;
            });
        };

        $scope.uncheckAllHosts = function(item, event) {
            $scope.manageForm.hosts.forEach(function(host) {
                host.check = false;
            });
        };

        $scope.submitManageEnvForm = function(item, event) {

            var form = document.createElement("form");
            form.action = "/manage";
            form.method = "post";
            form.target = "_blank";
            form.style.display = 'none';

            var inputApp = document.createElement("textarea");
            inputApp.name = "app";
            inputApp.value = $scope.manageForm._id;
            form.appendChild(inputApp);

            var inputEnv = document.createElement("textarea");
            inputEnv.name = "env";
            inputEnv.value = $scope.manageForm.name;
            form.appendChild(inputEnv);

            var inputUsername = document.createElement("textarea");
            inputUsername.name = "username";
            inputUsername.value = $('#username').val();
            form.appendChild(inputUsername);

            var inputPassword = document.createElement("textarea");
            inputPassword.name = "password";
            inputPassword.value = $('#password').val();
            form.appendChild(inputPassword);

            var inputVer = document.createElement("textarea");
            inputVer.name = "version";
            inputVer.value = $scope.manageForm.version;
            form.appendChild(inputVer);

            var actions = "";
            $scope.manageForm.actions.forEach(function(action) {
                if (action.check) {
                    actions = actions + action.name + ",";
                }
            });

            var inputActions = document.createElement("textarea");
            inputActions.name = "actions";
            inputActions.value = actions;
            form.appendChild(inputActions);

            var hosts = "";
            $scope.manageForm.hosts.forEach(function(host) {
                if (host.check) {
                    hosts = hosts + host.name + ",";
                }
            });

            var inputHosts = document.createElement("textarea");
            inputHosts.name = "hosts";
            inputHosts.value = hosts;
            form.appendChild(inputHosts);

            document.body.appendChild(form);
            form.submit();

            $window.location.href = "#/services/" + $scope.manageForm._id;
        };
    }]);

soaRepControllers.controller('ServiceGraphCtrl', ['$scope', 'Graph',
    function($scope, Graph) {
        $scope.data = Graph.query();
        $scope.options = {navigation: true, width: '100%', height: '600px'};
    }]);

soaRepControllers.controller('ServiceHelpCtrl', ['$scope', 'Config',
    function($scope, Config) {
        $scope.config = Config.get();
    }]);

