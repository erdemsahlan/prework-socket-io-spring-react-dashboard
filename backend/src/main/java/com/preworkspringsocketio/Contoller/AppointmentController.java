package com.preworkspringsocketio.Contoller;

import com.preworkspringsocketio.Services.AppointmentService;
import com.preworkspringsocketio.model.Appointment;
import com.preworkspringsocketio.socket.SocketService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@CrossOrigin("*")
@RequiredArgsConstructor
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
        return result;
    }

    //    @MessageMapping("/send") // React tarafından gelen mesajları dinler
//    @SendTo("/topic/messages") // Mesajları yayınlar
//    public String handleMessage(String message) {
//        return "Sunucudan gelen mesaj: " + message;
//    }
//    private final SocketServiceTest socketService;
//
//    @PostMapping("/send")
//    public String sendMessage(@RequestBody String message) {
//        socketService.sendMessage(message);
//        return "Message sent: " + message;
//    }


}
