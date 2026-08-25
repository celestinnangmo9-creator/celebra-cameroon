const fs = require('fs');
const fr = JSON.parse(fs.readFileSync('resources/js/locales/fr.json'));
const en = JSON.parse(fs.readFileSync('resources/js/locales/en.json'));

fr.venues.show = {
  no_more_photos: "Aucune photo supplémentaire",
  about_this_place: "À propos de ce lieu",
  what_it_offers: "Ce que propose ce lieu",
  capacity_of: "Capacité de",
  people: "personnes",
  generator: "Groupe électrogène (si coupure)",
  ac: "Entièrement climatisé",
  parking: "Parking sécurisé",
  host: "Hôte :",
  member_since: "Membre depuis",
  contact_host: "Contacter l'hôte",
  availabilities: "Disponibilités",
  availabilities_desc: "Consultez les dates libres et celles déjà réservées avant de formuler votre demande de réservation dans le formulaire.",
  reviews: "Avis des clients",
  host_reply: "Réponse de l'hôte",
  your_reply: "Votre réponse à cet avis...",
  publish_reply: "Publier la réponse",
  no_reviews: "Aucun avis pour le moment.",
  similar_venues: "Espaces similaires",
  per_day: "/ jour"
};

en.venues.show = {
  no_more_photos: "No more photos",
  about_this_place: "About this place",
  what_it_offers: "What this place offers",
  capacity_of: "Capacity of",
  people: "people",
  generator: "Generator (in case of outage)",
  ac: "Fully air-conditioned",
  parking: "Secure parking",
  host: "Host:",
  member_since: "Member since",
  contact_host: "Contact host",
  availabilities: "Availabilities",
  availabilities_desc: "Check available and already booked dates before submitting your booking request in the form.",
  reviews: "Customer reviews",
  host_reply: "Host reply",
  your_reply: "Your reply to this review...",
  publish_reply: "Publish reply",
  no_reviews: "No reviews yet.",
  similar_venues: "Similar venues",
  per_day: "/ day"
};

fs.writeFileSync('resources/js/locales/fr.json', JSON.stringify(fr, null, 2));
fs.writeFileSync('resources/js/locales/en.json', JSON.stringify(en, null, 2));
console.log("Translations added.");
