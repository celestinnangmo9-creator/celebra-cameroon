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

// 1. Admin/Users.jsx
replaceInFile('resources/js/Pages/Admin/Users.jsx', [
    { search: /`Êtes-vous sûr de vouloir supprimer cet utilisateur \? Cette action placera le compte dans la corbeille \(Soft Delete\)\.`/, replace: "t('admin.users.confirm_delete')" },
    { search: /<InputLabel value="Rôle" \/>/g, replace: "<InputLabel value={t('admin.users.role')} />" },
    { search: /<option value="">Tous les rôles<\/option>/g, replace: '<option value="">{t(\'admin.users.all_roles\')}</option>' },
    { search: /<option value="host">Propriétaire<\/option>/g, replace: '<option value="host">{t(\'admin.users.role_host\')}</option>' },
    { search: /<option value="">Tous les statuts<\/option>/g, replace: '<option value="">{t(\'admin.users.all_statuses\')}</option>' },
    { search: /<option value="blocked">Bloqué<\/option>/g, replace: '<option value="blocked">{t(\'admin.users.status_blocked\')}</option>' },
    { search: />Réinitialiser</g, replace: '>{t(\'admin.users.reset\')}<' },
    { search: /title="Changer de rôle"/g, replace: 'title={t(\'admin.users.change_role\')}' },
    { search: /user\.status === 'active' \|\| !user\.status \? 'Actif' : 'Bloqué'/g, replace: "user.status === 'active' || !user.status ? t('admin.users.status_active') : t('admin.users.status_blocked')" },
    { search: />Détails</g, replace: '>{t(\'admin.users.details\')}<' },
    { search: />Débloquer</g, replace: '>{t(\'admin.users.unblock\')}<' },
    { search: />Aucun utilisateur ne correspond à votre recherche\.<\/td>/g, replace: '>{t(\'admin.users.no_users\')}</td>' },
    { search: /Affichage de \{users\.data\.length\} sur \{users\.total\} utilisateurs/g, replace: "{t('admin.users.showing_users').replace('{count}', users.data.length).replace('{total}', users.total)}" }
]);

// 1.2 Admin/UserShow.jsx
replaceInFile('resources/js/Pages/Admin/UserShow.jsx', [
    { search: /Rôle : \{user\.role\}/g, replace: "{t('admin.users.role_label').replace('{role}', user.role)}" },
    { search: /Statut : \{user\.status === 'active' \|\| !user\.status \? 'Actif' : 'Bloqué'\}/g, replace: "{t('admin.users.status_label').replace('{status}', user.status === 'active' || !user.status ? t('admin.users.status_active') : t('admin.users.status_blocked'))}" },
    { search: /'Non renseigné'/g, replace: "t('admin.users.not_provided')" }
]);

// 1.3 Admin/Venues.jsx
replaceInFile('resources/js/Pages/Admin/Venues.jsx', [
    { search: /`Êtes-vous sûr de vouloir approuver cette salle \?`/g, replace: "t('admin.venues.confirm_approve')" },
    { search: /<option value="">Tous les statuts<\/option>/g, replace: '<option value="">{t(\'admin.venues.all_statuses\')}</option>' },
    { search: /<option value="approved">Approuvée<\/option>/g, replace: '<option value="approved">{t(\'admin.venues.status_approved\')}</option>' },
    { search: /<option value="rejected">Rejetée<\/option>/g, replace: '<option value="rejected">{t(\'admin.venues.status_rejected\')}</option>' },
    { search: />Réinitialiser</g, replace: '>{t(\'admin.venues.reset\')}<' },
    { search: />Détails</g, replace: '>{t(\'admin.venues.details\')}<' },
    { search: />Aucune salle trouvée\.<\/td>/g, replace: '>{t(\'admin.venues.no_venues\')}</td>' },
    { search: /Affichage de \{venues\.data\.length\} sur \{venues\.total\} salles/g, replace: "{t('admin.venues.showing_venues').replace('{count}', venues.data.length).replace('{total}', venues.total)}" },
    { search: /rejectionModal\.type === 'suspended' \? 'Suspendre la salle' : 'Rejeter la salle'/g, replace: "rejectionModal.type === 'suspended' ? t('admin.venues.suspend_venue') : t('admin.venues.reject_venue')" },
    { search: /placeholder="Veuillez expliquer pourquoi cette salle ne respecte pas les critères\.\.\."/g, replace: "placeholder={t('admin.venues.rejection_reason_placeholder')}" }
]);

// 1.4 Admin/VenueShow.jsx
replaceInFile('resources/js/Pages/Admin/VenueShow.jsx', [
    { search: /`Êtes-vous sûr de vouloir approuver cette salle \?`/g, replace: "t('admin.venues.confirm_approve')" },
    { search: /rejectionModal\.type === 'suspended' \? 'Suspendre la salle' : 'Rejeter la salle'/g, replace: "rejectionModal.type === 'suspended' ? t('admin.venues.suspend_venue') : t('admin.venues.reject_venue')" },
    { search: /placeholder="Veuillez expliquer pourquoi cette salle ne respecte pas les critères\.\.\."/g, replace: "placeholder={t('admin.venues.rejection_reason_placeholder')}" }
]);
