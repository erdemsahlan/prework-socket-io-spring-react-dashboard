package com.preworkspringsocketio.Services;

import com.preworkspringsocketio.Repository.AppointmentRepository;
import com.preworkspringsocketio.model.Appointment;
import com.preworkspringsocketio.model.Message;
import com.preworkspringsocketio.socket.SocketModule;
import com.preworkspringsocketio.socket.SocketService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final SocketService socketService;
    private final SocketModule socketModule;

    public AppointmentService(AppointmentRepository appointmentRepository, SocketService socketService, SocketModule socketModule) {
        this.appointmentRepository = appointmentRepository;
        this.socketService = socketService;
        this.socketModule = socketModule;
    }

    public List<Appointment> getAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments;
    }

    public Appointment findAppointmentById(long appointmentId) {
        Optional<Appointment> result = appointmentRepository.findById(appointmentId);
        return result.orElse(null);
    }

    @Transactional
    public int takeAppointment(long appointmentId, long customerId) {
            int result = appointmentRepository.takeAppointment(appointmentId, customerId);
            Message message = Message.builder()
                    .messageType("appointment")
                    .content(String.valueOf(appointmentId))
                    .room("Ankara")
                    .username("System")
                    .build();
            socketService.broadcastAppointmentId("Ankara", String.valueOf(appointmentId));
            return result;
    }

}
