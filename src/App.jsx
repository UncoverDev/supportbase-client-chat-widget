import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import Dummy from './components/Dummy';
import ChatWidget from './components/ChatWidget';
import { connectSocket, socket } from './socket';

function App() {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    connectSocket()
    // return socket.disconnect();
  }, [])

  return (
    <div className="text-center">
      <ChatWidget
        setMessages={setMessages}
        messages={messages}
        socket={socket}
      />
      {/* <Dummy socket={socket} /> */}
    </div>
  );
}

export default App;
