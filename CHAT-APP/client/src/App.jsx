
import './App.css'
import { useState, useEffect, useMemo } from 'react' 
import { io } from "socket.io-client";


function App() {
  const [messages, setmessages] = useState([])
  const socket = useMemo(()=> io("http://localhost:3000"), [])

  useEffect(()=>{
    socket.on('connect', ()=>{
      console.log("Connected to server");
    })

    socket.on('message',(msg)=>{
      setmessages((prev)=>[...prev, msg])
      console.log("Message from server: "+ msg);
    })

    return ()=>{
      socket.off('connect')
      socket.off('message')
      socket.disconnect()
      console.log("Socket disconnected");
    }
  }, [socket])


  const [message, setMessage] = useState("")

  const handleSubmit= (e)=>{
    e.preventDefault();
    socket.emit("message", message);
    //socket.emit('event-name', data)
    setMessage("")
  }

  return (
    <>
    <h1>Welcome to the chat app</h1>

    <form onSubmit={handleSubmit}>
      <input type="text" 
      onChange={(e)=>setMessage(e.target.value)}  
      placeholder='Write Your Message'
      value={message}
      />
      <button type='submit'>Send</button>
    </form>
    {
      messages.map((msg, i)=>{
        return <h3 
        style={{
          border:"1px solid black",
          width:"50%",
          margin:"10px auto",
          padding:"10px",
          color:"black",
          backgroundColor:"lightgrey",
          borderRadius:"10px"
        }}
        key={i}>{msg}</h3>
      })
    }
    </>
  )
}

export default App
