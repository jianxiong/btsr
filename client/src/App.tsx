import React, { useEffect, useState } from 'react'
import Moment from 'react-moment'
import socketIOClient from "socket.io-client"
import './App.css'

const App = () => {
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    const socket = socketIOClient();
    socket.on("current", (data: any) => {
      console.log("current", data)
      setRequests(data)
    });
  }, []);
  
  const handleDelete = (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    fetch(`/help/${id}`, {
      method: 'DELETE'
    }).then(() => {
      console.log("deleted")
    }).catch(error => {
      console.error(error)
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        {
          requests.length === 0 &&
          <p>No requests</p>
        }
        <ul>
        {
          requests.map(request => {
            return <li key={request.id}>Request from {request.username}, <Moment fromNow>{request.timestamp}</Moment> <button onClick={handleDelete(request.id)}>Delete</button></li>
          })
        }
        </ul>
      </header>
    </div>
  )
}

export default App;
