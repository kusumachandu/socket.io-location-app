/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client'
import './App.css';

const socket = io.connect("http://localhost:3001");

function App() {
  const [room, setRoom] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [location, setLocation] = useState([]);

  const joinRoom = () => {
    if (room !== "") {
      socket.emit("join_room", room);
    }
  }

  function sendMessage() {
    socket.emit("send message", { latitude, longitude, room, location });
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      navigator.geolocation.watchPosition((position) => {
        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }
        //socket.emit("location", locationData);
        setLocation(locationData);
      })
    
    }, 5000)
    socket.on("receive message", (data) => {
      setMessageReceived(data);
    })
    return () => {
      clearInterval(intervalId);
    }
  }, []);

  console.log(location);

  return (
    <div className="App">
      <div className='inner_div'>
        <div style={{ display: "" }}>
          <div style={{ margin: "10px" }}>
            <label style={{ fontWeight: 600 }}>Room No: </label>
            <input style={{ padding: "5px", marginRight: "5px" }} placeholder='room number...' onChange={(e) => { setRoom(e.target.value) }} />
            <button style={{ padding: "5px" }} onClick={joinRoom}>Join Room</button>
          </div>
          <div style={{ margin: "10px", }} className="latitude">
            <label style={{ fontWeight: 600 }}>Latitude: </label>
            <input style={{ padding: "5px" }} placeholder='latitude...' name="latitude" onChange={(e) => setLatitude(e.target.value)} />
          </div>
          <div style={{ margin: "10px" }} className="longitude">
            <label style={{ fontWeight: 600 }}>Longitude: </label>
            <input style={{ padding: "5px" }} placeholder='longitude...' name="longitude" onChange={(e) => setLongitude(e.target.value)} />
          </div>
          <button className='button_1' onClick={sendMessage}>Send a Message</button>
        </div>
        <div>
          <div>
            <span style={{ display: "flex", gap: "5px" }}>
              <h1>LAT:</h1>
              <p style={{ marginTop: "23px", fontWeight: "600", color: "gray", fontSize: "30px" }}>{messageReceived.latitude}</p>
            </span>
          </div>
          <div>
            <span style={{ display: 'flex', gap: "5px" }}>
              <h1 style={{ display: "inline" }}>LON:</h1>
              <p style={{ marginTop: "23px", fontWeight: "600", color: "gray", fontSize: "30px" }}>{messageReceived.longitude}</p>
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;
