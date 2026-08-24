import React from 'react';

export default function MessageInput({ data, setData, submit, processing, inputRef }) {
    return (
        <div className="p-3 md:p-4 border-t border-gray-100 bg-white pb-[calc(env(safe-area-inset-bottom)+0.75rem)] md:pb-4 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.03)] z-20">
            <form onSubmit={submit} className="flex items-end gap-2 max-w-4xl mx-auto w-full">
                {/* Icône Pièce jointe */}
                <button 
                    type="button"
                    className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors mb-1"
                >
                    <i className="fa-solid fa-plus text-xl"></i>
                </button>

                {/* Champ de texte */}
                <div className="relative flex-grow bg-[#FAF6F0] rounded-3xl flex items-center shadow-inner overflow-hidden border border-gray-200">
                    <textarea
                        ref={inputRef}
                        value={data.content}
                        onChange={e => setData('content', e.target.value)}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                submit(e);
                            }
                        }}
                        placeholder="Message..."
                        className="w-full bg-transparent border-none focus:ring-0 text-gray-800 font-inter resize-none py-3 pl-4 pr-12 min-h-[44px] max-h-32"
                        style={{ fontSize: '16px' }} // Empêche le zoom auto sur iOS
                        rows={1}
                        required
                    />
                    
                    {/* Icônes optionnelles dans le champ (ex: micro) */}
                    <button 
                        type="button" 
                        className="absolute right-2 bottom-1.5 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#0B3D2E] transition-colors"
                    >
                        <i className="fa-solid fa-microphone"></i>
                    </button>
                </div>

                {/* Bouton d'envoi */}
                <button
                    type="submit"
                    disabled={processing || !data.content.trim()}
                    className="w-11 h-11 shrink-0 bg-[#0B3D2E] hover:bg-emerald-900 text-white rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:scale-95 shadow-md mb-0.5"
                >
                    <i className="fa-solid fa-paper-plane text-lg ml-[-2px]"></i>
                </button>
            </form>
        </div>
    );
}
