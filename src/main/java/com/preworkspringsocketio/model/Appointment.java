package com.preworkspringsocketio.model;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Entity
public class Appointment {
    @Id
    private Long appointmentId;
    private Date appointmentDate;
    private String appointmentStart;
    private String appointmentEnd;
    @Column(nullable = true)
    private Long customerId;

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Date getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(Date appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getAppointmentStart() {
        return appointmentStart;
    }

    public void setAppointmentStart(String appointmentStart) {
        this.appointmentStart = appointmentStart;
    }

    public String getAppointmentEnd() {
        return appointmentEnd;
    }

    public void setAppointmentEnd(String appointmentEnd) {
        this.appointmentEnd = appointmentEnd;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
}
