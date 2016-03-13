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

package com.northernwall.hadrian.utilityHandlers;

import com.northernwall.hadrian.calendar.CalendarHelper;
import com.northernwall.hadrian.db.DataAccess;
import com.northernwall.hadrian.maven.MavenHelper;
import com.northernwall.hadrian.parameters.Parameters;
import com.northernwall.hadrian.workItem.WorkItemSender;
import java.io.IOException;
import java.lang.management.ManagementFactory;
import java.lang.management.RuntimeMXBean;
import java.lang.management.ThreadMXBean;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.Set;
import java.util.TreeSet;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.eclipse.jetty.server.Handler;
import org.eclipse.jetty.server.Request;
import org.eclipse.jetty.server.handler.AbstractHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author Richard Thurston
 */
public class HealthHandler extends AbstractHandler {

    private final static Logger logger = LoggerFactory.getLogger(HealthHandler.class);

    private final Handler accessHandler;
    private final CalendarHelper calendarHelper;
    private final DataAccess dataAccess;
    private final MavenHelper mavenHelper;
    private final Parameters parameters;
    private final WorkItemSender workItemSender;
    private final String version;
    
    public HealthHandler(Handler accessHandler, CalendarHelper calendarHelper, DataAccess dataAccess, MavenHelper mavenHelper, Parameters parameters, WorkItemSender workItemSender) {
        this.accessHandler = accessHandler;
        this.calendarHelper = calendarHelper;
        this.dataAccess = dataAccess;
        this.mavenHelper = mavenHelper;
        this.parameters = parameters;
        this.workItemSender = workItemSender;
        String temp = getClass().getPackage().getImplementationVersion();
        if (temp == null) {
            version = "unknown";
        } else {
            version = temp;
        }
    }

    @Override
    public void handle(String target, Request request, HttpServletRequest httpRequest, HttpServletResponse response) throws IOException, ServletException {
                response.setStatus(200);
                showHealth(response);
                request.setHandled(true);
    }

    private void showHealth(HttpServletResponse response) throws IOException {
        RuntimeMXBean runtimeMXBean = ManagementFactory.getRuntimeMXBean();
        ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
        
        writeln(response, "<html>");
        writeln(response, "<body>");
        writeln(response, "<table>");
        writeln(response, "Version", version);
        writeln(response, "JVM Name", runtimeMXBean.getSpecName());
        writeln(response, "JVM Version", runtimeMXBean.getSpecVersion());
        writeln(response, "JVM Vendor", runtimeMXBean.getSpecVendor());
        writeln(response, "JVM Threads", threadMXBean.getThreadCount());
        writeln(response, "JVM Peak Threads", threadMXBean.getPeakThreadCount());
        writeln(response, "Current Time", new Date());
        writeln(response, "Start Time", new Date(runtimeMXBean.getStartTime()));
        writeln(response, "Class - Access Handler", accessHandler.getClass().getCanonicalName());
        writeln(response, "Class - Calendar Helper", calendarHelper.getClass().getCanonicalName());
        writeln(response, "Class - Data Access", dataAccess.getClass().getCanonicalName());
        writeln(response, "Class - Maven Helper", mavenHelper.getClass().getCanonicalName());
        writeln(response, "Class - Parameters", parameters.getClass().getCanonicalName());
        writeln(response, "Class - Work Item Sender", workItemSender.getClass().getCanonicalName());
        Map<String, String> healthMap = dataAccess.getHealth();
        Set<String> keys = new TreeSet<>(healthMap.keySet());
        for(String key : keys) {
            writeln(response, key, healthMap.get(key));
        }
        writeln(response, "</table>");
        writeln(response, "</body>");
        writeln(response, "</html>");
    }

    private void writeln(HttpServletResponse response, String text) throws IOException {
        response.getOutputStream().write(text.getBytes());
    }

    private void writeln(HttpServletResponse response, String label, Date value) throws IOException {
        writeln(response, label, new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(value));
    }

    private void writeln(HttpServletResponse response, String label, int value) throws IOException {
        writeln(response, label, Integer.toString(value));
    }

    private void writeln(HttpServletResponse response, String label, String value) throws IOException {
        String text = "<tr><td>" + label + "</td><td>" + value + "</td></tr>";
        response.getOutputStream().write(text.getBytes());
    }

}