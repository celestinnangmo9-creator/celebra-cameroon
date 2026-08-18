import { createContext, useContext, useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

const UnreadMessagesContext = createContext();

export function UnreadMessagesProvider({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [totalUnread, setTotalUnread] = useState(0);
    const [unreadPerContact, setUnreadPerContact] = useState({});
    const [latestMessageToast, setLatestMessageToast] = useState(null);

    // Initialize state from Inertia shared props (this handles page reloads seamlessly)
    useEffect(() => {
        if (auth?.unread_messages_count !== undefined) {
            setTotalUnread(auth.unread_messages_count);
        }
        if (auth?.unread_per_contact) {
            setUnreadPerContact(auth.unread_per_contact);
        }
    }, [auth?.unread_messages_count, auth?.unread_per_contact]);

    // Listen to private user channel for new messages
    useEffect(() => {
        if (user && window.Echo) {
            const channel = window.Echo.private(`App.Models.User.${user.id}`);
            
            channel.listen('UnreadMessageNotification', (e) => {
                // Determine if we should increment unread counts
                const currentUrl = new URL(window.location.href);
                const isMessagesPage = currentUrl.pathname.startsWith('/messages');
                const activeContactParam = currentUrl.searchParams.get('contact');
                
                if (isMessagesPage && activeContactParam == e.senderId) {
                    // Chat is open, do nothing (or explicitly mark as read).
                    return;
                }

                // Otherwise, increment unread counts
                setTotalUnread(prev => prev + 1);
                setUnreadPerContact(prev => ({
                    ...prev,
                    [e.senderId]: (prev[e.senderId] || 0) + 1
                }));

                // Show a toast if we are NOT on the messages page
                if (!isMessagesPage) {
                    setLatestMessageToast({
                        senderId: e.senderId,
                        time: Date.now()
                    });
                    
                    // Auto-hide toast after 3 seconds
                    setTimeout(() => {
                        setLatestMessageToast(null);
                    }, 4000);
                }
            });

            return () => {
                channel.stopListening('UnreadMessageNotification');
            };
        }
    }, [user]);

    const markContactAsRead = (contactId) => {
        if (unreadPerContact[contactId] > 0) {
            const count = unreadPerContact[contactId];
            setTotalUnread(prev => Math.max(0, prev - count));
            setUnreadPerContact(prev => ({ ...prev, [contactId]: 0 }));
            
            // Mark as read in DB via API
            axios.post(route('messages.markAsRead', { contact: contactId }))
                .catch(err => console.error("Erreur lors du marquage des messages comme lus", err));
        }
    };

    return (
        <UnreadMessagesContext.Provider value={{ totalUnread, unreadPerContact, markContactAsRead, latestMessageToast, setLatestMessageToast }}>
            {children}
        </UnreadMessagesContext.Provider>
    );
}

export function useUnreadMessages() {
    return useContext(UnreadMessagesContext);
}
