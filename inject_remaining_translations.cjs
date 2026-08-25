const fs = require('fs');
const path = require('path');

const updateLocale = (lang, newStrings) => {
    const filePath = `resources/js/locales/${lang}.json`;
    let content = {};
    if (fs.existsSync(filePath)) {
        content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    
    // Deep merge function
    function mergeDeep(target, source) {
        for (const key in source) {
            if (source[key] instanceof Object && key in target) {
                Object.assign(source[key], mergeDeep(target[key], source[key]));
            }
        }
        Object.assign(target || {}, source);
        return target;
    }

    mergeDeep(content, newStrings);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    console.log(`Updated ${lang}.json`);
};

const frStrings = {
    admin: {
        users: {
            confirm_delete: "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action placera le compte dans la corbeille (Soft Delete).",
            role: "Rôle",
            all_roles: "Tous les rôles",
            role_host: "Propriétaire",
            all_statuses: "Tous les statuts",
            status_blocked: "Bloqué",
            status_active: "Actif",
            reset: "Réinitialiser",
            change_role: "Changer de rôle",
            details: "Détails",
            unblock: "Débloquer",
            no_users: "Aucun utilisateur ne correspond à votre recherche.",
            showing_users: "Affichage de {count} sur {total} utilisateurs",
            role_label: "Rôle : {role}",
            status_label: "Statut : {status}",
            not_provided: "Non renseigné"
        },
        venues: {
            confirm_approve: "Êtes-vous sûr de vouloir approuver cette salle ?",
            all_statuses: "Tous les statuts",
            status_approved: "Approuvée",
            status_rejected: "Rejetée",
            reset: "Réinitialiser",
            details: "Détails",
            no_venues: "Aucune salle trouvée.",
            showing_venues: "Affichage de {count} sur {total} salles",
            suspend_venue: "Suspendre la salle",
            reject_venue: "Rejeter la salle",
            rejection_reason_placeholder: "Veuillez expliquer pourquoi cette salle ne respecte pas les critères..."
        }
    },
    dashboard: {
        subscription: {
            account_status: "Statut de votre compte :",
            status_expired: "Expiré",
            status_trial: "Essai Gratuit",
            status_active: "Actif",
            expired_message: "Votre abonnement est expiré. Vos salles sont masquées au public.",
            trial_remaining: "Il vous reste {days} jour(s) d'essai gratuit.",
            active_until: "Votre abonnement {plan} est actif jusqu'au {date}.",
            plan_premium: "Premium",
            plan_basic: "Basique",
            upgrade_prompt: "Passez à la vitesse supérieure et débloquez tout le potentiel de vos espaces événementiels sur Celebra Cameroon.",
            recommended: "Recommandé",
            unlimited_venues: "Salles actives illimitées",
            up_to_venues: "Jusqu'à {count} salles actives",
            booking_management: "Gestion des réservations",
            direct_messaging: "Messagerie directe avec les clients",
            verified_badge: "Badge \"Prestataire Vérifié\"",
            subscribe_to: "S'abonner à {plan}"
        }
    },
    venues: {
        create: {
            venue_details: "Détails de l'espace",
            title_label: "Titre de l'espace *",
            title_placeholder: "Ex: Palais des Lumières & Espace Banquet",
            category_label: "Catégorie *",
            region_label: "Région *",
            address_label: "Adresse précise *",
            capacity_label: "Capacité max. (Invités) *",
            description_label: "Description détaillée *",
            description_placeholder: "Décrivez l'ambiance, l'insonorisation, les conditions d'accès, etc.",
            main_image_label: "Image principale (Photo depuis la galerie ou caméra) *",
            gallery_label: "Autres Photos & Vidéos (Sélectionnez plusieurs fichiers)"
        },
        edit: {
            edit_venue: "Édition de l'espace",
            status_label: "Statut de la salle *",
            status_booked: "Réservé",
            gallery_add_label: "Ajouter de nouvelles photos/vidéos à la galerie (Optionnel)",
            save_changes: "Enregistrer les modifications"
        },
        stats: {
            confirm_unblock: "Voulez-vous vraiment débloquer ces dates ?",
            unavailability_list: "Liste des indisponibilités",
            unblock: "Débloquer",
            booking_status: "Réservation ({status})"
        }
    },
    favorites: {
        explore_venues: "Explorer les espaces"
    },
    host: {
        appointments: {
            confirm_status: "Êtes-vous sûr de vouloir {action} ce rendez-vous ?",
            action_confirm: "confirmer",
            action_refuse: "refuser",
            title: "Mes Rendez-vous",
            tab_confirmed: "Confirmés",
            tab_completed: "Passés",
            tab_refused: "Refusés",
            no_appointments: "Aucun rendez-vous trouvé dans cette catégorie.",
            type_physical: "Visite",
            type_video: "Appel Vidéo"
        }
    },
    errors: {
        503: "Désolé, nous sommes en maintenance. Veuillez réessayer plus tard.",
        500: "Oups, quelque chose a mal tourné sur nos serveurs.",
        404: "Désolé, la page que vous recherchez est introuvable.",
        403: "Désolé, vous n'êtes pas autorisé à accéder à cette page."
    },
    head: {
        home_title: "Celebra Cameroon - Trouver & Réserver des Salles"
    }
};

const enStrings = {
    admin: {
        users: {
            confirm_delete: "Are you sure you want to delete this user? This action will place the account in the trash (Soft Delete).",
            role: "Role",
            all_roles: "All roles",
            role_host: "Host",
            all_statuses: "All statuses",
            status_blocked: "Blocked",
            status_active: "Active",
            reset: "Reset",
            change_role: "Change role",
            details: "Details",
            unblock: "Unblock",
            no_users: "No users match your search.",
            showing_users: "Showing {count} of {total} users",
            role_label: "Role: {role}",
            status_label: "Status: {status}",
            not_provided: "Not provided"
        },
        venues: {
            confirm_approve: "Are you sure you want to approve this venue?",
            all_statuses: "All statuses",
            status_approved: "Approved",
            status_rejected: "Rejected",
            reset: "Reset",
            details: "Details",
            no_venues: "No venues found.",
            showing_venues: "Showing {count} of {total} venues",
            suspend_venue: "Suspend venue",
            reject_venue: "Reject venue",
            rejection_reason_placeholder: "Please explain why this venue does not meet the criteria..."
        }
    },
    dashboard: {
        subscription: {
            account_status: "Your account status:",
            status_expired: "Expired",
            status_trial: "Free Trial",
            status_active: "Active",
            expired_message: "Your subscription has expired. Your venues are hidden from the public.",
            trial_remaining: "You have {days} day(s) of free trial remaining.",
            active_until: "Your {plan} subscription is active until {date}.",
            plan_premium: "Premium",
            plan_basic: "Basic",
            upgrade_prompt: "Step up and unlock the full potential of your event spaces on Celebra Cameroon.",
            recommended: "Recommended",
            unlimited_venues: "Unlimited active venues",
            up_to_venues: "Up to {count} active venues",
            booking_management: "Booking management",
            direct_messaging: "Direct messaging with clients",
            verified_badge: "\"Verified Provider\" Badge",
            subscribe_to: "Subscribe to {plan}"
        }
    },
    venues: {
        create: {
            venue_details: "Venue details",
            title_label: "Venue title *",
            title_placeholder: "Ex: Palace of Lights & Banquet Hall",
            category_label: "Category *",
            region_label: "Region *",
            address_label: "Precise address *",
            capacity_label: "Max capacity (Guests) *",
            description_label: "Detailed description *",
            description_placeholder: "Describe the atmosphere, soundproofing, access conditions, etc.",
            main_image_label: "Main image (Photo from gallery or camera) *",
            gallery_label: "Other Photos & Videos (Select multiple files)"
        },
        edit: {
            edit_venue: "Edit venue",
            status_label: "Venue status *",
            status_booked: "Booked",
            gallery_add_label: "Add new photos/videos to gallery (Optional)",
            save_changes: "Save changes"
        },
        stats: {
            confirm_unblock: "Do you really want to unblock these dates?",
            unavailability_list: "Unavailability list",
            unblock: "Unblock",
            booking_status: "Booking ({status})"
        }
    },
    favorites: {
        explore_venues: "Explore venues"
    },
    host: {
        appointments: {
            confirm_status: "Are you sure you want to {action} this appointment?",
            action_confirm: "confirm",
            action_refuse: "refuse",
            title: "My Appointments",
            tab_confirmed: "Confirmed",
            tab_completed: "Completed",
            tab_refused: "Refused",
            no_appointments: "No appointments found in this category.",
            type_physical: "Visit",
            type_video: "Video Call"
        }
    },
    errors: {
        503: "Sorry, we are under maintenance. Please try again later.",
        500: "Oops, something went wrong on our servers.",
        404: "Sorry, the page you are looking for could not be found.",
        403: "Sorry, you are not authorized to access this page."
    },
    head: {
        home_title: "Celebra Cameroon - Find & Book Venues"
    }
};

updateLocale('fr', frStrings);
updateLocale('en', enStrings);
