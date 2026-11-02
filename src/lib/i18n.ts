// Small interface labels (buttons, form fields, navigation) and the he/en page paths.
// Page content lives in content/; only short UI strings belong here.
import type { Lang } from './content';

export const routes = {
  home: '',
  about: 'about',
  projects: 'projects',
  contact: 'contact',
  accessibility: 'accessibility',
} as const;

export type PageKey = keyof typeof routes;

/** Path of a page in a language: path('he','about') → "/about/", path('en','home') → "/en/". */
export function path(lang: Lang, key: PageKey): string {
  const slug = routes[key];
  const prefix = lang === 'he' ? '' : '/en';
  return slug ? `${prefix}/${slug}/` : `${prefix}/`;
}

export const otherLang = (lang: Lang): Lang => (lang === 'he' ? 'en' : 'he');

export const ui = {
  he: {
    skip: 'דילוג לתוכן',
    menu: 'תפריט',
    nav_label: 'ראשי',
    lang_name: 'עברית',
    home: 'דף הבית',
    about: 'אודות',
    projects: 'פרויקטים',
    contact: 'יצירת קשר',
    accessibility: 'הצהרת נגישות',
    // Grid-axis labels drawn around page headings, as on a structural drawing.
    axes: 'אבג',
    logo_alt: 'ל.ב.ל הנדסה וביצוע – לדף הבית',
    phone: 'טלפון',
    fax: 'פקס',
    email: 'אימייל',
    address: 'כתובת',
    open_map: 'פתיחה ב-Google Maps',
    rights: 'כל הזכויות שמורות',
    footer_menu: 'ניווט תחתון',
    // Gallery and lightbox
    gallery: 'גלריית פרויקטים',
    enlarge: 'הגדלת התמונה',
    close: 'סגירה',
    prev: 'התמונה הקודמת',
    next: 'התמונה הבאה',
    count: 'תמונה {n} מתוך {total}',
    strip_label: 'תמונות מפרויקטים',
    strip_prev: 'הקודם',
    strip_next: 'הבא',
    // Contact form
    form_name: 'שם',
    form_email: 'אימייל',
    form_subject: 'נושא',
    form_message: 'הודעה',
    form_required: '(חובה)',
    form_send: 'שליחה',
    form_sending: 'שולח…',
    form_success: 'תודה! ההודעה נשלחה ונחזור אליכם בהקדם.',
    form_error: 'השליחה נכשלה. נסו שוב, או התקשרו אלינו.',
    form_err_name: 'נא למלא שם.',
    form_err_email: 'נא למלא כתובת אימייל.',
    form_err_email_invalid: 'נא למלא כתובת אימייל תקינה, לדוגמה name@example.com.',
    form_err_summary: 'יש לתקן את השדות המסומנים.',
    form_not_configured: 'הטופס עדיין לא מחובר. בינתיים אפשר לשלוח אימייל או להתקשר.',
    form_email_subject: 'פנייה חדשה מאתר ל.ב.ל',
    not_found_title: 'העמוד לא נמצא',
    not_found_text: 'ייתכן שהקישור ישן או שהעמוד הועבר.',
    not_found_back: 'חזרה לדף הבית',
  },
  // TODO(review): English UI strings translated by AI. Have them reviewed with the page content.
  en: {
    skip: 'Skip to content',
    menu: 'Menu',
    nav_label: 'Main',
    lang_name: 'English',
    home: 'Home',
    about: 'About',
    projects: 'Projects',
    contact: 'Contact',
    accessibility: 'Accessibility statement',
    axes: 'ABC',
    logo_alt: 'LBL Engineering – home',
    phone: 'Phone',
    fax: 'Fax',
    email: 'Email',
    address: 'Address',
    open_map: 'Open in Google Maps',
    rights: 'All rights reserved',
    footer_menu: 'Footer',
    gallery: 'Project gallery',
    enlarge: 'Enlarge photo',
    close: 'Close',
    prev: 'Previous photo',
    next: 'Next photo',
    count: 'Photo {n} of {total}',
    strip_label: 'Project photos',
    strip_prev: 'Previous',
    strip_next: 'Next',
    form_name: 'Name',
    form_email: 'Email',
    form_subject: 'Subject',
    form_message: 'Message',
    form_required: '(required)',
    form_send: 'Send',
    form_sending: 'Sending…',
    form_success: 'Thank you! Your message was sent and we will get back to you soon.',
    form_error: 'Sending failed. Please try again, or give us a call.',
    form_err_name: 'Please enter your name.',
    form_err_email: 'Please enter your email address.',
    form_err_email_invalid: 'Please enter a valid email address, for example name@example.com.',
    form_err_summary: 'Please correct the highlighted fields.',
    form_not_configured: 'The form is not connected yet. Please email or call us in the meantime.',
    form_email_subject: 'New message from the LBL website',
    not_found_title: 'Page not found',
    not_found_text: 'The link may be out of date, or the page may have moved.',
    not_found_back: 'Back to the home page',
  },
} satisfies Record<Lang, Record<string, string>>;

export type UI = (typeof ui)['he'];
