//package com.preworkspringsocketio.socket;
//
//import com.corundumstudio.socketio.Configuration;
//import com.corundumstudio.socketio.SocketIOServer;
//import jakarta.annotation.PostConstruct;
//import jakarta.annotation.PreDestroy;
//import org.springframework.stereotype.Component;
//
//@Component
//public class SocketServiceTest {
//
//    private final SocketIOServer server;
//
//    public SocketServiceTest() {
//        Configuration config = new Configuration();
//        config.setHostname("localhost");
//        config.setPort(8086); // WebSocket server runs on this port
//        config.setOrigin("*");
//        config.setContext("/socket.io");
//        this.server = new SocketIOServer(config);
//    }
//
//    @PostConstruct
//    public void startServer() {
//        server.start();
//        System.out.println("Socket.IO server started on port 9092");
//    }
//
//    @PreDestroy
//    public void stopServer() {
//        server.stop();
//    }
//
//    // Method to publish messages to all connected clients
//    public void sendMessage(String message) {
//        server.getBroadcastOperations().sendEvent("newMessage", message);
//    }
//}
