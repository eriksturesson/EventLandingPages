import { SiteSettingsData } from '../interfaces/SettingsInterfaces';

export const applySiteSettings = (settings: SiteSettingsData) => {
   // CSS
   if (settings.customCSS) {
      const styleTag = document.createElement('style');
      styleTag.id = 'custom-site-css'; // ge id för att kunna ta bort den sen
      styleTag.innerHTML = settings.customCSS;
      document.head.appendChild(styleTag);
   }

   // Custom HTML i <head>
   if (settings.customHTMLHead) {
      const headFrag = document.createRange().createContextualFragment(settings.customHTMLHead);
      headFrag.querySelectorAll('*').forEach((el) => el.setAttribute('data-custom-injected', 'true'));
      document.head.appendChild(headFrag);
   }

   // Custom HTML i body (i slutet)
   if (settings.customHTMLBodyEnd) {
      const bodyFrag = document.createRange().createContextualFragment(settings.customHTMLBodyEnd);
      bodyFrag.querySelectorAll('*').forEach((el) => el.setAttribute('data-custom-injected', 'true'));
      document.body.appendChild(bodyFrag);
   }

   // Fonts och färger
   if (settings.font) document.body.style.fontFamily = settings.font;
   if (settings.textColor) document.body.style.color = settings.textColor;
   if (settings.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
   }
};
