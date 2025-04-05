package com.preworkspringsocketio.socket;

import com.corundumstudio.socketio.SocketIOClient;
import com.corundumstudio.socketio.SocketIOServer;
import com.preworkspringsocketio.Services.MessageService;
import com.preworkspringsocketio.model.Appointment;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import com.preworkspringsocketio.model.Message;

@Service
@RequiredArgsConstructor
@Slf4j
public class SocketService {
    private final MessageService messageService;
    private final SocketIOServer server;

    public void sendSocketMessage(SocketIOClient senderClient, Message message, String room) {
        for (
                SocketIOClient client : senderClient.getNamespace().getRoomOperations(room).getClients()) {
            if (!client.getSessionId().equals(senderClient.getSessionId())) {
                client.sendEvent("read_message",
                        message);
            }
        }
    }
    public void sendAppointmentMessage(SocketIOClient senderClient, Appointment appointment, String room) {
        for (
                SocketIOClient client : senderClient.getNamespace().getRoomOperations(room).getClients()) {
            if (!client.getSessionId().equals(senderClient.getSessionId())) {
                client.sendEvent("send_appointment_message",
                        appointment);
            }
        }
    }

    public void saveMessage(SocketIOClient senderClient, Message message) {
        Message storedMessage = messageService.saveMessage(Message.builder()
                .messageType("Server")
                .content(message.getContent())
                .room(message.getRoom())
                .username(message.getUsername())
                .build());
        sendSocketMessage(senderClient, storedMessage, message.getRoom());
    }
    public void saveAppointmet(SocketIOClient senderClient, Appointment appointment) {
        sendAppointmentMessage(senderClient,appointment,"appointment");
    }

    public void saveInfoMessage(SocketIOClient senderClient, String message, String room) {
        Message storedMessage = messageService.saveMessage(Message.builder()
                .messageType("Server")
                .content(message)
                .room(room)
                .build());
        sendSocketMessage(senderClient, storedMessage, room);
    }
    public void broadcastAppointmentId(String room, String appointmentId) {
        Message message = Message.builder()
                .messageType("Appointment")
                .content(appointmentId)
                .room(room)
                .username("System")
                .build();

        Message storedMessage = messageService.saveMessage(message);
        server.getRoomOperations(room).sendEvent("read_message", storedMessage);
    }
}
