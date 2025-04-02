import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

// Message type düzeltildi - bir string değil, bir obje
interface Message {
  id: string;
  createdDateTime: string;
  messageType: string;
  content: string;
  room: string;
  username: string;
}

interface Appointment {
  appointmentId: number;
  appointmentDate: string;
  appointmentStart: string;
  appointmentEnd: string;
  customerId: number | null;
}

// Initialize socket connection
const socket: Socket = io("ws://172.29.208.1:8085?room=Ankara&username=Erdem", {
  transports: ["websocket"], // Force WebSocket-only connection
  reconnectionAttempts: 5, // Retry 5 times if the connection fails
  timeout: 5000, // Wait 5 seconds before failing
});

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    socket.on("read_message", (msg: Message) => {
      console.log(msg);
      setMessages((prev) => [...prev, msg]);
  
      // Eğer mesaj tipi "Appointment" ise ilgili randevuyu güncelle
      if (msg.messageType === "Appointment") {
        console.log("Randevu alındı: " + msg.content);
  
        // `msg.content` içindeki randevu numarasına göre appointments listesini güncelle
        const appointmentId = parseInt(msg.content, 10); // Randevu ID'sini al (string ise parse et)
        setAppointments((prevAppointments) =>
          prevAppointments.map((appointment) =>
            appointment.appointmentId === appointmentId
              ? { ...appointment, customerId: 1 } // Randevu dolu olarak işaretle
              : appointment
          )
        );
      }
    });
  
    return () => {
      socket.off("read_message");
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

  const handleAppointmentClick = (appointmentId: number, isBooked: boolean) => {
    const takeAppointments = async () => {
      const response = await fetch("http://localhost:8080/appointments/update/" + appointmentId + "/4664793");
      const data = await response.json();
    }
    takeAppointments();

  };

  if (loading) return <div className="p-4">Randevular yükleniyor...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">      
      <h2 className="text-xl font-bold mb-4">Randevular</h2>
      <div className="flex flex-col items-center space-y-2 max-w-md mx-auto">
        {appointments.map((appointment) => {
          const isBooked = appointment.customerId !== null;          
          return (
            <button
              key={appointment.appointmentId}
              id={`appointment-${appointment.appointmentId}`}
              onClick={() => handleAppointmentClick(appointment.appointmentId, isBooked)}
              disabled={isBooked}
              className={`w-full p-3 rounded transition-colors ${
                isBooked 
                  ? "bg-red-500 text-white opacity-70 cursor-not-allowed" 
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Randevu {appointment.appointmentId}
              <div className="text-sm">
                {new Date(appointment.appointmentDate).toLocaleDateString()} 
                {appointment.appointmentStart} - {appointment.appointmentEnd}
              </div>
              {isBooked && (
                <div className="text-xs mt-1">
                  (Dolu - Müşteri ID: {appointment.customerId})
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