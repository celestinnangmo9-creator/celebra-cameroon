import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useUnreadMessages } from '@/Contexts/UnreadMessagesContext';
import { useLanguage } from '../../Contexts/LanguageContext';

export default function MessagesIndex(props) {
    const { t } = useLanguage();
    return (
        <AuthenticatedLayout user={props.auth.user}>
            <Head title={t('messages.page_title')} />
            <MessagesContent {...props} t={t} />
        </AuthenticatedLayout>
    );
}

function MessagesContent({ auth, contacts, activeContact, messages: initialMessages, selectedVenue, appointments, allVenues, t }) {
    const [messages, setMessages] = useState(initialMessages || []);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const { data, setData, post, processing, reset } = useForm({
        receiver_id: activeContact ? activeContact.id : '',
        content: '',
        venue_id: selectedVenue ? selectedVenue.id : ''
    });
    
    const { unreadPerContact, markContactAsRead } = useUnreadMessages();

    // Mark as read when active contact changes
    useEffect(() => {
        if (activeContact?.id) {
            markContactAsRead(activeContact.id);
        }
    }, [activeContact?.id]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Garde les messages synchronisés quand on change de contact (nouvelle page Inertia)
    useEffect(() => {
        setMessages(initialMessages || []);
    }, [initialMessages]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Écoute en temps réel via Pusher/Laravel Echo
    useEffect(() => {
        if (!activeContact || !auth?.user?.id) return;

        const ids = [auth.user.id, activeContact.id].sort((a, b) => a - b);
        const channelName = `conversation.${ids[0]}.${ids[1]}`;

        const channel = window.Echo.private(channelName)
            .listen('.message.sent', (e) => {
                setMessages(prev => {
                    // Évite les doublons si le message existe déjà
                    if (prev.some(m => m.id === e.message.id)) return prev;
                    return [...prev, e.message];
                });
            });

        return () => {
            window.Echo.leave(channelName);
        };
    }, [activeContact?.id, auth?.user?.id]);

    const submit = (e) => {
        e.preventDefault();
        
        if (!data.content.trim()) return;

        // 1. Optimistic Update
        const tempId = Date.now();
        const optimisticMessage = {
            id: tempId,
            sender_id: auth.user.id,
            receiver_id: activeContact.id,
            venue_id: selectedVenue ? selectedVenue.id : null,
            content: data.content,
            created_at: new Date().toISOString(),
            is_read: false,
            optimistic: true
        };

        // Immediately add to local state
        setMessages(prev => [...prev, optimisticMessage]);
        
        // Save content and clear input
        const messageContent = data.content;
        setData('content', '');

        // 2. Send via Axios
        window.axios.post(route('messages.store'), {
            receiver_id: activeContact.id,
            venue_id: selectedVenue ? selectedVenue.id : null,
            content: messageContent,
        }, {
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            // Replace optimistic message with the real one from DB (with correct ID)
            if (response.data && response.data.message) {
                setMessages(prev => prev.map(m => m.id === tempId ? response.data.message : m));
            }
        }).catch(error => {
            console.error(t('messages.send_error'), error);
            // Revert optimistic update if failed
            setMessages(prev => prev.filter(m => m.id !== tempId));
            setData('content', messageContent); // Restore input
        });
    };

    return (
        <div className="flex-1 flex flex-col w-full py-0 md:py-6 touch-pan-x touch-pan-y">
                <div className="max-w-7xl mx-auto md:px-6 lg:px-8 flex-1 flex flex-col w-full">
                    <div className="bg-white overflow-hidden md:shadow-sm md:rounded-lg h-full flex md:border border-gray-200">

                        {/* Sidebar Contacts */}
                        <div className={`md:w-1/3 border-r border-gray-200 flex-col bg-gray-50 ${activeContact ? 'hidden md:flex' : 'flex w-full'}`}>
                            <div className="p-4 border-b border-gray-200 bg-white shadow-sm z-10 flex items-center gap-3">
                                <Link href={route('dashboard')} className="md:hidden w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0">
                                    <i className="fa-solid fa-arrow-left text-lg"></i>
                                </Link>
                                <h3 className="text-lg font-bold text-gray-800"><i className="fa-solid fa-users mr-2 text-emerald-600"></i> {t('messages.contacts')}</h3>
                            </div>
                            <div className="overflow-y-auto flex-grow">
                                {contacts.length === 0 ? (
                                    <div className="p-6 text-center text-gray-500 text-sm">
                                        {t('messages.no_contacts')}
                                    </div>
                                ) : (
                                    contacts.map(contact => (
                                        <Link
                                            key={contact.id}
                                            href={route('messages.index', { contact: contact.id })}
                                            className={`block p-4 border-b border-gray-100 hover:bg-emerald-50 transition-colors ${activeContact?.id === contact.id ? 'bg-emerald-100/50 border-l-4 border-l-emerald-600' : 'border-l-4 border-l-transparent'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 md:w-10 md:h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 text-lg md:text-base shadow-sm">
                                                    {contact.name.charAt(0)}
                                                </div>
                                                <div className="overflow-hidden flex-grow">
                                                    <div className="font-bold text-gray-900 truncate text-base md:text-sm">{contact.name}</div>
                                                    <div className="text-sm md:text-xs text-gray-500 truncate">{contact.email}</div>
                                                </div>
                                                {unreadPerContact[contact.id] > 0 && (
                                                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                                                        {unreadPerContact[contact.id]}
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Main Chat Area */}
                        <div className={`md:w-2/3 flex-col bg-white min-w-0 ${activeContact ? 'flex w-full' : 'hidden md:flex'}`}>
                            {activeContact ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-3 md:p-4 border-b border-gray-200 flex items-center gap-3 bg-white shadow-sm z-10">
                                        <Link href={route('messages.index')} className="md:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0">
                                            <i className="fa-solid fa-arrow-left text-lg"></i>
                                        </Link>
                                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0 shadow-sm">
                                            {activeContact.name.charAt(0)}
                                        </div>
                                        <div className="overflow-hidden">
                                            <div className="font-bold text-gray-900 text-base md:text-lg truncate">{activeContact.name}</div>
                                            {selectedVenue && (
                                                <div className="text-[10px] md:text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full inline-block mt-0.5 truncate max-w-full border border-emerald-100">
                                                    {t('messages.linked_to')} {selectedVenue.title}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Messages Display */}
                                    <div 
                                        className="flex-grow overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-[#f4f7f6] flex flex-col gap-4 cursor-text"
                                        onClick={() => inputRef.current?.focus()}
                                    >
                                        {messages.length === 0 ? (
                                            <div className="text-center text-gray-400 mt-10">
                                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600/50">
                                                    <i className="fa-regular fa-comments text-4xl"></i>
                                                </div>
                                                <p className="text-sm">{t('messages.start_conversation')}</p>
                                            </div>
                                        ) : (
                                            messages.map((msg, index) => {
                                                const isMine = msg.sender_id === auth.user.id;
                                                return (
                                                    <div key={msg.id} className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMine ? 'self-end' : 'self-start'}`}>
                                                        <div className={`p-3 rounded-2xl shadow-sm text-sm md:text-base break-words whitespace-pre-wrap ${isMine ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'}`}>
                                                            {msg.content}
                                                        </div>
                                                        <div className={`text-[10px] mt-1 flex items-center gap-1 ${isMine ? 'justify-end text-emerald-100' : 'justify-start text-gray-400'}`}>
                                                            <span className={isMine ? 'text-gray-500' : ''}>
                                                                {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                            {isMine && (
                                                                <i className={`fa-solid fa-check-double text-[11px] ${msg.is_read ? 'text-blue-500' : 'text-gray-400'}`}></i>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                        <div ref={messagesEndRef} className="h-2" />
                                    </div>

                                    {/* Message Input */}
                                    <div className="p-3 md:p-4 border-t border-gray-200 bg-white pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:pb-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                                        <form onSubmit={submit} className="flex gap-2 relative">
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={data.content}
                                                onChange={e => setData('content', e.target.value)}
                                                placeholder={t('messages.placeholder')}
                                                className="w-full border-gray-300 rounded-full pl-5 pr-14 py-3 md:py-3.5 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50 text-base shadow-inner"
                                                required
                                            />
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="absolute right-1.5 top-1.5 bottom-1.5 bg-emerald-600 hover:bg-emerald-700 text-white w-[calc(100%-4px)] max-w-[2.5rem] md:max-w-[3rem] aspect-square rounded-full flex items-center justify-center transition-colors disabled:opacity-50 shadow-md"
                                            >
                                                <i className="fa-solid fa-paper-plane text-sm md:text-base ml-[-2px]"></i>
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-grow flex items-center justify-center text-gray-400 flex-col bg-gray-50/50 hidden md:flex">
                                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-emerald-600/30">
                                        <i className="fa-regular fa-comment-dots text-5xl"></i>
                                    </div>
                                    <p className="text-lg font-medium text-gray-500">{t('messages.select_contact')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
    );
}
