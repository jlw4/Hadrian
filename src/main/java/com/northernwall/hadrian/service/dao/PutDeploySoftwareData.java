/*
 * Copyright 2015 Richard Thurston.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.northernwall.hadrian.service.dao;

import java.util.HashMap;
import java.util.Map;

/**
 *
 * @author Richard Thurston
 */
public class PutDeploySoftwareData {
    public String serviceId;
    public String version;
    public String reason;
    public Map<String, String> hosts = new HashMap<>();
    public String network;
    public String moduleId;

}
