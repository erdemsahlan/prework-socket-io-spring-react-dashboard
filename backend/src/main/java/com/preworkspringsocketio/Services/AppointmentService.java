package com.preworkspringsocketio.Services;

import com.preworkspringsocketio.Repository.AppointmentRepository;
import com.preworkspringsocketio.model.Appointment;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
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
        return result;
    }

}
