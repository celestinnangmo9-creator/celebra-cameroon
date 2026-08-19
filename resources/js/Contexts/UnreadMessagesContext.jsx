import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

const UnreadMessagesContext = createContext();

export function UnreadMessagesProvider({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const [totalUnread, setTotalUnread] = useState(auth?.unread_messages_count || 0);
    const [unreadPerContact, setUnreadPerContact] = useState(auth?.unread_per_contact || {});
    const [latestMessageToast, setLatestMessageToast] = useState(null);

    const prevUnreadCountRef = useRef(auth?.unread_messages_count);
    const prevUnreadPerContactRef = useRef(JSON.stringify(auth?.unread_per_contact || {}));

    // Update state from Inertia shared props only if server data has actually changed (prevents overwriting local updates on mount)
    useEffect(() => {
        const currentPerContactString = JSON.stringify(auth?.unread_per_contact || {});
        
        if (
            auth?.unread_messages_count !== prevUnreadCountRef.current || 
            currentPerContactString !== prevUnreadPerContactRef.current
        ) {
            if (auth?.unread_messages_count !== undefined) {
                setTotalUnread(auth.unread_messages_count);
            }
            if (auth?.unread_per_contact !== undefined) {
                setUnreadPerContact(auth.unread_per_contact);
            }
            
            prevUnreadCountRef.current = auth?.unread_messages_count;
            prevUnreadPerContactRef.current = currentPerContactString;
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
        // ALWAYS update DB to ensure consistency, even if local state is out of sync
        axios.post(route('messages.markAsRead', { contact: contactId }))
            .catch(err => console.error("Erreur lors du marquage des messages comme lus", err));

        // Use functional state updates to avoid stale closure issues
        setUnreadPerContact(prevPerContact => {
            const count = prevPerContact[contactId] || 0;
            
            if (count > 0) {
                setTotalUnread(prevTotal => Math.max(0, prevTotal - count));
            }
            
            return { ...prevPerContact, [contactId]: 0 };
        });
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
