import React, { useEffect, useState } from 'react'
import { IoMdSend } from 'react-icons/io'
import { MdOutlineSearch } from 'react-icons/md'
import { nanoid } from 'nanoid'
import { socket } from '../socket'

const ConversationsOnStartChat = (props) => {
    const { conversations, handleEnterConversation } = props
    const [_identifier, _setIdentifier] = useState(null)
    const [userIdentifier, setUserIdentifier] = useState(null)

    const createNewIdentifierOnLocalStorage = (createNew) => {
        if (createNew) {
            let ExistingIdentifier = localStorage.getItem('conversations-identifier')
            if (ExistingIdentifier) {
                let newIdentifier = nanoid()
                localStorage.setItem('conversations-identifier', JSON.stringify([...JSON.parse(ExistingIdentifier), newIdentifier]))
                return newIdentifier
            }
            let identifier = nanoid()
            localStorage.setItem('conversations-identifier', JSON.stringify([identifier]))
            return identifier
        }
        //check if identifier exists
        let identifier = localStorage.getItem('conversations-identifier')
        if (identifier) {
            return JSON.parse(identifier)[0]
        }
        if (!identifier) {
            identifier = nanoid()
            localStorage.setItem('conversations-identifier', JSON.stringify([identifier]))
        }
        return identifier
    }

    const createUserIdentifier = () => {
        const existingUserIdentifier = localStorage.getItem('user-identifier')
        if (existingUserIdentifier) return setUserIdentifier(existingUserIdentifier)
        let identifier = nanoid()
        localStorage.setItem('user-identifier', identifier)
        setUserIdentifier(identifier)
    }

    useEffect(() => {
        createUserIdentifier();
        let identifier = createNewIdentifierOnLocalStorage(true);
        _setIdentifier(identifier);
    }, [])

    const createNewConversation = () => {
        if (!socket) return
        let conversationProps = {
            id: nanoid(),
            identifier: _identifier,
            user: userIdentifier,
        }
        socket.emit('createNewConversation', conversationProps)
    }

    const truncateString = (str, maxLength = 15) => {
        if (str.length <= maxLength) {
            return str;
        }

        return str.substring(0, maxLength) + "...";
    }

   


    const allConversations = conversations.map((conversation, index) => {
        return <div key={index} className='flex justify-start items-center p-3 text-white min-h-[50px] w-[100%] cursor-pointer' style={{ fontSize: '15px' }}
            onClick={() => handleEnterConversation(conversation)}
        >
            <div
                className='min-h-[35px] min-w-[35px] max-h-[35px] max-w-[35px] rounded-full bg-[#3e8ff9] mr-1 overflow-hidden'
            >
                <img src="https://th.bing.com/th/id/R.09fdeb49402aa0184c909f874c7ab668?rik=QdcLbhMgeY5QsA&pid=ImgRaw&r=0" alt="" />
            </div>
            <div className='flex flex-col justify-start items-start h-full w-full mr-1 pl-1'>
                <p className='text-black text-[13px]'>
                    Name
                </p>
                <p className='text-black text-[12px]'>
                    {truncateString(conversation?.lastConversation?.message)}
                </p>
            </div>
            <div className='flex flex-col justify-center items-center h-full min-w-[70px] gap-1'>
                <p className='text-[green] text-[11px]'>
                    Active
                </p>
                <div className='text-white text-md pb-1 flex justify-center items-center'>
                    <IoMdSend
                        size={16}
                        color={"#3e8ff9"}
                        cursor={"pointer"}
                    />
                </div>
            </div>
        </div>
    })

    return (
        <div
            className='w-[100%] rounded-t relative mt-[-20px] p-3 pt-0'
        >
            <div className='bg-[white] min-h-[50px] rounded shadow-md'>
                <p className='text-white text-md'>
                    Conversations
                </p>
                {conversations?.length ?
                    <div
                        className='h-[auto] w-[100%] flex flex-col justify-start items-start min-h-[50px]'
                    >
                        {allConversations}
                    </div> : <div className='h-[auto] w-[100%] flex flex-col justify-center items-center'>
                        <p className='text-black text-[14px] mb-5'>
                            No conversations yet
                        </p>
                    </div>
                }

            </div>
            <div className='bg-[white] min-h-[40px] rounded shadow-md mt-2 flex justify-start items-start'>
                <input
                    type="text"
                    placeholder='Search for answers here...'
                    className='w-[100%] h-[100%] rounded-l p-2 outline-none'
                />
                <div className='bg-[#3e8ff9] h-[40px] w-[60px] flex justify-center items-center rounded-r'>
                    <MdOutlineSearch
                        size={25}
                        color={"white"}
                        cursor={"pointer"}
                    />
                </div>
            </div>
            <div className='bg-[white] min-h-[40px] rounded shadow-md mt-2 flex justify-start items-start p-4'>
                <div
                    className='w-full h-[40px] rounded bg-blue-500 flex justify-center items-center text-white cursor-pointer'
                    onClick={
                        createNewConversation
                    }
                >
                    <IoMdSend
                        size={16}
                        color={"white"}
                        cursor={"pointer"}
                    />
                    <p className='text-white text-md ml-2'>
                        New Conversation
                    </p>
                </div>
            </div>

        </div>
    )
}

export default ConversationsOnStartChat