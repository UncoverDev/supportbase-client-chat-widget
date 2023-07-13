import React from 'react';
import { format } from 'date-fns';

const ChatBubble = ({ message, timestamp, isUser }) => {
    return (
        <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} mt-1`}>
            <div
                style={{ maxWidth: '90%' }}
                className={`rounded-lg p-4 ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} max-w-3/4`}
            >
                <p className="text-sm text-left">{message}</p>
                {/* <p className="text-xs text-right">{format(new Date(timestamp), 'hh:mm a')}</p> */}
            </div>
        </div>
    );
};

export default ChatBubble;