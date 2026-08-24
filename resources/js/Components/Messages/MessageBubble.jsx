import React from 'react';

export default function MessageBubble({ message, isMine }) {
    // Formater l'heure
    const timeString = new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div className={`flex flex-col max-w-[85%] md:max-w-[75%] ${isMine ? 'self-end' : 'self-start'}`}>
            <div 
                className={`p-3 md:p-4 text-sm md:text-base break-words whitespace-pre-wrap font-inter shadow-sm ${
                    isMine 
                    ? 'bg-[#0B3D2E] text-white rounded-2xl rounded-br-sm' 
                    : 'bg-[#FAF6F0] text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100'
                }`}
            >
                {message.content}
            </div>
            
            <div className={`text-[10px] md:text-xs mt-1 flex items-center gap-1 ${isMine ? 'justify-end text-gray-500' : 'justify-start text-gray-400'}`}>
                <span>{timeString}</span>
                {isMine && (
                    <i className={`fa-solid fa-check-double text-[11px] ${message.is_read ? 'text-[#C9A227]' : 'text-gray-300'}`}></i>
                )}
            </div>
        </div>
    );
}
