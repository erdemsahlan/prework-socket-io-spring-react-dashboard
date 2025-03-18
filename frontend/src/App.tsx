import { useCallback, useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import io  from 'socket.io-client';

function App() {
  interface AppointmentResponse {
    appointmentId: number;
    appointmentDate: string;
    appointmentStart: string;
    appointmentEnd: string;
    customerId: number | null;
  }

  const [data, setData] = useState<AppointmentResponse[]>([]);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/appointments/getAll");
      setData(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


  async function takeAppointment(appointmentId: number, customerId: number) {
    const response = await axios.get("http://localhost:8080/appointments/update/" + appointmentId + "/" + customerId);
    if (response.data == true) fetchData();

    const connect = io("http://172.20.160.1:8085", {
      query: {
        room: "erdem",
        username: "webconnect",
      },
      transports: ['polling'],  // Yalnızca polling kullanarak dene
      upgrade: false  // WebSocket'e yükseltmeyi devre dışı bırak
    });   debugger;
    connect.on("read_message", (data:any) => {
      console.log("socket mesajı:")
      console.log(data);
    });
    connect.emit("send_message", {
      messageType:"Client",
      content: "webtest",
      room: "erdem",
      username: "erdem"
  });
    connect.disconnect();
  }

  const formatDate = (dateString: string): string => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" } as const;
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(new Date(dateString));
    return formattedDate;
  };



  return (
    <>
      <div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {data.map((item) => (
            <button
              key={item.appointmentId}
              onClick={() => (takeAppointment(item.appointmentId, 4664793))}
              style={{
                backgroundColor: item.customerId ? "red" : "blue",
                color: "white",
                cursor: item.customerId ? "not-allowed" : "pointer",
                padding: "10px",
                border: "none",
                borderRadius: "5px",
              }}
              disabled={!!item.customerId}
            >
              {formatDate(item.appointmentDate)} / {item.appointmentStart} - {item.appointmentEnd}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
