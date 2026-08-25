const fs = require('fs');
const fr = JSON.parse(fs.readFileSync('resources/js/locales/fr.json'));
const en = JSON.parse(fs.readFileSync('resources/js/locales/en.json'));

fr.profile = {
  page_title: "Profil",
  information: {
    title: "Informations du profil",
    description: "Mettez à jour les informations de profil et l'adresse e-mail de votre compte.",
    change_photo: "Changer la photo",
    name: "Nom complet",
    email: "Adresse Email",
    phone: "Numéro de téléphone",
    phone_placeholder: "Ex: 699 99 99 99",
    bio: "Bio / Description",
    bio_placeholder: "Parlez-nous un peu de vous...",
    unverified: "Votre adresse e-mail n'est pas vérifiée.",
    resend: "Cliquez ici pour renvoyer l'e-mail de vérification.",
    sent: "Un nouveau lien de vérification a été envoyé à votre adresse e-mail.",
    save: "Enregistrer",
    saved: "Enregistré."
  },
  password: {
    title: "Mettre à jour le mot de passe",
    description: "Assurez-vous que votre compte utilise un mot de passe long et aléatoire pour rester sécurisé.",
    current: "Mot de passe actuel",
    new: "Nouveau mot de passe",
    confirm: "Confirmer le mot de passe",
    save: "Enregistrer",
    saved: "Enregistré."
  },
  delete: {
    title: "Supprimer le compte",
    description: "Une fois votre compte supprimé, toutes ses ressources et données seront définitivement effacées. Avant de supprimer votre compte, veuillez télécharger toutes les données ou informations que vous souhaitez conserver.",
    btn: "Supprimer le compte",
    confirm_title: "Êtes-vous sûr de vouloir supprimer votre compte ?",
    confirm_desc: "Une fois votre compte supprimé, toutes ses ressources et données seront définitivement effacées. Veuillez entrer votre mot de passe pour confirmer que vous souhaitez supprimer définitivement votre compte.",
    password: "Mot de passe",
    cancel: "Annuler"
  }
};

en.profile = {
  page_title: "Profile",
  information: {
    title: "Profile Information",
    description: "Update your account's profile information and email address.",
    change_photo: "Change photo",
    name: "Full Name",
    email: "Email Address",
    phone: "Phone Number",
    phone_placeholder: "Ex: 699 99 99 99",
    bio: "Bio / Description",
    bio_placeholder: "Tell us a bit about yourself...",
    unverified: "Your email address is unverified.",
    resend: "Click here to re-send the verification email.",
    sent: "A new verification link has been sent to your email address.",
    save: "Save",
    saved: "Saved."
  },
  password: {
    title: "Update Password",
    description: "Ensure your account is using a long, random password to stay secure.",
    current: "Current Password",
    new: "New Password",
    confirm: "Confirm Password",
    save: "Save",
    saved: "Saved."
  },
  delete: {
    title: "Delete Account",
    description: "Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain.",
    btn: "Delete Account",
    confirm_title: "Are you sure you want to delete your account?",
    confirm_desc: "Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account.",
    password: "Password",
    cancel: "Cancel"
  }
};

fs.writeFileSync('resources/js/locales/fr.json', JSON.stringify(fr, null, 2));
fs.writeFileSync('resources/js/locales/en.json', JSON.stringify(en, null, 2));
console.log("Profile translations added.");
