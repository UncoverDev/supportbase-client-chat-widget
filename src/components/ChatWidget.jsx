import React, { useEffect, useState } from 'react'
import ChatBubble from './ChatBubble';
// import messages from '../json/messages.json';
import { IoMdSend } from 'react-icons/io'
import { MdOutlineExpandMore, MdOutlineExpandLess } from 'react-icons/md'
import StartChatInterface from './StartChatInterface';
import { socket, socketId } from '../socket'
import ClipLoader from "react-spinners/ClipLoader";
import axios from 'axios';

const ChatWidget = (props) => {
    const { messages, setMessages } = props;
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatStarted, setChatStarted] = useState(false);
    const [typingMessage, setTypingMessage] = useState('');
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [currentUserIdentifier, setCurrentUserIdentification] = useState(null)
    const [currentChatRoom, setCurrentChatRoom] = useState(null);
    const [messageChanged, setMessageChanged] = useState(0);
    const [newMessage, setNewMessage] = useState(null);
    const [fetchingConversations, setFetchingConversations] = useState(false);

    const fetchConversations = async (conversation) => {
        try {
            const { data } = await axios.get(`http://localhost:8000/v1/messages/get_all/${conversation?._id}`);
            setMessages(data?.data ?? [])
            setFetchingConversations(false)
        } catch (error) {
            console.log(error);
            setMessages([])
            setFetchingConversations(false)
        }
    }


    const handleEnterConversation = (conversation) => {
        console.log(conversation, 'conversation from chat widget enter conversation')
        setIsChatOpen(true)
        setChatStarted(true)
        setFetchingConversations(true)
        fetchConversations(conversation)
    }

    const getUserIdentifier = () => {
        let identifier = localStorage.getItem('user-identifier');
        setCurrentUserIdentification(identifier)
    }

    useEffect(() => {
        if (!newMessage) return
        handleUpdateMessage(newMessage)
    }, [newMessage])

    useEffect(() => {
        getUserIdentifier()
    }, [newMessage, socket])


    const handleUpdateMessage = (message) => {
        let prevMessages = [...messages]
        setChatStarted(true)
        let newMessage = {
            ...message
        }
        let newMessages = [...prevMessages, newMessage]
        setMessages(newMessages);
        setCurrentConversationId(message.conversation_id)
        setCurrentChatRoom(message.chatroom)
    }

    const handleSendMessage = (message) => {
        if (!typingMessage) return
        if (!currentUserIdentifier) {
            alert('Please enter your name to continue')
            return;
        }
        let messageObject = {
            message: typingMessage,
            timestamp: new Date().getTime(),
            isUser: true,
            name: 'User',
            conversation_id: currentConversationId,
            user: currentUserIdentifier,
            chatroom: currentChatRoom
        }
        socket.emit('sendMessage', messageObject);
        setTypingMessage('');
    }

    const handleSocketEvent = () => {
        socket.on('messageReceived', (message) => {
            console.log('messageReceived', message)
            setNewMessage(message)
        });
    }

    useEffect(() => {
        if (!socket) return
        handleSocketEvent();
    }, [socket])


    const toggleChat = () => {
        setIsChatOpen(!isChatOpen);
    };

    const displayMessages = messages?.map((message, index) => {
        return (
            <ChatBubble
                key={index}
                isUser={message.isUser}
                message={message.message}
                timestamp={message.timestamp}
                fetchingConversations={fetchingConversations}
            />
        );
    })

    return (
        <div className="relative">
            {isChatOpen && (
                <div className="fixed bottom-28 right-10 bg-[whitesmoke] rounded-lg shadow-md h-[450px] w-80 overflow-y-auto">
                    <div className="h-full w-full relative bg-white"
                        style={{
                            position: 'relative'
                        }}
                    >
                        {
                            chatStarted && <>
                                <div
                                    className='h-[150px] w-30 bg-[#3e8ff9] rounded-t'
                                >
                                    <button className="bg-[#3464a3] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2 text-sm">
                                        Chat with us
                                    </button>
                                    <div className="flex justify-center items-center mt-3">
                                        <div className="flex">
                                            <div className="w-10 h-10 bg-center bg-gray-300 rounded-full overflow-hidden"
                                            >
                                                <img src="https://th.bing.com/th/id/R.09fdeb49402aa0184c909f874c7ab668?rik=QdcLbhMgeY5QsA&pid=ImgRaw&r=0" alt="" />
                                            </div>
                                            <div className="w-10 h-10 bg-center bg-gray-300 rounded-full overflow-hidden"
                                            >
                                                <img src="https://th.bing.com/th/id/OIP.7FGJSbzJG3Ln76YG0r0CXwHaLG?pid=ImgDet&w=567&h=850&rs=1" alt="" />
                                            </div>
                                            <div className="w-10 h-10 bg-center bg-gray-300 rounded-full overflow-hidden">
                                                <img src="https://th.bing.com/th/id/R.3b4e28ab35ff9d5c60e622a48ed5667d?rik=s0dBdeKUmwybhg&pid=ImgRaw&r=0" alt="" />
                                            </div>
                                        </div>
                                    </div>
                                    <p
                                        className="text-center text-white text-sm mt-2"
                                    >
                                        3 people are online now
                                    </p>
                                </div>
                                {
                                    fetchingConversations ? <div className="flex justify-center items-center h-[300px]">

                                        <ClipLoader
                                            color={"#3e8ff9"}
                                            loading={true}
                                            size={40}
                                            aria-label="Loading Spinner"
                                            data-testid="loader"
                                        />
                                    </div> : <div className="p-2 overflow-auto max-h-[245px]">
                                        {displayMessages}
                                    </div>
                                }

                                <div className="flex flex-row items-center p-2 absolute bottom-0 w-full">
                                    <input
                                        type="text"
                                        placeholder="Type your message here..."
                                        className="flex-1 p-2 mr-2 border border-gray-300 rounded-lg outline-none"
                                        value={typingMessage}
                                        onChange={(e) => {
                                            setTypingMessage(e.target.value)
                                        }}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                handleSendMessage()
                                            }
                                        }}
                                    />
                                    <button className="px-4 py-2 text-white bg-blue-500 rounded-lg transition duration-0.3s hover:bg-blue-600"
                                        onClick={handleSendMessage}
                                    >
                                        <IoMdSend />
                                    </button>
                                </div>
                            </>
                        }
                        {
                            !chatStarted && <StartChatInterface
                                handleEnterConversation={handleEnterConversation}
                            />
                        }

                    </div>

                </div>
            )}

            <div
                className="fixed bottom-10 right-10 bg-blue-500 rounded-full shadow-md h-14 w-14 cursor-pointer justify-center items-center flex"
                onClick={toggleChat}
            >
                {
                    !isChatOpen ? <MdOutlineExpandLess color="white" size={25} /> : <MdOutlineExpandMore color="white" size={25} />
                }
            </div>
        </div>
    )
}

export default ChatWidget 