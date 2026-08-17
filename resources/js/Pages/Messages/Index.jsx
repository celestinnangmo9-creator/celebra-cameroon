import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, Link } from '@inertiajs/react';

export default function MessagesIndex({ auth, contacts, activeContact, messages: initialMessages, selectedVenue, appointments, allVenues }) {
    const [messages, setMessages] = useState(initialMessages || []);
    const messagesEndRef = useRef(null);
    const { data, setData, post, processing, reset } = useForm({
        receiver_id: activeContact ? activeContact.id : '',
        content: '',
        venue_id: selectedVenue ? selectedVenue.id : ''
    });

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

        post(route('messages.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset('content');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Messagerie</h2>}
        >
            <Head title="Messagerie" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 h-[75vh]">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg h-full flex border border-gray-200">

                        {/* Sidebar Contacts */}
                        <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
                            <div className="p-4 border-b border-gray-200 bg-white">
                                <h3 className="text-lg font-bold text-gray-800"><i className="fa-solid fa-users mr-2 text-emerald-600"></i> Contacts</h3>
                            </div>
                            <div className="overflow-y-auto flex-grow">
                                {contacts.length === 0 ? (
                                    <div className="p-6 text-center text-gray-500 text-sm">
                                        Aucun contact pour le moment.
                                    </div>
                                ) : (
                                    contacts.map(contact => (
                                        <Link
                                            key={contact.id}
                                            href={route('messages.index', { contact: contact.id })}
                                            className={`block p-4 border-b border-gray-100 hover:bg-emerald-50 transition-colors ${activeContact?.id === contact.id ? 'bg-emerald-100/50 border-l-4 border-l-emerald-600' : 'border-l-4 border-l-transparent'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                                                    {contact.name.charAt(0)}
                                                </div>
                                                <div className="overflow-hidden">
                                                    <div className="font-bold text-gray-900 truncate">{contact.name}</div>
                                                    <div className="text-xs text-gray-500 truncate">{contact.email}</div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Main Chat Area */}
                        <div className="w-2/3 flex flex-col bg-white">
                            {activeContact ? (
                                <>
                                    {/* Chat Header */}
                                    <div className="p-4 border-b border-gray-200 flex items-center gap-3 bg-white">
                                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                                            {activeContact.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900 text-lg">{activeContact.name}</div>
                                            {selectedVenue && (
                                                <div className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded inline-block mt-0.5">
                                                    À propos de : {selectedVenue.title}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Messages Display */}
                                    <div className="flex-grow overflow-y-auto p-6 bg-gray-50/50 flex flex-col gap-4">
                                        {messages.length === 0 ? (
                                            <div className="text-center text-gray-400 mt-10">
                                                <i className="fa-regular fa-comments text-4xl mb-3"></i>
                                                <p>Envoyez un message pour démarrer la conversation avec {activeContact.name}.</p>
                                            </div>
                                        ) : (
                                            messages.map((msg, index) => {
                                                const isMine = msg.sender_id === auth.user.id;
                                                return (
                                                    <div key={msg.id} className={`flex flex-col max-w-[75%] ${isMine ? 'self-end' : 'self-start'}`}>
                                                        <div className={`p-3 rounded-2xl ${isMine ? 'bg-emerald-600 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm'}`}>
                                                            {msg.content}
                                                        </div>
                                                        <div className={`text-[10px] text-gray-400 mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
                                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </div>
                                                    </div>
                                                );
                                            })
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Message Input */}
                                    <div className="p-4 border-t border-gray-200 bg-white">
                                        <form onSubmit={submit} className="flex gap-2 relative">
                                            <input
                                                type="text"
                                                value={data.content}
                                                onChange={e => setData('content', e.target.value)}
                                                placeholder="Écrivez votre message..."
                                                className="w-full border-gray-300 rounded-full pl-4 pr-12 py-3 focus:border-emerald-500 focus:ring-emerald-500 bg-gray-50"
                                                required
                                            />
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="absolute right-2 top-1.5 bottom-1.5 bg-emerald-600 hover:bg-emerald-700 text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors disabled:opacity-50"
                                            >
                                                <i className="fa-solid fa-paper-plane text-sm"></i>
                                            </button>
                                        </form>
                                    </div>
                                </>
                            ) : (
                                <div className="flex-grow flex items-center justify-center text-gray-400 flex-col">
                                    <i className="fa-regular fa-comment-dots text-6xl mb-4 text-gray-200"></i>
                                    <p className="text-lg">Sélectionnez un contact pour discuter</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
