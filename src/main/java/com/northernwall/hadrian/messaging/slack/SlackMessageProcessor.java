package com.northernwall.hadrian.messaging.slack;

import com.northernwall.hadrian.domain.Team;
import com.northernwall.hadrian.messaging.MessageProcessor;
import com.northernwall.hadrian.messaging.MessageType;
import com.northernwall.hadrian.parameters.Parameters;
import java.util.Map;

public class SlackMessageProcessor extends MessageProcessor {

    @Override
    public void init(Parameters parameters) {
    }

    @Override
    public void process(MessageType messageType, Team team, Map<String, String> data) {
    }

}
