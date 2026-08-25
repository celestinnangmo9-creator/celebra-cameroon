const fs = require('fs');
const path = require('path');

function r(filePath, rules) {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) return;
    let content = fs.readFileSync(fullPath, 'utf8');
    let original = content;
    
    // add t function
    if (!content.includes('useLanguage')) {
        const lastImport = content.lastIndexOf('import ');
        if (lastImport !== -1) {
            const end = content.indexOf('\n', lastImport);
            content = content.slice(0, end + 1) + "import { useLanguage } from '@/Contexts/LanguageContext';\n" + content.slice(end + 1);
        }
    }
    
    if (!content.includes('const { t }') && !content.includes('const { t, language }')) {
        const match = content.match(/export default function \w+\(.*\) \{/) || content.match(/const \w+ = \(.*\) => \{/);
        if (match) {
            const pos = match.index + match[0].length;
            content = content.slice(0, pos) + "\n    const { t } = useLanguage();" + content.slice(pos);
        }
    }

    rules.forEach(rule => {
        content = content.replace(rule.search, rule.replace);
    });

    if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${filePath}`);
    }
}

// Layouts
r('resources/js/Layouts/AuthenticatedLayout.jsx', [
    { search: />Rendez-vous</g, replace: ">{t('nav.appointments', 'Rendez-vous')}<" },
    { search: />Abonnement expiré</g, replace: ">{t('subscription.expired_title', 'Abonnement expiré')}<" },
    { search: />Votre période d'essai ou votre abonnement a expiré\. Vos salles sont actuellement masquées\.</g, replace: ">{t('subscription.expired_desc1', 'Votre période d\\'essai ou votre abonnement a expiré. Vos salles sont actuellement masquées.')}<" },
    { search: />Veuillez choisir une formule d'abonnement pour continuer à gérer vos salles et les rendre visibles à nouveau\.</g, replace: ">{t('subscription.expired_desc2', 'Veuillez choisir une formule d\\'abonnement pour continuer à gérer vos salles et les rendre visibles à nouveau.')}<" },
    { search: />Voir les formules d'abonnement</g, replace: ">{t('subscription.see_plans', 'Voir les formules d\\'abonnement')}<" },
    { search: /title="Basculer le mode sombre\/clair"/g, replace: "title={t('nav.toggle_theme', 'Basculer le mode sombre/clair')}" }
]);

r('resources/js/Layouts/PublicLayout.jsx', [
    { search: /title="Basculer le mode sombre\/clair"/g, replace: "title={t('nav.toggle_theme', 'Basculer le mode sombre/clair')}" }
]);

r('resources/js/Layouts/GuestLayout.jsx', [
    { search: />&copy; \{new Date\(\)\.getFullYear\(\)\} Celebra Cameroon\. Tous droits réservés\.</g, replace: ">&copy; {new Date().getFullYear()} Celebra Cameroon. {t('footer.all_rights_reserved', 'Tous droits réservés.')}<" }
]);

// Missing from Admin
r('resources/js/Pages/Admin/Users.jsx', [
    { search: />Réinitialiser</g, replace: ">{t('admin.users.reset')}<" },
    { search: />Détails</g, replace: ">{t('admin.users.details')}<" },
    { search: />Débloquer</g, replace: ">{t('admin.users.unblock')}<" },
    { search: />Aucun utilisateur ne correspond à votre recherche\.</g, replace: ">{t('admin.users.no_users')}<" },
    { search: /confirm\(`Êtes-vous sûr de vouloir \$\{status === 'blocked' \? 'bloquer' : 'débloquer'\} cet utilisateur \?`\)/g, replace: "confirm(t('admin.users.confirm_block_toggle', 'Êtes-vous sûr de vouloir modifier ce statut ?'))" }
]);
r('resources/js/Pages/Admin/Venues.jsx', [
    { search: />Réinitialiser</g, replace: ">{t('admin.venues.reset')}<" },
    { search: />Détails</g, replace: ">{t('admin.venues.details')}<" },
    { search: />Aucune salle trouvée\.</g, replace: ">{t('admin.venues.no_venues')}<" }
]);

// Missing from Dashboard
r('resources/js/Pages/Dashboard/Subscription.jsx', [
    { search: />Statut de votre compte :</g, replace: ">{t('dashboard.subscription.account_status')}<" },
    { search: />Passez à la vitesse supérieure et débloquez tout le potentiel de vos espaces événementiels sur Celebra Cameroon\.</g, replace: ">{t('dashboard.subscription.upgrade_prompt')}<" },
    { search: />Recommandé</g, replace: ">{t('dashboard.subscription.recommended')}<" }
]);

// Missing from Venues
r('resources/js/Pages/Venues/Create.jsx', [
    { search: />Détails de l'espace</g, replace: ">{t('venues.create.venue_details')}<" }
]);
r('resources/js/Pages/Venues/Edit.jsx', [
    { search: />Édition de l'espace</g, replace: ">{t('venues.edit.edit_venue')}<" },
    { search: />Enregistrer les modifications</g, replace: ">{t('venues.edit.save_changes')}<" }
]);
r('resources/js/Pages/Venues/Stats.jsx', [
    { search: />Débloquer</g, replace: ">{t('venues.stats.unblock')}<" }
]);

// Missing from others
r('resources/js/Pages/Favorites/Index.jsx', [
    { search: />Explorer les espaces</g, replace: ">{t('favorites.explore_venues')}<" }
]);
r('resources/js/Pages/Host/Appointments/Index.jsx', [
    { search: />Aucun rendez-vous trouvé dans cette catégorie\.</g, replace: ">{t('host.appointments.no_appointments')}<" }
]);
