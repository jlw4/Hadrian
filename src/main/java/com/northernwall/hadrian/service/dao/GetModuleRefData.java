/*
 * Copyright 2014 Richard Thurston.
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

import com.northernwall.hadrian.domain.ModuleRef;

public class GetModuleRefData implements Comparable<GetModuleRefData> {
    public String clientServiceId;
    public String clientModuleId;
    public String serverServiceId;
    public String serverModuleId;
    public String serviceName;
    public String moduleName;

    public static GetModuleRefData create(ModuleRef ref) {
        GetModuleRefData temp = new GetModuleRefData();
        temp.clientServiceId = ref.getClientServiceId();
        temp.clientModuleId = ref.getClientModuleId();
        temp.serverServiceId = ref.getServerServiceId();
        temp.serverModuleId = ref.getServerModuleId();
        return temp;
    }

    @Override
    public int compareTo(GetModuleRefData o) {
        int temp = serviceName.compareTo(o.serviceName);
        if (temp == 0) {
            return moduleName.compareTo(o.moduleName);
        }
        return temp;
    }

}
