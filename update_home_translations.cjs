const fs = require('fs');

const updateLocale = (lang, newStrings) => {
    const path = `resources/js/locales/${lang}.json`;
    let content = {};
    if (fs.existsSync(path)) {
        content = JSON.parse(fs.readFileSync(path, 'utf8'));
    }
    
    if (!content.home) content.home = {};
    Object.assign(content.home, newStrings);
    
    fs.writeFileSync(path, JSON.stringify(content, null, 2));
    console.log(`Updated ${lang}.json`);
};

const frStrings = {
    "all_regions": "Toutes les régions",
    "all_cities": "Toutes les villes",
    "all_types": "Tous les types",
    "explore_category": "Explorez par Catégorie",
    "explore_desc": "Trouvez l'espace adapté à la taille et au prestige de votre événement.",
    "cat_party": "Salles de Fête",
    "cat_party_desc": "Mariages & Banquets",
    "cat_green": "Espaces Verts",
    "cat_green_desc": "Jardins & Plages Kribi",
    "cat_vip": "Terrasses VIP",
    "cat_vip_desc": "Rooftops & Cocktails",
    "cat_office": "Bureaux & Coworking",
    "cat_office_desc": "Réunions & Ateliers",
    "cat_conf": "Salles de Conférence",
    "cat_conf_desc": "Séminaires & Formations",
    "cat_villa": "Villas de Prestige",
    "cat_villa_desc": "Piscine & Séjours VIP",
    "latest_venues": "Nouvelles Salles Ajoutées",
    "latest_venues_desc": "Découvrez les derniers espaces publiés par nos hôtes.",
    "no_latest": "Aucune salle récemment ajoutée.",
    "no_featured": "Aucun espace en vedette.",
    "how_it_works": "Comment fonctionne Celebra Cameroon ?",
    "how_it_works_desc": "Réservez un lieu d'événement en toute tranquillité grâce à nos garanties et fonctionnalités interactives.",
    "step1_title": "Trouvez & Filtrez",
    "step1_desc": "Recherchez par ville (Douala, Yaoundé, Kribi...), capacité, budget et équipements.",
    "step2_title": "Discutez & Visitez",
    "step2_desc": "Échangez directement avec le propriétaire en messagerie interne, passez un appel audio/vidéo ou planifiez une visite physique du lieu.",
    "step3_title": "Réservez en Sécurité",
    "step3_desc": "Calculez votre devis instantané et confirmez votre réservation avec paiement sécurisé ou acompte sur place.",
    "per_day": "/ jour",
    "view_listing": "Voir l'annonce",
    "max_capacity": "max"
};

const enStrings = {
    "all_regions": "All regions",
    "all_cities": "All cities",
    "all_types": "All types",
    "explore_category": "Explore by Category",
    "explore_desc": "Find the space that fits the size and prestige of your event.",
    "cat_party": "Party Halls",
    "cat_party_desc": "Weddings & Banquets",
    "cat_green": "Green Spaces",
    "cat_green_desc": "Gardens & Kribi Beaches",
    "cat_vip": "VIP Terraces",
    "cat_vip_desc": "Rooftops & Cocktails",
    "cat_office": "Offices & Coworking",
    "cat_office_desc": "Meetings & Workshops",
    "cat_conf": "Conference Rooms",
    "cat_conf_desc": "Seminars & Training",
    "cat_villa": "Prestige Villas",
    "cat_villa_desc": "Pools & VIP Stays",
    "latest_venues": "Newly Added Venues",
    "latest_venues_desc": "Discover the latest spaces published by our hosts.",
    "no_latest": "No newly added venues.",
    "no_featured": "No featured venues.",
    "how_it_works": "How does Celebra Cameroon work?",
    "how_it_works_desc": "Book an event venue with peace of mind thanks to our guarantees and interactive features.",
    "step1_title": "Find & Filter",
    "step1_desc": "Search by city (Douala, Yaoundé, Kribi...), capacity, budget, and amenities.",
    "step2_title": "Chat & Visit",
    "step2_desc": "Talk directly with the owner through internal messaging, make an audio/video call, or schedule a physical visit of the place.",
    "step3_title": "Book Safely",
    "step3_desc": "Calculate your instant quote and confirm your booking with secure payment or on-site deposit.",
    "per_day": "/ day",
    "view_listing": "View listing",
    "max_capacity": "max"
};

updateLocale('fr', frStrings);
updateLocale('en', enStrings);
