import { useCallback, useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import io  from 'socket.io-client';
import Stomp from '@stomp/stompjs';
import SockJS from "sockjs-client";
import { StompSessionProvider, useSubscription } from "react-stomp-hooks";

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
  async function takeAppointment(appointmentId: number, customerId: number) {
    const response = await axios.get("http://localhost:8080/appointments/update/" + appointmentId + "/" + customerId);
    if (response.data == true) fetchData();


  }

  const formatDate = (dateString: string): string => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" } as const;
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(new Date(dateString));
    return formattedDate;
  };
  useEffect(() => {
    fetchData();
  //   const connect = io("http://172.27.240.1:8085", {
  //     query: {
  //       room: "erdem",
  //       username: "webconnect",
  //     },
  //     transports: ['polling'],  // Yalnızca polling kullanarak dene
  //     upgrade: false  // WebSocket'e yükseltmeyi devre dışı bırak
  //   });
  //   connect.on("read_message", (data:any) => {
  //     console.log("socket mesajı:")
  //     console.log(data);
  //   });
  //   connect.emit("send_message", {
  //     messageType:"Client",
  //     content: "webtest",
  //     room: "erdem",
  //     username: "erdem"
  // });
    // connect.disconnect();
  }, []);



  const [messages,setMesssages] = useState<any[]>([]);
  const [message, setMessage] = useState<any>("");
  const[nickname,setNickname] = useState("");
  const [stompClient,setStompClient] = useState<any>(null);

  useSubscription("http://172.27.240.1:8080/ws-endpoint/app/topic",(message)=>{
    console.log(message);
  });
  useEffect(()=>{
    // const socket = new SockJS("http:/localhost:8080/ws");
    // const client = Stomp.over(socket);

    // client.connect({},(message:any)=>{
    //   const recievedMessage = JSON.parse(message.body);
    //   setMesssages((prevMessage:any)=>[...prevMessage,recievedMessage]);
    // });
    // setStompClient(client);
    // return ()=>{
    //   client.disconnect();
    // }
  //   socket.on('read_message',(message:any)=>{
  //     setMessage(message);
  // })
  // console.log(message);
  // return ()=>{
  //   socket.off('read_message');
  // }
}, []);

const socket = io("ws://172.27.240.1:8085?room=erdem&username=webconnect",{})
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
