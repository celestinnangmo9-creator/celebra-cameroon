const fs = require('fs');
const fr = JSON.parse(fs.readFileSync('resources/js/locales/fr.json'));
const en = JSON.parse(fs.readFileSync('resources/js/locales/en.json'));

fr.messages = {
  page_title: "Messagerie",
  contacts: "Contacts",
  no_contacts: "Aucun contact pour le moment.",
  linked_to: "Lié à :",
  start_conversation: "Envoyez un message pour démarrer la conversation.",
  placeholder: "Écrivez votre message...",
  select_contact: "Sélectionnez un contact pour discuter",
  send_error: "Erreur d'envoi"
};

en.messages = {
  page_title: "Messages",
  contacts: "Contacts",
  no_contacts: "No contacts at the moment.",
  linked_to: "Linked to:",
  start_conversation: "Send a message to start the conversation.",
  placeholder: "Write your message...",
  select_contact: "Select a contact to chat",
  send_error: "Send error"
};

fs.writeFileSync('resources/js/locales/fr.json', JSON.stringify(fr, null, 2));
fs.writeFileSync('resources/js/locales/en.json', JSON.stringify(en, null, 2));
console.log("Messages translations added.");
