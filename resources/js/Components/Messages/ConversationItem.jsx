import React from 'react';
import { Link } from '@inertiajs/react';

export default function ConversationItem({ contact, isActive, unreadCount }) {
    // Dans une application réelle, on pourrait avoir l'heure du dernier message.
    // Pour l'instant, on laisse un placeholder ou on s'adapte aux données existantes.
    const lastMessageTime = contact.last_message_time || "";
    const lastMessagePreview = contact.last_message_preview || "Nouveau message...";

    return (
        <Link
            href={route('messages.index', { contact: contact.id })}
            className={`block p-4 border-b border-gray-100 transition-colors ${
                isActive 
                ? 'bg-emerald-50 border-l-4 border-l-[#0B3D2E]' 
                : 'bg-white hover:bg-gray-50 border-l-4 border-l-transparent'
            }`}
        >
            <div className="flex items-center gap-3">
                {/* Avatar avec indicateur en ligne (simulation) */}
                <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#0B3D2E] text-white flex items-center justify-center font-bold text-lg shadow-sm overflow-hidden">
                        {contact.avatar ? (
                            <img src={contact.avatar.startsWith('http') || contact.avatar.startsWith('/') ? contact.avatar : `/storage/${contact.avatar}`} alt={contact.name} className="w-full h-full object-cover" />
                        ) : (
                            contact.name.charAt(0)
                        )}
                    </div>
                    {/* Indicateur "En ligne" simulé */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                
                {/* Infos du contact */}
                <div className="overflow-hidden flex-grow flex flex-col justify-center">
                    <div className="flex justify-between items-baseline mb-1">
                        <div className="font-bold text-gray-900 truncate text-base">{contact.name}</div>
                        {lastMessageTime && (
                            <div className="text-xs text-gray-400 shrink-0 ml-2">{lastMessageTime}</div>
                        )}
                    </div>
                    
                    <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-500 truncate font-inter">
                            {lastMessagePreview}
                        </div>
                        {unreadCount > 0 && (
                            <div className="w-5 h-5 rounded-full bg-[#0B3D2E] text-white flex items-center justify-center text-xs font-bold shrink-0 ml-2">
                                {unreadCount}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
