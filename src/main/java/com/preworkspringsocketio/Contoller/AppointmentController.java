package com.preworkspringsocketio.Contoller;

import com.preworkspringsocketio.Services.AppointmentService;
import com.preworkspringsocketio.model.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@CrossOrigin("*")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;


    @GetMapping("/getAll")
    public ResponseEntity<?> getAllAppointments() {
        List<Appointment> appointments = appointmentService.getAppointments();
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/update/{appointmentId}/{customerId}")
    public int updateAppointment(@PathVariable Long appointmentId, @PathVariable Long customerId) {
        int result = appointmentService.takeAppointment(appointmentId, customerId);
        Appointment appointment = appointmentService.findAppointmentById(appointmentId);
//        socketModule.sendMessageToAll("get_message",appointment);
        return result;
    }
    @MessageMapping("/send") // React tarafından gelen mesajları dinler
    @SendTo("/topic/messages") // Mesajları yayınlar
    public String handleMessage(String message) {
        return "Sunucudan gelen mesaj: " + message;
    }
}
