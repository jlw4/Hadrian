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
package com.northernwall.hadrian.service;

import com.google.gson.stream.JsonWriter;
import com.northernwall.hadrian.access.AccessHelper;
import com.northernwall.hadrian.db.DataAccess;
import com.northernwall.hadrian.domain.Module;
import com.northernwall.hadrian.domain.ModuleFile;
import com.northernwall.hadrian.domain.Service;
import com.northernwall.hadrian.domain.User;
import com.northernwall.hadrian.service.dao.GetModuleFileData;
import com.northernwall.hadrian.utilityHandlers.routingHandler.Http400BadRequestException;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.eclipse.jetty.server.Request;

/**
 *
 * @author Richard Thurston
 */
public class ModuleFileGetHandler extends BasicHandler {

    private final AccessHelper accessHelper;

    public ModuleFileGetHandler(AccessHelper accessHelper, DataAccess dataAccess) {
        super(dataAccess);
        this.accessHelper = accessHelper;
    }

    @Override
    public void handle(String target, Request request, HttpServletRequest httpRequest, HttpServletResponse response) throws IOException, ServletException {
        Service service = getService(request);
        Module module = getModule(request, service);
        accessHelper.checkIfUserCanModify(request, service.getTeamId(), "manage file for module");
        String network = request.getParameter("network");
        if (network == null || network.isEmpty()) {
            throw new Http400BadRequestException("parameter network is missing");
        }

        GetModuleFileData getModuleFileData = new GetModuleFileData();
        ModuleFile moduleFile = getDataAccess().getModuleFile(service.getServiceId(), module.getModuleId(), network);
        if (moduleFile == null) {
            getModuleFileData.name = "";
            getModuleFileData.contents = "";
        } else {
            getModuleFileData.name = moduleFile.getName();
            getModuleFileData.contents = moduleFile.getContents();
        }

        try (JsonWriter jw = new JsonWriter(new OutputStreamWriter(response.getOutputStream()))) {
            getGson().toJson(getModuleFileData, GetModuleFileData.class, jw);
        }
        response.setStatus(200);
        request.setHandled(true);
    }
}
