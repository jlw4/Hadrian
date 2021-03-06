package com.northernwall.hadrian.stubs;

import com.google.gson.Gson;
import com.northernwall.hadrian.domain.Team;
import com.northernwall.hadrian.messaging.MessageProcessor;
import com.northernwall.hadrian.messaging.MessageType;
import com.northernwall.hadrian.parameters.Parameters;
import com.squareup.okhttp.OkHttpClient;
import java.util.Map;

public class StubMessageProcessor extends MessageProcessor {

    public static String text;

    @Override
    public void init(Parameters parameters, Gson gson, OkHttpClient client) {
    }

    @Override
    public void process(MessageType messageType, Team team, Map<String, String> data) {
        text = replaceTerms(messageType.emailBody, data);
    }

}
