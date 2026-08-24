import React from 'react';
import { Link } from '@inertiajs/react';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

export default function ChatWindow({ 
    activeContact, 
    messages, 
    auth, 
    selectedVenue, 
    inputRef, 
    messagesEndRef, 
    data, 
    setData, 
    submit, 
    processing 
}) {
    // Si aucun contact n'est sélectionné, on affiche l'état vide
    if (!activeContact) {
        return (
            <div className="md:w-2/3 flex-grow flex items-center justify-center text-gray-400 flex-col bg-[#FAF6F0]/50 hidden md:flex">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 text-[#0B3D2E]/30 shadow-sm border border-gray-100">
                    <i className="fa-regular fa-comment-dots text-5xl"></i>
                </div>
                <p className="text-lg font-medium text-gray-500 font-inter">Sélectionnez un contact pour discuter</p>
            </div>
        );
    }

    return (
        <div className="md:w-2/3 flex-col bg-white min-w-0 flex w-full h-full relative">
            {/* Header */}
            <div className="p-3 md:p-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
                <div className="flex items-center gap-3">
                    <Link href={route('messages.index')} className="md:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0">
                        <i className="fa-solid fa-arrow-left text-lg"></i>
                    </Link>
                    <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-[#0B3D2E] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                            {activeContact.name.charAt(0)}
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="overflow-hidden">
                        <div className="font-bold text-gray-900 text-base truncate font-inter">{activeContact.name}</div>
                        <div className="text-xs text-gray-500">En ligne</div>
                    </div>
                </div>
                
                {/* Actions (Téléphone, Menu) */}
                <div className="flex items-center gap-2">
                    <button className="w-10 h-10 rounded-full text-[#0B3D2E] hover:bg-emerald-50 flex items-center justify-center transition-colors">
                        <i className="fa-solid fa-phone"></i>
                    </button>
                    <button className="w-10 h-10 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center transition-colors">
                        <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                </div>
            </div>

            {selectedVenue && (
                <div className="bg-[#FAF6F0] px-4 py-2 border-b border-gray-100 text-sm font-inter text-center">
                    <span className="text-gray-600">À propos de : </span>
                    <span className="font-bold text-[#0B3D2E]">{selectedVenue.title}</span>
                </div>
            )}

            {/* Messages Area */}
            <div 
                className="flex-grow overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-white flex flex-col gap-4 cursor-text"
                onClick={() => inputRef.current?.focus()}
            >
                {/* Séparateur de date simulé */}
                {messages.length > 0 && (
                    <div className="flex justify-center my-2">
                        <span className="text-[11px] font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                            Aujourd'hui
                        </span>
                    </div>
                )}

                {messages.length === 0 ? (
                    <div className="text-center text-gray-400 mt-10">
                        <div className="w-20 h-20 bg-[#FAF6F0] rounded-full flex items-center justify-center mx-auto mb-4 text-[#0B3D2E]/50 border border-gray-100">
                            <i className="fa-regular fa-comments text-4xl"></i>
                        </div>
                        <p className="text-sm font-inter">Envoyez un message pour démarrer la conversation.</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <MessageBubble 
                            key={msg.id} 
                            message={msg} 
                            isMine={msg.sender_id === auth.user.id} 
                        />
                    ))
                )}
                <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input Area */}
            <MessageInput 
                data={data}
                setData={setData}
                submit={submit}
                processing={processing}
                inputRef={inputRef}
            />
        </div>
    );
}
