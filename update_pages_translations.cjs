const fs = require('fs');
const fr = JSON.parse(fs.readFileSync('resources/js/locales/fr.json'));
const en = JSON.parse(fs.readFileSync('resources/js/locales/en.json'));

fr.about = {
  page_title: "À Propos - Celebra Cameroon",
  title: "À Propos de Celebra Cameroon",
  subtitle: "La plateforme révolutionnaire qui simplifie l'organisation d'événements au Cameroun.",
  p1: "Celebra Cameroon est la plateforme de référence pour la réservation d'espaces événementiels au Cameroun. Nous mettons en relation les organisateurs d'événements avec un réseau soigneusement sélectionné de salles de fêtes et de prestataires à travers le pays, en offrant une expérience de réservation fluide, transparente et digne de confiance.",
  mission_title: "Notre Mission",
  mission_text: "Notre ambition est de transformer l'organisation d'événements au Cameroun en simplifiant l'accès aux meilleurs espaces disponibles, tout en valorisant le savoir-faire des propriétaires et prestataires locaux."
};

en.about = {
  page_title: "About - Celebra Cameroon",
  title: "About Celebra Cameroon",
  subtitle: "The revolutionary platform that simplifies event organization in Cameroon.",
  p1: "Celebra Cameroon is the go-to platform for booking event spaces in Cameroon. We connect event organizers with a carefully selected network of party halls and service providers across the country, offering a seamless, transparent, and trustworthy booking experience.",
  mission_title: "Our Mission",
  mission_text: "Our ambition is to transform event organization in Cameroon by simplifying access to the best available spaces, while showcasing the expertise of local owners and service providers."
};

fr.contact = {
  page_title: "Contact - Celebra Cameroon",
  title: "Contactez-nous",
  subtitle: "Une question ? Un problème ? Notre équipe est à votre disposition.",
  info_title: "Nos Coordonnées",
  phone: "Téléphone",
  email: "Email",
  address: "Adresse",
  address_value: "Akwa, Douala - Cameroun",
  form_title: "Envoyez-nous un message",
  name: "Nom complet",
  name_placeholder: "Votre nom",
  email_placeholder: "votre@email.com",
  message: "Message",
  message_placeholder: "Comment pouvons-nous vous aider ?",
  submit: "Envoyer le message"
};

en.contact = {
  page_title: "Contact - Celebra Cameroon",
  title: "Contact Us",
  subtitle: "A question? A problem? Our team is at your disposal.",
  info_title: "Our Contact Info",
  phone: "Phone",
  email: "Email",
  address: "Address",
  address_value: "Akwa, Douala - Cameroon",
  form_title: "Send us a message",
  name: "Full Name",
  name_placeholder: "Your name",
  email_placeholder: "your@email.com",
  message: "Message",
  message_placeholder: "How can we help you?",
  submit: "Send message"
};

fr.dashboard = {
  page_title: "Tableau de bord",
  host: {
    overview: "Aperçu Global",
    overview_desc: "Gérez vos espaces et suivez vos revenus au Cameroun.",
    add_venue: "Ajouter un espace",
    revenue: "Revenus Validés",
    my_venues: "Mes Espaces",
    total_bookings: "Réservations Totales",
    pending: "En attente",
    my_halls: "Mes Salles",
    bookings_count: "réservations",
    edit: "Modifier",
    stats: "Stats / Calendrier",
    recent_requests: "Dernières Demandes de Réservation",
    see_all: "Voir tout",
    table: {
      client: "Client (Informations)",
      venue: "Espace Réservé",
      period: "Période",
      amount: "Montant Total",
      status: "Statut",
      actions: "Actions",
      from: "Du",
      to: "Au",
      manage: "Gérer",
      confirmed: "Confirmé",
      pending_status: "En attente",
      cancelled: "Annulé"
    },
    no_recent: "Aucune réservation récente."
  },
  client: {
    welcome: "Bienvenue, {name}",
    welcome_desc: "Retrouvez l'historique de vos réservations et vos visites planifiées.",
    search_venue: "Rechercher une salle",
    no_bookings: "Aucune réservation pour le moment",
    no_bookings_desc: "Commencez par explorer nos salles exceptionnelles au Cameroun."
  }
};

en.dashboard = {
  page_title: "Dashboard",
  host: {
    overview: "Global Overview",
    overview_desc: "Manage your spaces and track your revenue in Cameroon.",
    add_venue: "Add a space",
    revenue: "Validated Revenue",
    my_venues: "My Spaces",
    total_bookings: "Total Bookings",
    pending: "Pending",
    my_halls: "My Halls",
    bookings_count: "bookings",
    edit: "Edit",
    stats: "Stats / Calendar",
    recent_requests: "Latest Booking Requests",
    see_all: "See all",
    table: {
      client: "Client (Information)",
      venue: "Reserved Space",
      period: "Period",
      amount: "Total Amount",
      status: "Status",
      actions: "Actions",
      from: "From",
      to: "To",
      manage: "Manage",
      confirmed: "Confirmed",
      pending_status: "Pending",
      cancelled: "Cancelled"
    },
    no_recent: "No recent bookings."
  },
  client: {
    welcome: "Welcome, {name}",
    welcome_desc: "Find your booking history and scheduled visits.",
    search_venue: "Search for a hall",
    no_bookings: "No bookings at the moment",
    no_bookings_desc: "Start by exploring our exceptional halls in Cameroon."
  }
};

fs.writeFileSync('resources/js/locales/fr.json', JSON.stringify(fr, null, 2));
fs.writeFileSync('resources/js/locales/en.json', JSON.stringify(en, null, 2));
console.log("Pages translations added.");
