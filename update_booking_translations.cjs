const fs = require('fs');

const updateLocale = (lang, newStrings) => {
    const path = `resources/js/locales/${lang}.json`;
    let content = {};
    if (fs.existsSync(path)) {
        content = JSON.parse(fs.readFileSync(path, 'utf8'));
    }
    
    if (!content.booking_calendar) content.booking_calendar = {};
    Object.assign(content.booking_calendar, newStrings.booking_calendar);

    if (!content.calendar) content.calendar = {};
    Object.assign(content.calendar, newStrings.calendar);
    
    fs.writeFileSync(path, JSON.stringify(content, null, 2));
    console.log(`Updated ${lang}.json`);
};

const frStrings = {
    booking_calendar: {
        "per_day": "/ jour",
        "your_space": "C'est votre espace",
        "cannot_book": "Vous ne pouvez pas réserver votre propre salle. Accédez au tableau de bord pour gérer vos disponibilités.",
        "go_dashboard": "Aller au tableau de bord",
        "planned_dates": "Dates prévues",
        "select_dates": "Sélectionner vos dates",
        "event_type": "Type d'événement",
        "type_party": "Fête / Célébration",
        "type_wedding": "Mariage",
        "type_conference": "Conférence / Réunion",
        "type_shooting": "Shooting Photo/Vidéo",
        "type_other": "Autre",
        "guest_count": "Nombre d'invités",
        "max_people": "Max: {capacity} personnes",
        "special_requests": "Demandes spéciales (Optionnel)",
        "requests_placeholder": "Ex: Besoin d'un traiteur, chaises supplémentaires...",
        "estimated_total": "Total estimé",
        "processing": "Traitement...",
        "book_space": "Réserver cet espace",
        "no_charge": "Aucun montant ne vous sera débité pour le moment."
    },
    calendar: {
        "available": "Disponible",
        "selected": "Sélectionné",
        "unavailable": "Réservé / Indisponible"
    }
};

const enStrings = {
    booking_calendar: {
        "per_day": "/ day",
        "your_space": "It's your space",
        "cannot_book": "You cannot book your own venue. Go to the dashboard to manage your availabilities.",
        "go_dashboard": "Go to dashboard",
        "planned_dates": "Planned dates",
        "select_dates": "Select your dates",
        "event_type": "Event type",
        "type_party": "Party / Celebration",
        "type_wedding": "Wedding",
        "type_conference": "Conference / Meeting",
        "type_shooting": "Photo/Video Shooting",
        "type_other": "Other",
        "guest_count": "Number of guests",
        "max_people": "Max: {capacity} people",
        "special_requests": "Special requests (Optional)",
        "requests_placeholder": "Ex: Need a caterer, extra chairs...",
        "estimated_total": "Estimated total",
        "processing": "Processing...",
        "book_space": "Book this space",
        "no_charge": "You won't be charged yet."
    },
    calendar: {
        "available": "Available",
        "selected": "Selected",
        "unavailable": "Booked / Unavailable"
    }
};

updateLocale('fr', frStrings);
updateLocale('en', enStrings);
