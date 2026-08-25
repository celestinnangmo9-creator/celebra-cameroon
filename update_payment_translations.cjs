const fs = require('fs');
const fr = JSON.parse(fs.readFileSync('resources/js/locales/fr.json'));
const en = JSON.parse(fs.readFileSync('resources/js/locales/en.json'));

fr.bookings.payment = {
  page_title: "Paiement -",
  details_title: "Détails de la réservation",
  venue: "Lieu :",
  dates: "Dates :",
  from_to: "Du {start} au {end}",
  total: "Total de la réservation :",
  amount_now: "Montant à payer maintenant :",
  payment_option: "Option de paiement",
  deposit: "Acompte (50%)",
  deposit_desc: "Réservez la salle maintenant et payez le reste plus tard.",
  full: "Totalité (100%)",
  full_desc: "Payez tout d'un coup pour être tranquille.",
  choose_method: "Choisissez votre méthode de paiement",
  phone: "Numéro de téléphone",
  phone_placeholder: "Ex: 690000000",
  processing: "Initiation en cours...",
  pay_now: "Payer maintenant",
  secure: "Paiement sécurisé via Sandbox (Test mode)",
  simulation_title: "Simulation de Paiement",
  ussd_title: "Validation USSD (Sandbox)",
  ussd_desc: "Ceci est un environnement de test. Simulez l'action que l'utilisateur ferait sur son téléphone.",
  amount: "Montant:",
  sim_success: 'Simuler "Code PIN validé (Succès)"',
  sim_failed: 'Simuler "Paiement refusé / Annulé (Échec)"'
};

en.bookings.payment = {
  page_title: "Payment -",
  details_title: "Booking details",
  venue: "Venue:",
  dates: "Dates:",
  from_to: "From {start} to {end}",
  total: "Total booking price:",
  amount_now: "Amount to pay now:",
  payment_option: "Payment option",
  deposit: "Deposit (50%)",
  deposit_desc: "Book the venue now and pay the rest later.",
  full: "Full amount (100%)",
  full_desc: "Pay everything at once for peace of mind.",
  choose_method: "Choose your payment method",
  phone: "Phone number",
  phone_placeholder: "Ex: 690000000",
  processing: "Initiating...",
  pay_now: "Pay now",
  secure: "Secure payment via Sandbox (Test mode)",
  simulation_title: "Payment Simulation",
  ussd_title: "USSD Validation (Sandbox)",
  ussd_desc: "This is a test environment. Simulate the action the user would take on their phone.",
  amount: "Amount:",
  sim_success: 'Simulate "PIN validated (Success)"',
  sim_failed: 'Simulate "Payment declined / Cancelled (Failure)"'
};

fs.writeFileSync('resources/js/locales/fr.json', JSON.stringify(fr, null, 2));
fs.writeFileSync('resources/js/locales/en.json', JSON.stringify(en, null, 2));
console.log("Bookings payment translations added.");
