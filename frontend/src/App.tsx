import { useCallback, useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import io from 'socket.io-client'

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
    console.log(response)
    if (response.data == true) fetchData();
  }

  const formatDate = (dateString: string): string => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" } as const;
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(new Date(dateString));
    return formattedDate;
  };


  
  // const chatSocket = io("http://172.22.16.1:8085", {
  //   query: {
  //     room: "erdem",
  //     username: "123",
  //   },
  //   autoConnect : false
  // });
  // const [input, setInput] = useState("");
  // const [messages, setMessage] = useState<string[]>([]);

  // let onConnect = () => {
  //   console.log("connected:" + chatSocket.id);
  // };
  // let onDisconnect = () => {
  //   console.log("disconnected");
  // };

  // let onMessageEvent = (data: string) => {
  //   setMessage([...messages, data]);
  // };
  // chatSocket.on("connect", onConnect);
  // chatSocket.on("disconnect", onDisconnect);
  // chatSocket.on("get_message", onMessageEvent);


  // const [socket, setSocket] = useState<any>();
  // const [isConnected, setConnected] = useState(false);
  // useEffect(() => {
  //   // chatSocket.connect();
  //   const socket = io("http://172.22.16.1:8085", {
  //     query: {
  //       room: "erdem",
  //       username: "123",
  //     },
  //     autoConnect : false
  //   });
  //   setSocket(socket);
  //   socket.on("connect", () => setConnected(true));
  //   socket.on("get_message", (res:any) => {
  //     console.log(res);
  //   });
  //   return () => {
  //     socket.disconnect();
  //   };
  //   testSendData();

  // }, []);

  // const sendData = useCallback(
  //   (appointment: AppointmentResponse) => {
  //     if (socket) {
  //       socket.emit("send_message", appointment); // Veri gönderimi
  //     } else {
  //       console.error("Socket bağlantısı henüz oluşturulmadı.");
  //     }
  //   },
  //   [socket]
  // );
  


  // const testSendData = () => {
  //   const appointment: AppointmentResponse = {
  //     appointmentId: 1,
  //     appointmentDate: "2025-03-16",
  //     appointmentStart: "10:00",
  //     appointmentEnd: "11:00",
  //     customerId: 4664793, // veya null
  //   };
  //   sendData(appointment); // Veriyi gönder
  // };

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
