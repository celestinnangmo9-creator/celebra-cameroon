const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, replacements) {
    const fullPath = path.join(__dirname, filePath);
    let content = fs.readFileSync(fullPath, 'utf8');
    let originalContent = content;
    
    // add useLanguage import if not exists
    if (!content.includes('useLanguage')) {
        // find last import
        const lastImportIndex = content.lastIndexOf('import ');
        const endOfLastImport = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, endOfLastImport + 1) + 
                  "import { useLanguage } from '@/Contexts/LanguageContext';\n" + 
                  content.slice(endOfLastImport + 1);
    }
    
    // add const { t } = useLanguage(); inside the component
    if (!content.includes('const { t } = useLanguage();') && !content.includes('const { t, language } = useLanguage();')) {
        // find function component declaration
        const functionMatch = content.match(/export default function \w+\(.*\) \{/);
        if (functionMatch) {
            const pos = functionMatch.index + functionMatch[0].length;
            content = content.slice(0, pos) + "\n    const { t } = useLanguage();" + content.slice(pos);
        } else {
            const arrowMatch = content.match(/const \w+ = \(.*\) => \{/);
            if (arrowMatch) {
                const pos = arrowMatch.index + arrowMatch[0].length;
                content = content.slice(0, pos) + "\n    const { t } = useLanguage();" + content.slice(pos);
            }
        }
    }

    replacements.forEach(r => {
        content = content.replace(r.search, r.replace);
    });

    if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${filePath}`);
    }
}

// 2.1 Dashboard/Subscription.jsx
replaceInFile('resources/js/Pages/Dashboard/Subscription.jsx', [
    { search: />Statut de votre compte :</g, replace: '>{t(\'dashboard.subscription.account_status\')}<' },
    { search: /\{isExpired \? 'Expiré' : \(userSubscription\.status === 'trial' \? 'Essai Gratuit' : 'Actif'\)\}/g, replace: "{isExpired ? t('dashboard.subscription.status_expired') : (userSubscription.status === 'trial' ? t('dashboard.subscription.status_trial') : t('dashboard.subscription.status_active'))}" },
    { search: /"Votre abonnement est expiré\. Vos salles sont masquées au public\."/g, replace: "t('dashboard.subscription.expired_message')" },
    { search: /`Il vous reste \$\{daysRemaining\} jour\(s\) d'essai gratuit\.`/g, replace: "t('dashboard.subscription.trial_remaining').replace('{days}', daysRemaining)" },
    { search: /`Votre abonnement \$\{userSubscription\.plan === 'premium' \? 'Premium' : 'Basique'\} est actif jusqu'au \$\{formatDate\(userSubscription\.subscription_ends_at\)\}\.`/g, replace: "t('dashboard.subscription.active_until').replace('{plan}', userSubscription.plan === 'premium' ? t('dashboard.subscription.plan_premium') : t('dashboard.subscription.plan_basic')).replace('{date}', formatDate(userSubscription.subscription_ends_at))" },
    { search: />Passez à la vitesse supérieure et débloquez tout le potentiel de vos espaces événementiels sur Celebra Cameroon\.</g, replace: '>{t(\'dashboard.subscription.upgrade_prompt\')}<' },
    { search: />Recommandé</g, replace: '>{t(\'dashboard.subscription.recommended\')}<' },
    { search: /`Jusqu'à \$\{plan\.max_venues\} salles actives` : 'Salles actives illimitées'/g, replace: "t('dashboard.subscription.up_to_venues').replace('{count}', plan.max_venues) : t('dashboard.subscription.unlimited_venues')" },
    { search: />Gestion des réservations</g, replace: '>{t(\'dashboard.subscription.booking_management\')}<' },
    { search: />Messagerie directe avec les clients</g, replace: '>{t(\'dashboard.subscription.direct_messaging\')}<' },
    { search: />Badge "Prestataire Vérifié"</g, replace: '>{t(\'dashboard.subscription.verified_badge\')}<' },
    { search: /S'abonner à \{plan\.name\}/g, replace: "{t('dashboard.subscription.subscribe_to').replace('{plan}', plan.name)}" }
]);

// 2.2 Venues/Create.jsx
replaceInFile('resources/js/Pages/Venues/Create.jsx', [
    { search: />Détails de l'espace</g, replace: '>{t(\'venues.create.venue_details\')}<' },
    { search: /value="Titre de l'espace \*"/g, replace: 'value={t(\'venues.create.title_label\')}' },
    { search: /placeholder="Ex: Palais des Lumières & Espace Banquet"/g, replace: 'placeholder={t(\'venues.create.title_placeholder\')}' },
    { search: /value="Catégorie \*"/g, replace: 'value={t(\'venues.create.category_label\')}' },
    { search: /value="Région \*"/g, replace: 'value={t(\'venues.create.region_label\')}' },
    { search: /value="Adresse précise \*"/g, replace: 'value={t(\'venues.create.address_label\')}' },
    { search: /value="Capacité max\. \(Invités\) \*"/g, replace: 'value={t(\'venues.create.capacity_label\')}' },
    { search: /value="Description détaillée \*"/g, replace: 'value={t(\'venues.create.description_label\')}' },
    { search: /placeholder="Décrivez l'ambiance, l'insonorisation, les conditions d'accès, etc\."/g, replace: 'placeholder={t(\'venues.create.description_placeholder\')}' },
    { search: /value="Image principale \(Photo depuis la galerie ou caméra\) \*"/g, replace: 'value={t(\'venues.create.main_image_label\')}' },
    { search: /value="Autres Photos & Vidéos \(Sélectionnez plusieurs fichiers\)"/g, replace: 'value={t(\'venues.create.gallery_label\')}' }
]);

// 2.2 Venues/Edit.jsx
replaceInFile('resources/js/Pages/Venues/Edit.jsx', [
    { search: />Édition de l'espace</g, replace: '>{t(\'venues.edit.edit_venue\')}<' },
    { search: /value="Titre de l'espace \*"/g, replace: 'value={t(\'venues.create.title_label\')}' },
    { search: /value="Catégorie \*"/g, replace: 'value={t(\'venues.create.category_label\')}' },
    { search: /value="Région \*"/g, replace: 'value={t(\'venues.create.region_label\')}' },
    { search: /value="Adresse précise \*"/g, replace: 'value={t(\'venues.create.address_label\')}' },
    { search: /value="Statut de la salle \*"/g, replace: 'value={t(\'venues.edit.status_label\')}' },
    { search: />Réservé<\/option>/g, replace: '>{t(\'venues.edit.status_booked\')}</option>' },
    { search: /value="Capacité max\. \*"/g, replace: 'value={t(\'venues.create.capacity_label\')}' },
    { search: /value="Description détaillée \*"/g, replace: 'value={t(\'venues.create.description_label\')}' },
    { search: /value="Ajouter de nouvelles photos\/vidéos à la galerie \(Optionnel\)"/g, replace: 'value={t(\'venues.edit.gallery_add_label\')}' },
    { search: />Enregistrer les modifications</g, replace: '>{t(\'venues.edit.save_changes\')}<' }
]);

// 2.3 Venues/Stats.jsx
replaceInFile('resources/js/Pages/Venues/Stats.jsx', [
    { search: /'Voulez-vous vraiment débloquer ces dates \?'/g, replace: "t('venues.stats.confirm_unblock')" },
    { search: />Liste des indisponibilités</g, replace: '>{t(\'venues.stats.unavailability_list\')}<' },
    { search: />Débloquer</g, replace: '>{t(\'venues.stats.unblock\')}<' },
    { search: />Réservation \(\{b\.status\}\)</g, replace: '>{t(\'venues.stats.booking_status\').replace(\'{status}\', b.status)}<' }
]);

// 2.4 Host/Appointments/Index.jsx
replaceInFile('resources/js/Pages/Host/Appointments/Index.jsx', [
    { search: /confirm\(`Êtes-vous sûr de vouloir \$\{newStatus === 'confirmed' \? 'confirmer' : 'refuser'\} ce rendez-vous \?`\)/g, replace: "confirm(t('host.appointments.confirm_status').replace('{action}', newStatus === 'confirmed' ? t('host.appointments.action_confirm') : t('host.appointments.action_refuse')))" },
    { search: /title="Mes Rendez-vous"/g, replace: 'title={t(\'host.appointments.title\')}' },
    { search: /status === 'confirmed' \? 'Confirmés' :/g, replace: "status === 'confirmed' ? t('host.appointments.tab_confirmed') :" },
    { search: /status === 'completed' \? 'Passés' : 'Refusés'/g, replace: "status === 'completed' ? t('host.appointments.tab_completed') : t('host.appointments.tab_refused')" },
    { search: />Aucun rendez-vous trouvé dans cette catégorie\.</g, replace: '>{t(\'host.appointments.no_appointments\')}<' },
    { search: /appointment\.type === 'physical_visit' \? 'Visite' : 'Appel Vidéo'/g, replace: "appointment.type === 'physical_visit' ? t('host.appointments.type_physical') : t('host.appointments.type_video')" }
]);

// 3.1 Favorites/Index.jsx
replaceInFile('resources/js/Pages/Favorites/Index.jsx', [
    { search: />Explorer les espaces</g, replace: '>{t(\'favorites.explore_venues\')}<' }
]);

// 3.2 Error.jsx
replaceInFile('resources/js/Pages/Error.jsx', [
    { search: /503: 'Désolé, nous sommes en maintenance\. Veuillez réessayer plus tard\.',/g, replace: "503: t('errors.503')," },
    { search: /500: 'Oups, quelque chose a mal tourné sur nos serveurs\.',/g, replace: "500: t('errors.500')," },
    { search: /404: 'Désolé, la page que vous recherchez est introuvable\.',/g, replace: "404: t('errors.404')," },
    { search: /403: 'Désolé, vous n\\'êtes pas autorisé à accéder à cette page\.',/g, replace: "403: t('errors.403')," }
]);

// 3.3 Home.jsx
replaceInFile('resources/js/Pages/Home.jsx', [
    { search: /title="Celebra Cameroon - Trouver & Réserver des Salles"/g, replace: "title={t('head.home_title')}" }
]);
