import { useState, useRef } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { useLanguage } from '@/Contexts/LanguageContext';

export default function ProfileCard({ user }) {
    const { t } = useLanguage();
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    // Inertia useForm specifically for updating the profile
    const { data, setData, post, processing, errors, setError, clearErrors, progress } = useForm({
        _method: 'patch',
        name: user.name,
        email: user.email,
        avatar: null,
    });

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            clearErrors('avatar');

            // Client-side validation: 5MB limit
            if (file.size > 5 * 1024 * 1024) {
                setError('avatar', t('profile.avatar_too_large', 'La photo de profil ne doit pas dépasser 5 Mo.'));
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            setData('avatar', file);
            
            // Create a local preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);

            // Automatically submit the form to update avatar
            // We use setTimeout to ensure React state has updated the 'avatar' field in data
            setTimeout(() => {
                post(route('profile.update'), {
                    preserveScroll: true,
                    onSuccess: () => {
                        // Success toast is handled by global layout
                    },
                    onError: () => {
                        setPreviewUrl(null); // Revert preview on error
                    }
                });
            }, 100);
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-purple-900/30 dark:text-purple-400">Administrateur</span>;
            case 'host':
                return <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-amber-900/30 dark:text-amber-400">Hôte</span>;
            default:
                return <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-900/30 dark:text-blue-400">Client</span>;
        }
    };

    const displayAvatar = previewUrl || (user.avatar ? (user.avatar.startsWith('http') || user.avatar.startsWith('/') ? user.avatar : `/storage/${user.avatar}`) : null);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700/50 p-6 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none"></div>

            {/* Avatar Section */}
            <div className="relative group shrink-0">
                <div 
                    onClick={handleAvatarClick}
                    className="w-24 h-24 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold text-3xl overflow-hidden shadow-md cursor-pointer border-4 border-white dark:border-gray-800 relative z-10 transition-transform group-hover:scale-105"
                >
                    {displayAvatar ? (
                        <img src={displayAvatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        user.name.charAt(0).toUpperCase()
                    )}
                    
                    {/* Hover overlay for changing picture */}
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <i className="fa-solid fa-camera text-white mb-1"></i>
                        <span className="text-white text-[10px] font-medium leading-tight px-1 text-center">Modifier</span>
                    </div>
                </div>

                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/jpeg, image/png, image/jpg, image/webp" 
                />

                {processing && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-md z-20">
                        <i className="fa-solid fa-circle-notch fa-spin text-emerald-600 text-sm"></i>
                    </div>
                )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left z-10">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
                    <div>{getRoleBadge(user.role)}</div>
                </div>
                <div className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-2 mb-1">
                    <i className="fa-solid fa-envelope text-gray-400"></i>
                    {user.email}
                </div>
                <div className="text-gray-400 dark:text-gray-500 text-sm flex items-center justify-center md:justify-start gap-2">
                    <i className="fa-regular fa-calendar text-gray-400"></i>
                    Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                </div>
                
                {errors.avatar && (
                    <div className="mt-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-md inline-block">
                        <i className="fa-solid fa-circle-exclamation mr-1"></i> {errors.avatar}
                    </div>
                )}
            </div>
        </div>
    );
}
