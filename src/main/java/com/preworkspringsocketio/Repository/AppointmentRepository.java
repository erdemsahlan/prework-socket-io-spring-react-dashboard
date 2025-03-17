package com.preworkspringsocketio.Repository;

import com.preworkspringsocketio.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Modifying
    @Transactional
    @Query("update Appointment f " +
            "set f.customerId = :customerId " +
            "where f.appointmentId = :appointmentId")
    int takeAppointment(@Param("appointmentId") long appointmentId,
                        @Param("customerId") long customerId);

}
