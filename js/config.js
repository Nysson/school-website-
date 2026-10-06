/**
 * SCHOOL CONFIG — the single place for contact data.
 * Header, footer, the contact section and the map all render from this object.
 * Any field left as an empty string '' is hidden automatically.
 */
window.SCHOOL_CONFIG = {
  // Public address of the website (used for canonical links / sharing). Change when a domain is bought.
  siteUrl: 'https://nysson.github.io/school-website-/',

  languages: ['uz', 'en'], // add 'ru' here after adding a dictionary in js/i18n.js
  defaultLang: 'uz',

  name: {
    uz: 'Alisher Navoi nomidagi oʻzbek tili va adabiyotiga ixtisoslashtirilgan davlat umumtaʼlim maktabi',
    en: 'Alisher Navoi Specialized School in Navoi — a specialized state school for Uzbek language and literature'
  },
  shortName: {
    uz: 'Alisher Navoi nomidagi IDUM',
    en: 'Alisher Navoi Specialized School in Navoi'
  },

  address: {
    uz: 'Navoi viloyati, Navoi shahri, Mahmud Tarobiy koʻchasi, 125a bino',
    en: '125a Mahmud Tarobiy Street, Navoi city, Navoi region, Uzbekistan'
  },
  // Query sent to Google Maps for the embedded map and "Get directions".
  mapQuery: 'Mahmud Tarobiy 125a, Navoi, Uzbekistan',

  phone: '+998949527872',            // used in tel: links
  phoneDisplay: '+998 94 952 78 72', // how it is shown

  // ---- Channels not available yet: fill in to show them everywhere automatically ----
  email: '',     // e.g. 'info@example.uz'
  social: {
    facebook: 'https://www.facebook.com/share/1F7xfA4DqJ/',
    instagram: '', // e.g. 'https://www.instagram.com/...'
    telegram: ''   // e.g. 'https://t.me/...'
  }
};
