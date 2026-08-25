const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'app/Http/Controllers');

const replacements = [
    {
        file: 'AdminController.php',
        rules: [
            { search: /with\('success', 'Statut de la salle mis à jour\.'\)/g, replace: "with('success', __('Statut de la salle mis à jour.'))" },
            { search: /with\('success', 'Utilisateur mis à jour avec succès\.'\)/g, replace: "with('success', __('Utilisateur mis à jour avec succès.'))" },
            { search: /with\('success', 'Utilisateur supprimé \(soft delete\) avec succès\.'\)/g, replace: "with('success', __('Utilisateur supprimé (soft delete) avec succès.'))" },
            { search: /with\('success', 'Paramètres mis à jour avec succès\.'\)/g, replace: "with('success', __('Paramètres mis à jour avec succès.'))" }
        ]
    },
    {
        file: 'AdminSubscriptionPlanController.php',
        rules: [
            { search: /with\('success', 'La formule ' \. \$plan->name \. ' a été mise à jour avec succès\.'\)/g, replace: "with('success', __('La formule :plan a été mise à jour avec succès.', ['plan' => $plan->name]))" }
        ]
    },
    {
        file: 'AppointmentController.php',
        rules: [
            { search: /with\('success', 'Statut du rendez-vous mis à jour avec succès\.'\)/g, replace: "with('success', __('Statut du rendez-vous mis à jour avec succès.'))" }
        ]
    },
    {
        file: 'BookingController.php',
        rules: [
            { search: /with\('success', 'Votre demande de réservation pour ' \. \$venue->title \. ' a été transmise à l\\'hôte !'\)/g, replace: "with('success', __('Votre demande de réservation pour :venue a été transmise à l\\'hôte !', ['venue' => $venue->title]))" },
            { search: /with\('success', 'Le statut de la réservation #' \. \$booking->id \. ' a été mis à jour \(' \. ucfirst\(\$request->status\) \. '\)\.'\)/g, replace: "with('success', __('Le statut de la réservation #:id a été mis à jour (:status).', ['id' => $booking->id, 'status' => ucfirst($request->status)]))" }
        ]
    },
    {
        file: 'AuthController.php',
        rules: [
            { search: /with\('success', 'Bienvenue sur Celebra Cameroon !'\)/g, replace: "with('success', __('Bienvenue sur Celebra Cameroon !'))" },
            { search: /with\('success', 'Votre compte a été créé avec succès !'\)/g, replace: "with('success', __('Votre compte a été créé avec succès !'))" },
            { search: /with\('success', 'Votre profil a été mis à jour avec succès\.'\)/g, replace: "with('success', __('Votre profil a été mis à jour avec succès.'))" }
        ]
    },
    {
        file: 'FavoriteController.php',
        rules: [
            { search: /with\('success', 'Espace retiré de vos favoris\.'\)/g, replace: "with('success', __('Espace retiré de vos favoris.'))" },
            { search: /with\('success', 'Espace ajouté à vos favoris\.'\)/g, replace: "with('success', __('Espace ajouté à vos favoris.'))" }
        ]
    },
    {
        file: 'MessageController.php',
        rules: [
            { search: /with\('success', 'Rendez-vous planifie avec succes ! L\\'hote en a ete notifie\.'\)/g, replace: "with('success', __('Rendez-vous planifie avec succes ! L\\'hote en a ete notifie.'))" }
        ]
    },
    {
        file: 'PaymentController.php',
        rules: [
            { search: /with\('success', 'Cette réservation est déjà payée\.'\)/g, replace: "with('success', __('Cette réservation est déjà payée.'))" },
            { search: /with\('success', \$response\['message'\]\)/g, replace: "with('success', __(\$response['message']))" },
            { search: /with\('success', \$msg\)/g, replace: "with('success', __(\$msg))" },
            { search: /\$msg = 'Le paiement pour la réservation #' \. \$booking->id \. ' a été confirmé avec succès\!';/g, replace: "\$msg = __('Le paiement pour la réservation #:id a été confirmé avec succès!', ['id' => $booking->id]);" }
        ]
    },
    {
        file: 'ProfileController.php',
        rules: [
            { search: /with\('success', 'Profil mis à jour avec succès\.'\)/g, replace: "with('success', __('Profil mis à jour avec succès.'))" }
        ]
    },
    {
        file: 'ReviewController.php',
        rules: [
            { search: /with\('success', 'Votre avis a été publié avec succès\.'\)/g, replace: "with('success', __('Votre avis a été publié avec succès.'))" },
            { search: /with\('success', 'Votre réponse a été publiée avec succès\.'\)/g, replace: "with('success', __('Votre réponse a été publiée avec succès.'))" }
        ]
    },
    {
        file: 'SubscriptionController.php',
        rules: [
            { search: /with\('success', 'Votre abonnement '\.\$plan->name\.' a été activé avec succès !'\)/g, replace: "with('success', __('Votre abonnement :plan a été activé avec succès !', ['plan' => $plan->name]))" }
        ]
    },
    {
        file: 'VenueController.php',
        rules: [
            { search: /with\('success', 'Votre espace a été publié avec succès sur Celebra Cameroon !'\)/g, replace: "with('success', __('Votre espace a été publié avec succès sur Celebra Cameroon !'))" },
            { search: /with\('success', 'L\\'annonce a été mise à jour avec succès\.'\)/g, replace: "with('success', __('L\\'annonce a été mise à jour avec succès.'))" },
            { search: /with\('success', 'L\\'espace a été supprimé\.'\)/g, replace: "with('success', __('L\\'espace a été supprimé.'))" },
            { search: /with\('success', 'Les dates ont été bloquées avec succès\.'\)/g, replace: "with('success', __('Les dates ont été bloquées avec succès.'))" },
            { search: /with\('success', 'Le blocage a été retiré\.'\)/g, replace: "with('success', __('Le blocage a été retiré.'))" }
        ]
    }
];

