import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

// Message type for socket messages
interface Message {
  id: string;
  createdDateTime: string;
  messageType: string;
  content: string;
  room: string;
  username: string;
}

// Appointment type
interface Appointment {
  appointmentId: number;
  appointmentDate: number | string; // Handle both number (timestamp) and string formats
  appointmentStart: string;
  appointmentEnd: string;
  customerId: number | null;
}

// Initialize socket connection
const socket: Socket = io("ws://192.168.64.1:8085?room=Ankara&username=Erdem", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  timeout: 5000,
});

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen for appointment messages
    socket.on("send_appointment_message", (msg: any) => {
      console.log("Received socket message:", msg);
      
      // Add message to messages state
      setMessages((prev) => [...prev, msg]);
      
      // If we receive an appointment object directly
      if (typeof msg === 'object' && msg.appointmentId) {
        console.log("Randevu alındı: " + msg.appointmentId);
        
        // Update the appointment with this ID to mark it as booked
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.appointmentId === msg.appointmentId
              ? { ...appointment, customerId: msg.customerId || 1 }
              : appointment
          )
        );
      } 
      // If the message has content that might be parsed as JSON
      else if (msg.content) {
        try {
          // Try to parse the content if it's a JSON string
          const appointmentData = typeof msg.content === 'string' 
            ? JSON.parse(msg.content) 
            : msg.content;
          
          if (appointmentData.appointmentId) {
            console.log("Randevu alındı: " + appointmentData.appointmentId);
            
            // Update the appointment with this ID to mark it as booked
            setAppointments((prevAppointments) =>
              prevAppointments.map((appointment) =>
                appointment.appointmentId === appointmentData.appointmentId
                  ? { ...appointment, customerId: appointmentData.customerId || 1 }
                  : appointment
              )
            );
          }
        } catch (e) {
          console.error("Error parsing appointment data:", e);
        }
      }
    });

    return () => {
      socket.off("send_appointment_message");
    };
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:8080/appointments/getAll");
        const data = await response.json();
        setAppointments(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        setError("Randevuları alırken bir hata oluştu");
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleAppointmentClick = async (appointmentId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/appointments/update/${appointmentId}/4664793`);
      const data = await response.json();
      console.log("Appointment updated:", data);
      
      // Update local state after successful update
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.appointmentId === appointmentId
            ? { ...appointment, customerId: 4664793 }
            : appointment
        )
      );
    } catch (err) {
      console.error("Error updating appointment:", err);
    }
  };

  if (loading) return <div className="text-center p-4">Randevular yükleniyor...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Randevular</h1>
      <div className="flex flex-wrap gap-2">
        {appointments.map((appointment) => {
          const isBooked = appointment.customerId !== null;
          
          return (
            <button
              key={appointment.appointmentId}
              onClick={() => !isBooked && handleAppointmentClick(appointment.appointmentId)}
              disabled={isBooked}
              className={`p-2 rounded transition-colors flex-shrink-0 ${
                isBooked
                  ? "bg-red-500 text-white opacity-70 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
              style={{ minWidth: '150px' }}
            >
              <div className="font-bold">Randevu {appointment.appointmentId}</div>
              <div className="text-xs">
                {typeof appointment.appointmentDate === 'number' 
                  ? new Date(appointment.appointmentDate).toLocaleDateString()
                  : new Date(appointment.appointmentDate).toLocaleDateString()}
              </div>
              <div className="text-xs">{appointment.appointmentStart} - {appointment.appointmentEnd}</div>
              {isBooked && (
                <div className="mt-1 text-xs">
                  (Dolu - ID: {appointment.customerId})
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default App;