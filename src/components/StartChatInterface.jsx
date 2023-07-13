import React from 'react'
import { MdOutlineCancel } from 'react-icons/md'
import ConversationsOnStartChat from './ConversationsOnStartChat'
import axios from 'axios'

const StartChatInterface = (props) => {
    const { socket, handleEnterConversation } = props
    const [conversations, setConversations] = React.useState([])
    const getAllConversations = async (identifier) => {
        try {
            const { data } = await axios.get(`http://localhost:8000/v1/chatrooms/get_all/${identifier}`)
            setConversations(data?.data ?? [])
        } catch (error) {
            console.log(error);
        };
    }

    React.useEffect(() => {
        let identifier = localStorage.getItem('user-identifier');
        if (!identifier) return
        getAllConversations(identifier)
    }, [])

    return (
        <>
            <div
                className='h-[230px] w-30 bg-[#3e8ff9] rounded-t relative mb-50'
            >
                <div
                    className='flex justify-end align-center p-3'
                >
                    <MdOutlineCancel
                        size={30}
                        className='cursor-pointer'
                        color='white'
                    />
                </div>
                <div className='flex justify-start items-center p-3 text-white' style={{ fontSize: '30px' }}>
                    Hello there 👋
                </div>
                <div className='flex justify-start items-center p-3 text-white ' style={{ fontSize: '15px' }}>
                    How can we help you? 🤔 Search our help center for answers to frequently asked questions or send us a message.
                </div>
            </div>
            <ConversationsOnStartChat socket={socket} conversations={conversations} handleEnterConversation={handleEnterConversation} />

        </>
    )
}

export default StartChatInterface