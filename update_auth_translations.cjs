const fs = require('fs');
const fr = JSON.parse(fs.readFileSync('resources/js/locales/fr.json'));
const en = JSON.parse(fs.readFileSync('resources/js/locales/en.json'));

fr.auth = {
  login: {
    page_title: "Connexion",
    email: "Email",
    password: "Mot de passe",
    hide_password: "Masquer le mot de passe",
    show_password: "Afficher le mot de passe",
    remember_me: "Se souvenir de moi",
    forgot_password: "Mot de passe oublié ?",
    login_btn: "Se connecter",
    or: "ou",
    continue_google: "Continuer avec Google"
  },
  register: {
    page_title: "Inscription - Celebra Cameroon",
    title: "Créer un compte",
    subtitle: "Rejoignez la première plateforme événementielle du Cameroun",
    name: "Nom Complet",
    name_placeholder: "Ex: Jean Dupont",
    email: "Adresse Email",
    email_placeholder: "jean@exemple.com",
    password: "Mot de passe",
    confirm_password: "Confirmer",
    role_label: "Je souhaite m'inscrire en tant que :",
    role_client: "Client (Je cherche des espaces)",
    role_host: "Hôte (Je propose des espaces)",
    already_registered: "Déjà un compte ?",
    register_btn: "S'inscrire",
    or: "ou",
    register_google: "S'inscrire avec Google"
  },
  forgot: {
    page_title: "Mot de passe oublié",
    description: "Mot de passe oublié ? Aucun problème. Indiquez-nous votre adresse e-mail et nous vous enverrons un lien de réinitialisation qui vous permettra d'en choisir un nouveau.",
    email_btn: "Envoyer le lien de réinitialisation"
  }
};

en.auth = {
  login: {
    page_title: "Log in",
    email: "Email",
    password: "Password",
    hide_password: "Hide password",
    show_password: "Show password",
    remember_me: "Remember me",
    forgot_password: "Forgot your password?",
    login_btn: "Log in",
    or: "or",
    continue_google: "Continue with Google"
  },
  register: {
    page_title: "Register - Celebra Cameroon",
    title: "Create an account",
    subtitle: "Join the premier event platform in Cameroon",
    name: "Full Name",
    name_placeholder: "Ex: John Doe",
    email: "Email Address",
    email_placeholder: "john@example.com",
    password: "Password",
    confirm_password: "Confirm",
    role_label: "I want to register as:",
    role_client: "Client (Looking for spaces)",
    role_host: "Host (Offering spaces)",
    already_registered: "Already have an account?",
    register_btn: "Register",
    or: "or",
    register_google: "Register with Google"
  },
  forgot: {
    page_title: "Forgot Password",
    description: "Forgot your password? No problem. Just let us know your email address and we will email you a password reset link that will allow you to choose a new one.",
    email_btn: "Email Password Reset Link"
  }
};

fs.writeFileSync('resources/js/locales/fr.json', JSON.stringify(fr, null, 2));
fs.writeFileSync('resources/js/locales/en.json', JSON.stringify(en, null, 2));
console.log("Auth translations added.");