replacements.forEach(fileOps => {
    const filePath = path.join(controllersDir, fileOps.file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        fileOps.rules.forEach(rule => {
            content = content.replace(rule.search, rule.replace);
        });
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated ${fileOps.file}`);
        }
    }
});

// Update lang/en.json and lang/fr.json
const enTranslations = {
    "Statut de la salle mis à jour.": "Venue status updated.",
    "Utilisateur mis à jour avec succès.": "User successfully updated.",
    "Utilisateur supprimé (soft delete) avec succès.": "User successfully deleted (soft delete).",
    "Paramètres mis à jour avec succès.": "Settings successfully updated.",
    "La formule :plan a été mise à jour avec succès.": "The :plan plan has been successfully updated.",
    "Statut du rendez-vous mis à jour avec succès.": "Appointment status successfully updated.",
    "Votre demande de réservation pour :venue a été transmise à l'hôte !": "Your booking request for :venue has been sent to the host!",
    "Le statut de la réservation #:id a été mis à jour (:status).": "The status of booking #:id has been updated (:status).",
    "Bienvenue sur Celebra Cameroon !": "Welcome to Celebra Cameroon!",
    "Votre compte a été créé avec succès !": "Your account has been successfully created!",
    "Votre profil a été mis à jour avec succès.": "Your profile has been successfully updated.",
    "Espace retiré de vos favoris.": "Venue removed from your favorites.",
    "Espace ajouté à vos favoris.": "Venue added to your favorites.",
    "Rendez-vous planifie avec succes ! L'hote en a ete notifie.": "Appointment successfully scheduled! The host has been notified.",
    "Cette réservation est déjà payée.": "This booking is already paid.",
    "Le paiement pour la réservation #:id a été confirmé avec succès!": "Payment for booking #:id has been successfully confirmed!",
    "Profil mis à jour avec succès.": "Profile successfully updated.",
    "Votre avis a été publié avec succès.": "Your review has been successfully published.",
    "Votre réponse a été publiée avec succès.": "Your reply has been successfully published.",
    "Votre abonnement :plan a été activé avec succès !": "Your :plan subscription has been successfully activated!",
    "Votre espace a été publié avec succès sur Celebra Cameroon !": "Your space has been successfully published on Celebra Cameroon!",
    "L'annonce a été mise à jour avec succès.": "The listing has been successfully updated.",
    "L'espace a été supprimé.": "The space has been deleted.",
    "Les dates ont été bloquées avec succès.": "The dates have been successfully blocked.",
    "Le blocage a été retiré.": "The block has been removed."
};

const enPath = path.join(__dirname, 'lang/en.json');
let enContent = {};
if (fs.existsSync(enPath)) {
    enContent = JSON.parse(fs.readFileSync(enPath, 'utf8'));
}
Object.assign(enContent, enTranslations);
fs.writeFileSync(enPath, JSON.stringify(enContent, null, 2));
console.log('Updated lang/en.json');
