import React from 'react';
import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
   title?: string; // optional page-specific title
   description?: string; // optional description from DB or context
   imageUrl?: string; // optional image url from DB or context
   url?: string; // optional URL, defaults to window.location.href
   siteName?: string; // your site name from settings
}

const PageMeta: React.FC<PageMetaProps> = ({ title, description, imageUrl, url, siteName }) => {
   // Compose title fallback logic
   const pageTitle = title ? (siteName ? `${title} | ${siteName}` : title) : siteName || 'Welcome';

   const metaDescription = description || 'Discover and join exciting events near you.';
   const metaUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

   return (
      <Helmet>
         <title>{pageTitle}</title>
         <meta name="description" content={metaDescription} />

         <meta property="og:title" content={pageTitle} />
         <meta property="og:description" content={metaDescription} />
         {imageUrl && <meta property="og:image" content={imageUrl} />}
         <meta property="og:type" content="website" />
         <meta property="og:url" content={metaUrl} />
      </Helmet>
   );
};

export default PageMeta;
