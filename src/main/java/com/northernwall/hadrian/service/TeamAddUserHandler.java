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
package com.northernwall.hadrian.service;

import com.northernwall.hadrian.access.AccessHelper;
import com.northernwall.hadrian.db.DataAccess;
import com.northernwall.hadrian.domain.Team;
import com.northernwall.hadrian.utilityHandlers.routingHandler.Http404NotFoundException;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.handler.AbstractHandler;

public class TeamAddUserHandler extends AbstractHandler {

    private final AccessHelper accessHelper;
    private final DataAccess dataAccess;

    public TeamAddUserHandler(AccessHelper accessHelper, DataAccess dataAccess) {
        this.accessHelper = accessHelper;
        this.dataAccess = dataAccess;
    }

    @Override
    public void handle(String target, Request request, HttpServletRequest httpRequest, HttpServletResponse response) throws IOException, ServletException {
        String temp = target.substring(9, target.length());
        int i = temp.indexOf("/");
        String teamId = temp.substring(0, i);
        String username = temp.substring(i + 1);
        accessHelper.checkIfUserCanModify(request, teamId, "add user to team");
        if (dataAccess.getUser(username) == null) {
            throw new Http404NotFoundException("Failed to add user " + username + " to team " + teamId + ", could not find user");
        }
        Team team = dataAccess.getTeam(teamId);
        if (team == null) {
            throw new Http404NotFoundException("Failed to add user " + username + " to team " + teamId + ", could not find team");
        }
        team.getUsernames().add(username);
        dataAccess.updateTeam(team);
        response.setStatus(200);
        request.setHandled(true);
    }

}