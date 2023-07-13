// Dummy.js

import React, { useEffect, useState } from 'react';

const Dummy = (props) => {
    const { socket } = props;
    const [chatRooms, setChatRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Receive room creation events from the server
        socket.on('roomCreated', (room) => {
            setChatRooms((prevRooms) => [...prevRooms, room]);
        });

        // Receive room joined events from the server
        socket.on('roomJoined', (room) => {
            setActiveRoom(room);
            setMessages(room.messages);
        });

        // Receive room not found events from the server
        socket.on('roomNotFound', () => {
            // Handle room not found error
        });

        // Receive user joined events from the server
        socket.on('userJoined', (userId) => {
            // Handle user joined event
        });

        // Receive user left events from the server
        socket.on('userLeft', (userId) => {
            // Handle user left event
        });

        // Receive new messages from the server
        socket.on('messageReceived', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleCreateRoom = () => {
        const roomName = prompt('Enter room name:');
        if (roomName) {
            socket.emit('createRoom', roomName);
        }
    };

    const handleJoinRoom = (roomName) => {
        socket.emit('joinRoom', roomName);
    };

    const handleLeaveRoom = () => {
        if (activeRoom) {
            socket.emit('leaveRoom', activeRoom.name);
            setActiveRoom(null);
            setMessages([]);
        }
    };

    const handleSendMessage = () => {
        if (message.trim() && activeRoom) {
            socket.emit('sendMessage', { roomName: activeRoom.name, message });
            setMessage('');
        }
    };

    return (
        <div>
            <div>
                <h2>Chat Rooms</h2>
                <button onClick={handleCreateRoom}>Create Room</button>
                {chatRooms.map((room) => (
                    <div key={room.name}>
                        <button onClick={() => handleJoinRoom(room.name)}>
                            Join {room.name}
                        </button>
                    </div>
                ))}
            </div>
            {activeRoom && (
                <div>
                    <h2>Active Room: {activeRoom.name}</h2>
                    <button onClick={handleLeaveRoom}>Leave Room</button>
                    <div>
                        {messages.map((msg, index) => (
                            <div key={index}>
                                <strong>{msg.user}: </strong>
                                {msg.message}
                            </div>
                        ))}
                    </div>
                    <div>
                        <input
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button onClick={handleSendMessage}>Send</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dummy;
