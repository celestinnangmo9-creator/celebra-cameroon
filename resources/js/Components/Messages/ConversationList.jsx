import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import ConversationItem from './ConversationItem';

export default function ConversationList({ contacts, activeContact, unreadPerContact }) {
    const [filter, setFilter] = useState('Tous');
    const [search, setSearch] = useState('');

    // Filtrage basique simulé (à adapter si le backend fournit d'autres infos)
    const filteredContacts = contacts.filter(contact => {
        // Recherche textuelle
        const matchSearch = contact.name.toLowerCase().includes(search.toLowerCase());
        
        // Filtres
        if (filter === 'Non lus') {
            return matchSearch && (unreadPerContact[contact.id] > 0);
        }
        if (filter === 'Favoris') {
            // Placeholder: si la logique des favoris existe, l'ajouter ici.
            // Actuellement on affiche tous ceux qui matchent la recherche si Favoris n'est pas géré
            return matchSearch; 
        }
        return matchSearch;
    });

    const unreadCountTotal = contacts.filter(c => unreadPerContact[c.id] > 0).length;

    return (
        <div className={`md:w-1/3 flex-col bg-white border-r border-gray-200 ${activeContact ? 'hidden md:flex' : 'flex w-full'}`}>
            {/* Header Liste */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Link href={route('dashboard')} className="md:hidden w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-full transition-colors shrink-0">
                        <i className="fa-solid fa-arrow-left text-lg"></i>
                    </Link>
                    <h2 className="text-xl font-fraunces font-bold text-[#0B3D2E]">Messages</h2>
                </div>
                <button className="w-8 h-8 flex items-center justify-center text-[#0B3D2E] hover:bg-emerald-50 rounded-full transition-colors">
                    <i className="fa-solid fa-plus text-lg"></i>
                </button>
            </div>

            {/* Recherche */}
            <div className="px-4 py-3">
                <div className="relative">
                    <i className="fa-solid fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-[#FAF6F0] border-none rounded-full pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-[#0B3D2E] text-gray-800 placeholder-gray-400 font-inter"
                    />
                </div>
            </div>

            {/* Filtres */}
            <div className="px-4 pb-3 border-b border-gray-100 flex gap-2 overflow-x-auto no-scrollbar">
                {['Tous', 'Non lus', 'Favoris'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                            filter === f 
                            ? 'bg-[#0B3D2E] text-white' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {f} {f === 'Non lus' && unreadCountTotal > 0 && `(${unreadCountTotal})`}
                    </button>
                ))}
            </div>

            {/* Liste des conversations */}
            <div className="overflow-y-auto flex-grow bg-white">
                {filteredContacts.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm font-inter">
                        {search ? "Aucune conversation trouvée." : "Vous n'avez pas de message."}
                    </div>
                ) : (
                    filteredContacts.map(contact => (
                        <ConversationItem 
                            key={contact.id}
                            contact={contact}
                            isActive={activeContact?.id === contact.id}
                            unreadCount={unreadPerContact[contact.id] || 0}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
