package com.preworkspringsocketio.socket;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.listener.ConnectListener;
import com.corundumstudio.socketio.listener.DataListener;
import com.corundumstudio.socketio.listener.DisconnectListener;
import com.preworkspringsocketio.model.Message;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class SocketModule {
    private final SocketIOServer server;
    private final SocketIOServer socketIOServer;

    public SocketModule(SocketIOServer server, SocketIOServer socketIOServer) {
        this.server = server;
        this.socketIOServer = socketIOServer;
        socketIOServer.addConnectListener(onConnected());
        socketIOServer.addDisconnectListener(onDisconnected());
        socketIOServer.addEventListener("send_message", Message.class, onMessageReceived());
    }

    private DataListener<Message> onMessageReceived() {
        return (senderClient, data, ackSender) -> {
            System.err.println(senderClient.getSessionId() + " -> " + data.getContent());
            senderClient.getNamespace().getAllClients().forEach(client -> {
                if (!client.getSessionId().equals(senderClient.getSessionId())) {
                    client.sendEvent("get_message", data.getContent());
                }
            });
        };

    }

    private ConnectListener onConnected() {
        return client -> {
            System.err.println("SocketId : " + client.getSessionId().toString() + " connected");
        };
    }

    private DisconnectListener onDisconnected() {
        return client -> {
            System.err.println("SocketId : " + client.getSessionId().toString() + " disconnected");
        };
    }
}
