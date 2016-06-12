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
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

public class GetVipDetailsData {
    public Map<String, String> address = new HashMap<>();
    public Map<String, String> name = new HashMap<>();
    public List<GetVipDetailRowData> rows = new LinkedList<>();

    public GetVipDetailRowData find(String hostName) {
        for (GetVipDetailRowData data : rows) {
            if (data.hostName.equalsIgnoreCase(hostName)) {
                return data;
            }
        }
        GetVipDetailRowData data = new GetVipDetailRowData();
        data.hostName = hostName;
        rows.add(data);
        return data;
    }
    
}